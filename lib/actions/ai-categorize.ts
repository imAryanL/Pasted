  "use server"

  // ai-categorize.ts
  // Takes a save's title, description, and URL, sends them to Gemini Flash,
  // and returns a category, summary, and tags.
  // If Gemini fails, returns defaults so the save still works.

  import { gemini } from "@/lib/gemini"

type AICategorization = {
    category: string;
    short_summary: string;
    summary: string;
    tags: string[];
}


const CATEGORIES = [
    "Technology", "Entertainment", "News", "Sports", "Education",
    "Business", "Social Media", "Shopping", "Travel", "Health",
    "Food", "Design", "Science", "Finance", "Other"
] as const;


const DEFAULT_RESULT: AICategorization = {
    category: "Other",
    short_summary: "",
    summary: "",
    tags: [],
};


  // Main function — takes URL metadata + optional image, asks Gemini to categorize it
  export async function categorizeWithAI(
      title: string | null,
      description: string | null,
      url: string,
      imageUrl: string | null = null
  ): Promise<AICategorization> {
      try {
        // Step 1: Build the prompt — tells Gemini exactly what JSON to return
        const prompt = `Analyze this webpage${imageUrl ? " and its preview image" : ""} and return a JSON object with exactly these fields:
        - "category": one of [${CATEGORIES.join(", ")}]
        - "short_summary": exactly 1 concise sentence for a card preview. Get straight to the point — do NOT start with "This post", "This video", "This article", or "This X post". Just describe the content directly.
        - "summary": a 2-3 sentence summary of what this page is about (for detailed view)
        - "tags": an array of 3-5 relevant single-word or short tags

        Webpage info:
        - URL: ${url}
        - Title: ${title || "Unknown"}
        - Description: ${description || "No description available"}

        Return ONLY valid JSON. No markdown, no code fences, no explanation.`;

          // Step 2: Build contents — include image if available for better summaries
          let contents: any;

          if (imageUrl) {
            try {
              // Fetch the OG image and convert to base64 for Gemini vision
              const imgResponse = await fetch(imageUrl);
              const imageBuffer = await imgResponse.arrayBuffer();
              const base64Image = Buffer.from(imageBuffer).toString("base64");
              const mimeType = imgResponse.headers.get("content-type") || "image/jpeg";

              contents = [
                { inlineData: { mimeType, data: base64Image } },
                { text: prompt },
              ];
            } catch {
              // If image fetch fails, fall back to text-only
              contents = prompt;
            }
          } else {
            contents = prompt;
          }

          // Step 3: Call Gemini Flash (JSON mode = clean output, no code fences)
          const response = await gemini.models.generateContent({
              model: "gemini-2.5-flash",
              contents,
              config: {
                  responseMimeType: "application/json",
                  // Disable thinking — our task is simple classification, no reasoning needed
                  thinkingConfig: { thinkingBudget: 0 },
              },
          });

          // Step 3: Parse the response
          const text = response.text;
          if (!text) return DEFAULT_RESULT;

          const parsed = JSON.parse(text);


          // Step 4: Return the result, with fallbacks for bad data
          return {
              category: CATEGORIES.includes(parsed.category) ? parsed.category : "Other",
              short_summary: parsed.short_summary || "",
              summary: parsed.summary || "",
              tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
          };

      } catch {
          // If Gemini is down or returns garbage, return defaults
          // The save still works — it just won't be categorized
          return DEFAULT_RESULT;
      }
  }
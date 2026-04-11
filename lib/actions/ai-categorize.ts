  "use server"

  // ai-categorize.ts
  // Takes a save's title, description, and URL, sends them to Gemini Flash,
  // and returns a category, summary, and tags.
  // If Gemini fails, returns defaults so the save still works.

  import { gemini } from "@/lib/gemini"

type AICategorization = {
    ai_title: string;
    category: string;
    short_summary: string;
    summary: string;
    tags: string[];
    actionable_steps: Array<{ id: string; text: string; completed: boolean }>;
    action_type: string;
}


const CATEGORIES = [
    "Technology", "Entertainment", "News", "Sports", "Education",
    "Business", "Social Media", "Shopping", "Travel", "Health",
    "Food", "Design", "Science", "Finance", "Other"
] as const;


const DEFAULT_RESULT: AICategorization = {
    ai_title: "",
    category: "Other",
    short_summary: "",
    summary: "",
    tags: [],
    actionable_steps: [],
    action_type: "",
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
        - "ai_title": a clean, descriptive title for this content in 3-8 words. Describe WHAT the content is about, not WHO posted it. Never include usernames, @handles, platform names (X, Instagram, TikTok, YouTube, Reddit), "on Instagram", "on X", hashtags, or emoji. Just a clear, human-readable title. Examples: "SpaceX Starship Test Flight Update", "Homemade Pasta Recipe Tutorial", "React Server Components Explained".
        - "category": one of [${CATEGORIES.join(", ")}]
        - "short_summary": exactly 1 concise sentence for a card preview. Get straight to the point — do NOT start with "This post", "This video", "This article", or "This X post". Just describe the content directly.
        - "summary": a detailed 4-6 sentence summary of what this page is about. Include key details, context, and why it matters. This is for a detailed modal view so be thorough.
        - "tags": an array of 3-5 relevant single-word or short tags
        - "action_type": a single action verb that best describes what the reader should do with this content. Pick one: "Cook", "Watch", "Read", "Build", "Try", "Learn", "Buy", "Visit", "Listen", "Exercise", or "Explore". If no actionable steps, return "".
        - "actionable_steps": Think about whether a reader could realistically DO something based on this content. For tutorials/recipes/guides, extract the actual steps. For other content where action makes sense (fitness tips → "Add this to your workout", product reviews → "Compare prices", travel content → "Research flights", cooking posts → "Try making this recipe"), generate 3-5 creative but relevant steps. Only return an empty array [] if there's genuinely nothing actionable (random memes, celebrity gossip, pure entertainment with no takeaway). Use your judgment. Format: array of objects with "id" (string starting from "1"), "text" (short imperative action), and "completed" (always false).

        Webpage info:
        - URL: ${url}
        - Title: ${title || "Unknown"}
        - Description: ${description || "No description available"}

        Return ONLY valid JSON. No markdown, no code fences, no explanation.`;

          // Step 2: Build contents — include image if available for better summaries
          let contents: any;

          if (imageUrl) {
            try {
              // Only fetch http/https images (block file://, ftp://, etc.)
              const imgParsed = new URL(imageUrl);
              if (!['http:', 'https:'].includes(imgParsed.protocol)) throw new Error('bad protocol');

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
              ai_title: parsed.ai_title || "",
              category: CATEGORIES.includes(parsed.category) ? parsed.category : "Other",
              short_summary: parsed.short_summary || "",
              summary: parsed.summary || "",
              tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
              actionable_steps: Array.isArray(parsed.actionable_steps) ? parsed.actionable_steps : [],
              action_type: parsed.action_type || "",
          };

      } catch {
          // If Gemini is down or returns garbage, return defaults
          // The save still works — it just won't be categorized
          return DEFAULT_RESULT;
      }
  }
"use server"

// fetch-metadata.ts
// This server action takes a URL, fetches the page's HTML,
// and extracts Open Graph metadata (title, description, image, site name).
// Used when a user pastes a URL into Pasted — we grab the preview info automatically.

import { z } from "zod"
import { load } from "cheerio";  // load takes HTML string and gives us a $ selector (like jQuery)

const urlSchema = z.string().url();

type OgMetadata = {
    title: string | null;
    description: string | null;
    image: string | null;
    siteName: string | null;
}

// The main function — takes a URL, returns its OG metadata
export async function fetchMetadata(url: string): Promise<OgMetadata> {

    // Step 1: Validate the URL with Zod
    // If someone passes garbage instead of a real URL, we bail early
    const result = urlSchema.safeParse(url);
    if (!result.success) {
        return { title: null, description: null, image: null, siteName: null };
    }

    // Step 1b: Only allow http/https protocols (block file://, ftp://, etc.)
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { title: null, description: null, image: null, siteName: null };
    }

    try {

        // Step 2a: TikTok blocks OG scraping, so use their oEmbed API instead
        // Docs: https://developers.tiktok.com/doc/embed-videos/
        if (url.includes("tiktok.com")) {
            const response = await fetch(`https://www.tiktok.com/oembed?url=${url}`);
            const data = await response.json();
            return {
                title: data.title || null,
                description: data.title || null,
                image: data.thumbnail_url || null,
                siteName: data.provider_name || null,
            };
        }
        // Step 2: Fetch the HTML from the URL
        // - signal: AbortSignal.timeout(5000) = give up after 5 seconds (don't hang forever)
        // - User-Agent header = identifies our bot so sites don't block us
        const response = await fetch(url, {
            signal: AbortSignal.timeout(5000),
            headers: { "User-Agent": "PastedBot/1.0" },
        });

        // If the request failed (404, 500, etc.), return nulls
        if (!response.ok) {
            return { title: null, description: null, image: null, siteName: null };
        }

        // Step 3: Get the HTML as a string
        const html = await response.text();

        // Step 4: Parse the HTML with cheerio
        // load() gives us $, which works like jQuery — we can query HTML with CSS selectors
        const $ = load(html);

        // Step 5: Extract OG tags using CSS selectors
        // $('meta[property="og:title"]') finds <meta property="og:title" content="...">
        // .attr("content") grabs the content attribute value
        const ogTitle = $('meta[property="og:title"]').attr("content") || null;
        const description = $('meta[property="og:description"]').attr("content") || null;
        const image = $('meta[property="og:image"]').attr("content") || null;
        const siteName = $('meta[property="og:site_name"]').attr("content") || null;

        // Step 6: Fallback — if no og:title exists, try the regular <title> tag
        let title = ogTitle || $("title").text() || null;

        // Step 7: Clean up Instagram metadata — their OG tags are messy
        // Title comes as: "Username on Instagram: "caption...""
        // Description comes as: "130K likes, 149 comments - username on date: "caption...""
        if (url.includes("instagram.com")) {
            if (title) {
                // Strip "Username on Instagram: " prefix, keep the caption
                title = title.replace(/^.+?\s+on\s+Instagram:\s*/, "").replace(/^"|"$/g, "");
            }
            if (description) {
                // Strip "XXK likes, XX comments - username on date: " prefix
                const cleaned = description.replace(/^[\d.]+[KMB]?\s+likes?,\s*[\d.]+[KMB]?\s+comments?\s*-\s*.+?:\s*/, "");
                return { title, description: cleaned || description, image, siteName };
            }
        }

        return { title, description, image, siteName };

    } catch {
        // If anything goes wrong (network error, timeout, weird HTML), return nulls
        // This prevents the app from crashing just because one URL is broken
        return { title: null, description: null, image: null, siteName: null };
    }
}
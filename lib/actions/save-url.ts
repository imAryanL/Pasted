"use server"

// save-url.ts
// This server action handles saving a URL to the database.
// It validates the input, fetches OG metadata, checks the free tier limit,
// and inserts the save into the database.

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { fetchMetadata } from "./fetch-metadata"
import { revalidatePath } from "next/cache"
import { categorizeWithAI } from "./ai-categorize"

// Zod schema — validates that the input is a real URL
const saveUrlSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
});

// Return type — tells the frontend whether the save worked or not
type SaveResult = {
    success: boolean;
    error?: string;
};

// The main function — takes a URL, fetches metadata, saves to DB
export async function saveUrl(url: string): Promise<SaveResult> {

    // Step 1: Validate the URL with Zod
    const validated = saveUrlSchema.safeParse({ url });
    if (!validated.success) {
        return { success: false, error: "Invalid URL" };
    }

    // Step 2: Get the Supabase client and check who's logged in
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If no user is logged in, block the save
    if (authError || !user) {
        return { success: false, error: "You must be logged in to save" };
    }

    // Step 3: Check the free tier limit (30 saves/month)
    // First, figure out what month it is right now (e.g. "2026-03")
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Fetch the user's profile to check their save count
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_tier, saves_count_this_month, saves_month")
        .eq("user_id", user.id)
        .single();

    if (profileError || !profile) {
        return { success: false, error: "Could not load your profile" };
    }

    // If they're on the free tier, check if they've hit 30 saves this month
    if (profile.subscription_tier === "free") {
        // If it's a new month, the count resets (we'll update it below)
        const savesThisMonth = profile.saves_month === currentMonth
            ? profile.saves_count_this_month
            : 0;

        if (savesThisMonth >= 15) {
            return { success: false, error: "Free tier limit reached (15 saves/month). Upgrade to Pro!" };
        }
    }

    // Step 4: Fetch OG metadata for the URL (uses our other server action)
    const metadata = await fetchMetadata(url);

    // Step 4.5: Ask Gemini to categorize, summarize, and tag the URL
    const aiResult = await categorizeWithAI(metadata.title, metadata.description, url, metadata.image);

    // Step 5: Insert the save into the database
    const { error: insertError } = await supabase
        .from("saves")
        .insert({
            user_id: user.id,
            url: validated.data.url,
            title: metadata.title,
            ai_title: aiResult.ai_title || null,
            short_summary: aiResult.short_summary || null,
            summary: aiResult.summary || metadata.description,
            image_url: metadata.image,
            source_type: metadata.siteName,
            category: aiResult.category,
            tags: aiResult.tags,
            actionable_steps: aiResult.actionable_steps,
            action_type: aiResult.action_type || null,
        });

    if (insertError) {
        return { success: false, error: "Failed to save URL" };
    }

    // Step 6: Update the user's save count in their profile
    // If it's a new month, reset the count to 1. Otherwise, increment by 1.
    const newCount = profile.saves_month === currentMonth
        ? profile.saves_count_this_month + 1
        : 1;

    await supabase
        .from("profiles")
        .update({
            saves_count_this_month: newCount,
            saves_month: currentMonth,
        })
        .eq("user_id", user.id);

    // revalidatePath tells Next.js to refresh the cached page data so new saves show up quickly without a manual refresh of the site 
    revalidatePath("/")
    // Done! The URL is saved.
    return { success: true };
}

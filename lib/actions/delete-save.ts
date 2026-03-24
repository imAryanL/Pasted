"use server"

// delete-save.ts
// Server action to delete a save from the database.
// Validates the save ID, verifies ownership, decrements the monthly count.

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const deleteSaveSchema = z.object({
    id: z.string().min(1, "Invalid save ID"),
});

  type DeleteResult = {
      success: boolean;
      error?: string;
  };

export async function deleteSave(id: string): Promise<DeleteResult> {

    // Step 1: Validate the ID with Zod
    const validated = deleteSaveSchema.safeParse({ id });
    if (!validated.success) {
        return { success: false, error: "Invalid ID" };
    }

    // Step 2: Get the Supabase client and check who's logged in
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If no user is logged in, block the save
    if (authError || !user) {
        return { success: false, error: "You must be logged in to delete" };
    }

       // Step 3: Delete the save from the database
      const { error: deleteError } = await supabase
          .from("saves")
          .delete()
          .eq("id", validated.data.id)
          .eq("user_id", user.id);

      if (deleteError) {
          return { success: false, error: "Failed to delete save" };
      }

    // Step 4: Decrement the monthly save count
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("saves_count_this_month")
        .eq("user_id", user.id)
        .single();

    if (!profileError && profile) {
        await supabase
            .from("profiles")
            .update({
                saves_count_this_month: Math.max(0, profile.saves_count_this_month - 1),
            })
            .eq("user_id", user.id);
    }

// Step 5: Revalidate and return:
    revalidatePath("/");
    return { success: true };
}

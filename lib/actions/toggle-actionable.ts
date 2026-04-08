// toggle-actionable.ts
// Server action to toggle an actionable step's completed status.
// Reads the current steps from Supabase, flips the matching step, writes it back.

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleActionableStep(saveId: string, stepId: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { success: false, error: "You must be logged in" }
    }

    // Fetch the save (only if it belongs to this user)
    const { data: save, error: fetchError } = await supabase
        .from("saves")
        .select("actionable_steps")
        .eq("id", saveId)
        .eq("user_id", user.id)
        .single()

    if (fetchError || !save) {
        return { success: false, error: "Save not found" }
    }

    // Flip the completed boolean on the matching step
    const steps = (save.actionable_steps || []) as Array<{ id: string; text: string; completed: boolean }>
    const updated = steps.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
    )

    // Write it back
    const { error: updateError } = await supabase
        .from("saves")
        .update({ actionable_steps: updated })
        .eq("id", saveId)
        .eq("user_id", user.id)

    if (updateError) {
        return { success: false, error: "Failed to update step" }
    }

    revalidatePath("/actionables")
    return { success: true }
}

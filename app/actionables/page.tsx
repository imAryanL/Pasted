// app/actionables/page.tsx
// Actionables page — shows saves that have AI-extracted action steps.
// Server Component that queries Supabase and renders ActionableCard grid.

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ActionableCard } from "@/components/actionable-card"
import { ClipboardCheck } from "lucide-react"
import type { Save } from "@/types/save"

export default async function ActionablesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    // Fetch saves that have actionable steps
    const { data: saves } = await supabase
        .from("saves")
        .select("*")
        .eq("user_id", user.id)
        .not("actionable_steps", "eq", "[]")
        .order("created_at", { ascending: false })

    // Filter out saves with empty or null actionable_steps
    const actionableSaves = (saves as Save[] || []).filter(
        s => s.actionable_steps && s.actionable_steps.length > 0
    )

    return (
        <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Actionables</h1>
                <p className="text-muted-foreground mt-1">
                    AI-generated action steps from your saves. Check them off as you go.
                </p>
            </div>

            {/* Cards grid or empty state */}
            {actionableSaves.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {actionableSaves.map(save => (
                        <ActionableCard key={save.id} save={save} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <ClipboardCheck className="size-12 text-muted-foreground/40 mb-4" />
                    <h2 className="text-xl font-semibold">No actionables yet</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Save some tutorials, how-to guides, or recipes and we'll automatically extract action steps for you.
                    </p>
                </div>
            )}
        </div>
    )
}

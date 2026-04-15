// app/actionables/page.tsx
// Actionables page — shows saves that have AI-extracted action steps.
// Server Component that queries Supabase and renders ActionableCard grid.

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ActionableCard } from "@/components/actionable-card"
import { AnimatedSaveGrid, AnimatedCard } from "@/components/animated-save-grid"
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

    // Compute stats for the header
    const pendingCount = actionableSaves.filter(
        s => s.actionable_steps!.some(step => !step.completed)
    ).length
    const avgCompletion = actionableSaves.length > 0
        ? Math.round(
            actionableSaves.reduce((sum, s) => {
                const steps = s.actionable_steps!
                return sum + (steps.filter(st => st.completed).length / steps.length) * 100
            }, 0) / actionableSaves.length
        )
        : 0

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
            {/* Page header with stats */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Actionables</h1>
                    <p className="text-muted-foreground mt-1">
                        Turn your saved bookmarks into completed tasks.
                    </p>
                </div>

                {actionableSaves.length > 0 && (
                    <div className="flex rounded-xl border border-border/50 bg-zinc-800 overflow-hidden">
                        <div className="px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-[#b89478]">{pendingCount}</p>
                            <p className="text-xs text-muted-foreground">Pending Tasks</p>
                        </div>
                        <div className="w-px bg-border/50" />
                        <div className="px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-[#b89478]">{avgCompletion}%</p>
                            <p className="text-xs text-muted-foreground">Avg Completion</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stacked cards or empty state */}
            {actionableSaves.length > 0 ? (
                <AnimatedSaveGrid className="space-y-4">
                    {actionableSaves.map(save => (
                        <AnimatedCard key={save.id}>
                            <ActionableCard save={save} />
                        </AnimatedCard>
                    ))}
                </AnimatedSaveGrid>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <ClipboardCheck className="size-12 text-muted-foreground/40 mb-4" />
                    <h2 className="text-xl font-semibold">No actionables yet</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Save any link and we'll use AI to extract actionable next steps you can check off.
                    </p>
                </div>
            )}
        </div>
    )
}

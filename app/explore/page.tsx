// app/explore/page.tsx
// Explore page — shows AI-generated deep dives for each save.
// For every saved URL, Gemini generates a "why this matters" blurb + related topics.
// Related topic pills link to Google search so users can explore without hallucinated URLs.

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Compass, Lightbulb, ImageOff } from "lucide-react"
import { AnimatedSaveGrid, AnimatedCard } from "@/components/animated-save-grid"
import type { Save } from "@/types/save"

export default async function ExplorePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    // Only fetch saves that have explore_data
    const { data: saves } = await supabase
        .from("saves")
        .select("*")
        .eq("user_id", user.id)
        .not("explore_data", "is", null)
        .order("created_at", { ascending: false })

    const exploreSaves = (saves as Save[] || []).filter(s => s.explore_data !== null)

    return (
        <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
            {/* Editorial page header */}
            <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">Explore your saves</h1>
                <p className="text-muted-foreground mt-1">
                    See what&apos;s connected to everything you&apos;ve saved.
                </p>
            </div>

            {/* Explore grid or empty state */}
            {exploreSaves.length > 0 ? (
                <AnimatedSaveGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exploreSaves.map(save => (
                        <AnimatedCard key={save.id}>
                            <ExploreCard save={save} />
                        </AnimatedCard>
                    ))}
                </AnimatedSaveGrid>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Compass className="size-12 text-muted-foreground/40 mb-4" />
                    <h2 className="text-xl font-semibold">Nothing to explore yet</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Save a new link and Pasted AI will generate a deep dive for you to explore.
                    </p>
                </div>
            )}
        </div>
    )
}

function ExploreCard({ save }: { save: Save }) {
    const explore = save.explore_data!
    const displayTitle = save.ai_title || save.title || save.url

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-zinc-800">
            {/* Card body */}
            <div className="flex-1 flex flex-col p-6 space-y-5">
                {/* Thumbnail + title */}
                <div className="flex items-start gap-4">
                    <div className="shrink-0 size-14 rounded-xl overflow-hidden bg-zinc-700">
                        {save.image_url ? (
                            <img
                                src={save.image_url}
                                alt=""
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="size-full flex items-center justify-center">
                                <ImageOff className="size-5 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold leading-snug line-clamp-2">{displayTitle}</h2>
                        {save.source_type && (
                            <p className="text-sm text-muted-foreground mt-0.5">{save.source_type.replace(/\s*\(formerly.*?\)/i, "")}</p>
                        )}
                    </div>
                </div>

                {/* Why this matters to you — editorial quote block */}
                <div className="relative rounded-xl border-l-4 border-[#b89478] bg-[#b89478]/10 px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="size-4 text-[#b89478]" />
                        <p className="text-xs font-bold text-[#b89478] uppercase tracking-widest">
                            Why this matters to you
                        </p>
                    </div>
                    <p className="text-base italic text-foreground/90 leading-relaxed">
                        &ldquo;{explore.why_this_matters}&rdquo;
                    </p>
                </div>

                {/* Related topics as pills — linked to Google search */}
                <div className="mt-auto">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        Related topics
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {explore.related_topics.map((topic, i) => (
                            <a
                                key={i}
                                href={`https://www.google.com/search?q=${encodeURIComponent(topic.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-full border border-[#b89478]/40 bg-[#b89478]/15 px-3.5 py-1.5 text-sm font-medium text-[#b89478] transition-all cursor-pointer hover:bg-[#b89478] hover:text-white hover:border-[#b89478]"
                            >
                                {topic.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

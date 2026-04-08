// components/actionable-card.tsx
// Displays a save's actionable steps as a checklist card.
// Shows: title, category badge, progress bar, checkable steps, and a link to the original URL.

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ExternalLink } from "lucide-react"
import type { Save } from "@/types/save"
import { toggleActionableStep } from "@/lib/actions/toggle-actionable"
import { toast } from "sonner"

type ActionableCardProps = {
  save: Save
}

export function ActionableCard({ save }: ActionableCardProps) {
  const steps = save.actionable_steps || []
  const completedCount = steps.filter(s => s.completed).length
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0

  // Title — prefer AI title, fall back to OG title, then URL
  const displayTitle = save.ai_title || save.title || save.url

  async function handleToggle(stepId: string) {
    const result = await toggleActionableStep(save.id, stepId)
    if (!result.success) {
      toast.error(result.error || "Failed to update step")
    }
  }

  return (
    <Card className="overflow-hidden rounded-xl border-border/50 bg-zinc-800 hover:ring-2 hover:ring-[#ccad97] transition-all">
      <CardContent className="p-5 space-y-4">
        {/* Header — title + category badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg leading-snug line-clamp-2">{displayTitle}</h3>
          {save.category && (
            <span className="shrink-0 rounded-full bg-[#ccad97]/15 px-2.5 py-0.5 text-xs text-[#ccad97] font-medium">
              {save.category}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedCount} of {steps.length} steps</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {steps.map(step => (
            <label
              key={step.id}
              className="flex items-start gap-3 cursor-pointer group/step"
            >
              <Checkbox
                checked={step.completed}
                onCheckedChange={() => handleToggle(step.id)}
                className="mt-0.5 border-muted-foreground/50 data-[state=checked]:bg-[#ccad97] data-[state=checked]:border-[#ccad97]"
              />
              <span className={`text-sm leading-relaxed ${step.completed ? "line-through text-muted-foreground/50" : "text-foreground"}`}>
                {step.text}
              </span>
            </label>
          ))}
        </div>

        {/* View source link */}
        <a
          href={save.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#ccad97] hover:underline cursor-pointer"
        >
          <ExternalLink className="size-3" />
          View original
        </a>
      </CardContent>
    </Card>
  )
}

// components/actionable-card.tsx
// Collapsible row card for the Actionables page.
// Collapsed: thumbnail, title, action type tag, progress bar, chevron.
// Expanded: checklist steps + "View Original" link.

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, ChevronDown, ImageOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Save } from "@/types/save"
import { toggleActionableStep } from "@/lib/actions/toggle-actionable"
import { toast } from "sonner"

type ActionableCardProps = {
  save: Save
}

export function ActionableCard({ save }: ActionableCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [localSteps, setLocalSteps] = useState(save.actionable_steps || [])
  const completedCount = localSteps.filter(s => s.completed).length
  const progress = localSteps.length > 0 ? Math.round((completedCount / localSteps.length) * 100) : 0

  const displayTitle = save.ai_title || save.title || save.url

  async function handleToggle(stepId: string) {
    // Make a copy of steps with the clicked one toggled
    const updatedSteps = localSteps.map(step => {
      if (step.id === stepId) {
        return { ...step, completed: !step.completed }
      }
      return step
    })

    // Update UI instantly
    setLocalSteps(updatedSteps)

    // Save to database in the background
    const result = await toggleActionableStep(save.id, stepId)
    if (!result.success) {
      setLocalSteps(save.actionable_steps || [])
      toast.error(result.error || "Failed to update step")
    }
  }

  return (
    <Card className="overflow-hidden rounded-xl border-border/50 bg-zinc-800 transition-all">
      <CardContent className="p-0">
        {/* Collapsed header row — always visible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-5 p-6 text-left cursor-pointer"
        >
          {/* Thumbnail */}
          <div className="shrink-0 size-15 rounded-lg overflow-hidden bg-zinc-700">
            {save.image_url ? (
              <img
                src={save.image_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center">
                <ImageOff className="size-5 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Title + action type tag */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl leading-snug truncate">{displayTitle}</h3>
            {save.action_type && (
              <span className="inline-block mt-1 rounded-full bg-[#b89478]/15 px-2.5 py-0.5 text-xs text-[#b89478] font-medium">
                {save.action_type}
              </span>
            )}
          </div>

          {/* Progress bar + percentage */}
          <div className="shrink-0 flex items-center gap-3 w-44">
            <Progress value={progress} className="h-2.5 flex-1 bg-zinc-600 [&>[data-slot=progress-indicator]]:bg-[#b89478]" />
            <span className="text-base font-semibold text-white w-12 text-right">{progress}%</span>
          </div>

          {/* Chevron */}
          <ChevronDown
            className={`shrink-0 size-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Expanded content — checklist + view original */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0 space-y-4 border-t border-border/30">
                {/* Checklist */}
                <div className="space-y-4 pt-4">
                  {localSteps.map(step => (
                    <label
                      key={step.id}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={step.completed}
                        onCheckedChange={() => handleToggle(step.id)}
                        className="mt-0.5 size-6 rounded-full border-2 border-[#b89478] bg-[#b89478]/20 data-[state=checked]:bg-[#b89478] data-[state=checked]:border-[#b89478] data-[state=checked]:text-white"
                      />
                      <span className={`text-base leading-relaxed ${step.completed ? "line-through text-muted-foreground/50" : "text-foreground"}`}>
                        {step.text}
                      </span>
                    </label>
                  ))}
                </div>

                {/* View original link */}
                <a
                  href={save.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#b89478] rounded-full px-5 py-2.5 hover:bg-[#c4a48b] transition-colors cursor-pointer"
                >
                  <ExternalLink className="size-4" />
                  View Original Bookmark
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

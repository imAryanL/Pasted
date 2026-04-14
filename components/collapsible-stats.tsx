// components/collapsible-stats.tsx
// Mobile-only collapsible wrapper for the stats cards section.
// Collapsed by default on mobile so saves appear immediately.
// Always expanded on sm+ screens.

"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CollapsibleStats({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      {/* Mobile toggle row — hidden on sm+ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex sm:hidden w-full items-center justify-between rounded-xl border border-border/50 bg-zinc-800 px-4 py-3 cursor-pointer"
      >
        <span className="text-sm font-semibold text-muted-foreground">Your Stats</span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mobile: animated expand. Desktop: always visible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="stats"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden sm:hidden mt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always visible on desktop */}
      <div className="hidden sm:block">
        {children}
      </div>
    </div>
  )
}

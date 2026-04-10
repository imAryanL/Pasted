// components/filtered-save-grid.tsx
// Client component that filters saves by category (from context)
// and search query. Filtering happens instantly in the browser.

"use client";

import { useState } from "react";
import type { Save } from "@/types/save";
import { SaveCard } from "./save-card";
import { AnimatedSaveGrid, AnimatedCard } from "./animated-save-grid";
import { useFilter } from "./filter-context";
import { Search, X } from "lucide-react";

export function FilteredSaveGrid({ saves }: { saves: Save[] }) {
  const { category } = useFilter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter by category
  const categoryFiltered = category
    ? saves.filter((s) => s.category === category)
    : saves;

  // Filter by search query
  const filteredSaves = searchQuery
    ? categoryFiltered.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
          s.title?.toLowerCase().includes(q) ||
          s.summary?.toLowerCase().includes(q) ||
          s.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      })
    : categoryFiltered;

  return (
    <div className="space-y-6">
      {/* Section header with search */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Recent Saves</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saves..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 rounded-lg bg-muted/50 border border-border pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#b89478]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {filteredSaves.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No saves found.
        </p>
      ) : (
        <AnimatedSaveGrid>
          {filteredSaves.map((save) => (
            <AnimatedCard key={save.id}>
              <SaveCard save={save} />
            </AnimatedCard>
          ))}
        </AnimatedSaveGrid>
      )}
    </div>
  );
}

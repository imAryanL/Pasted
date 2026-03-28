// components/search-bar.tsx
// Search input for filtering saves by title, summary, and tags.
// Uses URL search params (?q=searchterm) with debounced input
// so the page doesn't re-render on every keystroke.

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for the input — initialized from the URL if there's already a ?q=
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Debounce: wait 300ms after the user stops typing, then update the URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      router.push(`?${params.toString()}`);
    }, 300);

    // Cleanup: if the user types again before 300ms, cancel the previous timer
    return () => clearTimeout(timer);
  }, [query, searchParams, router]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search saves..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-12 rounded-xl bg-muted/50 border border-border pl-9 pr-9 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ccad97]/50 focus:border-[#ccad97]/50"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

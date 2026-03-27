// components/save-list.tsx
// Fetches and displays all of the user's saved URLs as a grid of cards.
// This is a Server Component — it fetches data directly from Supabase
// on the server, so no loading spinners or client-side fetching needed.
// The grid re-renders on every page load (or when revalidated).

import { createClient } from "@/lib/supabase/server";
import { SaveCard } from "./save-card";
import { Bookmark } from "lucide-react";
import type { Save } from "@/types/save";
import { Suspense } from "react";
import { CategoryFilter } from "./category-filter";
import { SearchBar } from "./search-bar";
import { AnimatedSaveGrid, AnimatedCard } from "./animated-save-grid";

export async function SaveList({ category, searchQuery }: { category?: string | null; searchQuery?: string | null }) {
  // Get the Supabase server client (reads cookies for auth)
  const supabase = await createClient();

  // Check who's logged in — we need the user ID to query their saves
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If somehow no user (shouldn't happen on a protected page), show nothing
  if (!user) {
    return (
      <p className="text-muted-foreground text-sm">
        Please log in to see your saves.
      </p>
    );
  }

  // Fetch all saves for this user, newest first
  // RLS ensures we only get this user's data, but we filter by user_id
  // as an extra safety measure (defense in depth)
  const { data: saves, error } = await supabase
    .from("saves")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // If the query failed, show an error message
  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load saves. Please try again.
      </p>
    );
  }

  // If the user has no saves yet, show an empty state
  if (!saves || saves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Bookmark className="size-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No saves yet
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Paste a URL above to save your first link.
        </p>
      </div>
    );
  }

  // Extract unique categories from all saves for the filter pills
  const allCategories = [...new Set(
    (saves as Save[])
      .map((s) => s.category)
      .filter(Boolean) as string[]
  )].sort();

  // Filter saves by selected category (if any)
  const categoryFiltered = category
    ? (saves as Save[]).filter((s) => s.category === category)
    : (saves as Save[]);

  // Filter by search query — check title, summary, and tags (case-insensitive)
  const filteredSaves = searchQuery
    ? categoryFiltered.filter((s) => {
        const q = searchQuery.toLowerCase();
        const titleMatch = s.title?.toLowerCase().includes(q);
        const summaryMatch = s.summary?.toLowerCase().includes(q);
        const tagMatch = s.tags?.some((tag) => tag.toLowerCase().includes(q));
        return titleMatch || summaryMatch || tagMatch;
      })
    : categoryFiltered;

  // Render category filter pills + the saves grid
  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SearchBar />
      </Suspense>

      <Suspense fallback={null}>
        <CategoryFilter categories={allCategories} />
      </Suspense>

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

// components/save-list.tsx
// Fetches all of the user's saved URLs from Supabase on the server,
// then passes them to FilteredSaveGrid for client-side filtering.

import { createClient } from "@/lib/supabase/server";
import { Bookmark } from "lucide-react";
import type { Save } from "@/types/save";
import { FilteredSaveGrid } from "./filtered-save-grid";

export async function SaveList() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <p className="text-muted-foreground text-sm">
        Please log in to see your saves.
      </p>
    );
  }

  const { data: saves, error } = await supabase
    .from("saves")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load saves. Please try again.
      </p>
    );
  }

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

  return <FilteredSaveGrid saves={saves as Save[]} />;
}

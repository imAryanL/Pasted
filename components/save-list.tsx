// components/save-list.tsx
// Fetches and displays all of the user's saved URLs as a grid of cards.
// This is a Server Component — it fetches data directly from Supabase
// on the server, so no loading spinners or client-side fetching needed.
// The grid re-renders on every page load (or when revalidated).

import { createClient } from "@/lib/supabase/server";
import { SaveCard } from "./save-card";
import { Bookmark } from "lucide-react";
import type { Save } from "@/types/save";

export async function SaveList() {
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

  // Render the saves as a responsive grid of cards
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(saves as Save[]).map((save) => (
        <SaveCard key={save.id} save={save} />
      ))}
    </div>
  );
}

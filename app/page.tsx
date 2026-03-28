// app/page.tsx
// The main dashboard page — where users paste URLs and see their saves.
// This is a Server Component so SaveList can fetch data directly from Supabase.
// PasteInput is a Client Component (it uses state), so it's imported and rendered here.

import { PasteInput } from "@/components/paste-input";
import { SaveList } from "@/components/save-list";
import { StatsCards } from "@/components/stats-cards";
import { Greeting } from "@/components/greeting";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, q } = await searchParams;

  // Get the user's name for the greeting
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const rawName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        {/* Personalized greeting */}
        <Greeting name={name} />

        {/* Paste input — user types/pastes a URL and saves it */}
        <PasteInput />

        {/* Stats cards — total saves, this month, top category */}
        <StatsCards />

        {/* Save list — shows all saved URLs as cards */}
        <SaveList
          category={typeof category === "string" ? category : null}
          searchQuery={typeof q === "string" ? q : null}
        />
      </main>
    </div>
  );
}

// app/page.tsx
// The main dashboard page — where users paste URLs and see their saves.
// This is a Server Component so SaveList can fetch data directly from Supabase.
// PasteInput is a Client Component (it uses state), so it's imported and rendered here.

import { PasteInput } from "@/components/paste-input";
import { SaveList } from "@/components/save-list";
import { StatsCards } from "@/components/stats-cards";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, q } = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Pasted</h1>
          <p className="text-muted-foreground text-lg">
            Paste it. Forget it. Find it.
          </p>
        </div>

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

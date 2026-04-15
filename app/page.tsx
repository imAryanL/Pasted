// app/page.tsx
// The main dashboard page — where users paste URLs and see their saves.
// This is a Server Component so SaveList can fetch data directly from Supabase.
// PasteInput is a Client Component (it uses state), so it's imported and rendered here.

import { PasteInput } from "@/components/paste-input";
import { SaveList } from "@/components/save-list";
import { StatsCards } from "@/components/stats-cards";
import { CollapsibleStats } from "@/components/collapsible-stats";
import { Greeting } from "@/components/greeting";
import { UpgradeToast } from "@/components/upgrade-toast";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>
}) {
  const { upgraded } = await searchParams;

  // Get the user's name for the greeting
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const rawName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {/* Fire a toast if user just upgraded to Pro */}
        {upgraded === "true" && <UpgradeToast />}

        {/* Personalized greeting */}
        <Greeting name={name} />

        {/* Paste input — user types/pastes a URL and saves it */}
        <PasteInput />

        {/* Stats cards — collapsible on mobile, always visible on desktop */}
        <CollapsibleStats>
          <StatsCards />
        </CollapsibleStats>

        {/* Save list — shows all saved URLs as cards */}
        <SaveList />
      </main>
    </div>
  );
}
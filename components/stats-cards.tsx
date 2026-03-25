// components/stats-cards.tsx
// Displays 3 stats cards on the dashboard: total saves, saves this month, and top category.
// This is a Server Component — fetches data directly from Supabase.

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, CalendarDays, FolderOpen } from "lucide-react";

export async function StatsCards() {
  // Get the Supabase client and current user (same pattern as SaveList)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Query 1: Get all saves (just the category column) for total count + top category
  const { data: saves } = await supabase
    .from("saves")
    .select("category")
    .eq("user_id", user.id);

  // Query 2: Get profile for monthly save count
  const { data: profile } = await supabase
    .from("profiles")
    .select("saves_count_this_month, saves_month")
    .eq("user_id", user.id)
    .single();

  // Calculate total saves
  const totalSaves = saves?.length ?? 0;

  // Calculate saves this month (check if the stored month matches current month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const savesThisMonth =
    profile?.saves_month === currentMonth
      ? profile.saves_count_this_month
      : 0;

  // Calculate top category by counting how often each one appears
  const categoryCounts: Record<string, number> = {};
  for (const save of saves ?? []) {
    if (save.category) {
      categoryCounts[save.category] = (categoryCounts[save.category] || 0) + 1;
    }
  }
  const topCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "None yet";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Saves */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Bookmark className="size-5 text-amber-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Saves</p>
              <p className="text-3xl font-bold">{totalSaves}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saves This Month */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-amber-400" />
            <div>
              <p className="text-sm text-muted-foreground">Saves This Month</p>
              <p className="text-3xl font-bold">{savesThisMonth}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <FolderOpen className="size-5 text-amber-400" />
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-3xl font-bold">{topCategory}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

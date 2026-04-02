// types/save.ts
// TypeScript type definition for a "save" record from the database.
// Matches the `saves` table in Supabase — used across components
// so we have one single source of truth for the shape of a save.

export type Save = {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  short_summary: string | null;
  summary: string | null;
  image_url: string | null;
  category: string | null;
  tags: string[] | null;
  source_type: string | null; // e.g. "YouTube", "GitHub", "Medium"
  highlight_text: string | null;
  remind_at: string | null;
  is_link_dead: boolean;
  created_at: string;
};

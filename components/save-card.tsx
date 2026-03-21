// components/save-card.tsx
// Displays a single saved URL as a card with its OG metadata.
// Shows: image (if available), title, URL, and source type badge.
// This is a Server Component — no interactivity needed, just display.

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Globe } from "lucide-react";
import type { Save } from "@/types/save";

type SaveCardProps = {
  save: Save;
};

export function SaveCard({ save }: SaveCardProps) {
  // Format the URL for display — strip protocol and trailing slash
  // e.g. "https://www.example.com/article/" becomes "www.example.com/article"
  const displayUrl = save.url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <Card className="overflow-hidden rounded-xl border-border/50 transition-colors hover:border-border">
      <a
        href={save.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* OG image — only render if we have one */}
        {save.image_url && (
          <div className="relative h-40 w-full overflow-hidden bg-muted">
            {/*
              Using a plain <img> instead of next/image here because OG images
              come from any domain. next/image requires configuring remotePatterns
              for every possible domain, which is impractical for a bookmark app.
              We'll optimize this later if needed.
            */}
            <img
              src={save.image_url}
              alt={save.title || "Saved link preview"}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <CardContent className="space-y-2 p-4">
          {/* Title — falls back to the URL if no OG title was found */}
          <h3 className="font-semibold text-base leading-snug line-clamp-2">
            {save.title || displayUrl}
          </h3>

          {/* URL preview — truncated with ellipsis if too long */}
          <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
            <ExternalLink className="size-3 shrink-0" />
            {displayUrl}
          </p>

          {/* Source type badge — e.g. "YouTube", "GitHub" */}
          {/* Only shows if OG metadata included a site name */}
          {save.source_type && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <Globe className="size-3" />
              {save.source_type}
            </span>
          )}
        </CardContent>
      </a>
    </Card>
  );
}

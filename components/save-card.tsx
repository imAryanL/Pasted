"use client"

// components/save-card.tsx
// Displays a single saved URL as a card with its OG metadata.
// Shows: image, title, URL, source badge, and a delete button on hover.

import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import type { Save } from "@/types/save";
import { Button } from "@/components/ui/button";
import { deleteSave } from "@/lib/actions/delete-save";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Strip X/Twitter suffix like "(@FoodPleaser) on X" from post titles
function cleanTitle(title: string): string {
  return title.replace(/\s*\(@\w+\)\s+on\s+X$/, "").trim();
}

type SaveCardProps = {
  save: Save;
};

export function SaveCard({ save }: SaveCardProps) {
  // Format the URL for display — strip protocol and trailing slash
  const displayUrl = save.url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <Card className="group relative overflow-hidden rounded-xl border-border/50 transition-all bg-zinc-800 hover:ring-2 hover:ring-[#ccad97] pt-0 gap-0 h-[500px]">
      {/* Delete button — only visible on hover, opens confirmation dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-sm sm:max-w-md p-6">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <AlertDialogTitle className="text-xl text-center">Delete this save?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-center">
              This action cannot be undone. The save and all its AI-generated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-2">
            <AlertDialogCancel className="h-12 px-6 text-base cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deleteSave(save.id);
                  toast.success("Save deleted");
                } catch {
                  toast.error("Failed to delete save");
                }
              }}
              className="h-12 px-6 text-base bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <a
        href={save.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* OG image — only render if we have one */}
        {save.image_url && (
          <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
            {/*
              Using a plain <img> instead of next/image here because OG images
              come from any domain. next/image requires configuring remotePatterns
              for every possible domain, which is impractical for a bookmark app.
              We'll optimize this later if needed.
            */}
            <img
              src={save.image_url}
              alt={save.title || "Saved link preview"}
              className="h-full w-full object-contain"
            />
            {save.source_type && (
              <span className="absolute top-4 left-2 rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-black">
                {save.source_type.replace(/\s*\(.*?\)/, "")}
              </span>
            )}
          </div>
        )}

        <CardContent className="space-y-2 p-4">
          {/* Title — falls back to the URL if no OG title was found */}
          <h3 className="font-semibold text-lg leading-snug line-clamp-2">
            {save.title ? cleanTitle(save.title) : displayUrl}
          </h3>
          {/* AI summary — show short_summary on card, fall back to full summary for older saves */}
          {(save.short_summary || save.summary) && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              {save.short_summary || save.summary}
            </p>
          )}
            {/* Tags — AI-generated keywords shown as hashtag pills */}
            {save.tags && save.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
                {save.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        #{tag}
                    </span>
                ))}
            </div>
            )}
        </CardContent>
      </a>
    </Card>
  );
}

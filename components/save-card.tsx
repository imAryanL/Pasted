"use client"

// components/save-card.tsx
// Displays a single saved URL as a card with its OG metadata.
// Shows: image, title, URL, source badge, and a delete button on hover.

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ImageOff } from "lucide-react";
import type { Save } from "@/types/save";
import { Button } from "@/components/ui/button";
import { deleteSave } from "@/lib/actions/delete-save";
import { SaveDetailModal } from "./save-detail-modal";
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
  const [open, setOpen] = useState(false);
  // Format the URL for display — strip protocol and trailing slash
  const displayUrl = save.url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <Card className="group relative overflow-hidden rounded-xl border-border/50 transition-all bg-zinc-800 hover:ring-2 hover:ring-[#b89478] pt-0 gap-0 min-h-[480px]">
      {/* Delete button — only visible on hover, opens confirmation dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:!bg-red-600 hover:!text-white"
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
            <AlertDialogDescription className="text-base text-left">
              This can't be undone. Your save and its AI data will be gone for good.
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

      <div onClick={() => setOpen(true)} className="block cursor-pointer">
        {/* OG image or placeholder */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
          {save.image_url ? (
            <img
              src={save.image_url}
              alt={save.title || "Saved link preview"}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff className="h-16 w-16 text-zinc-700" />
            </div>
          )}
          {save.source_type && (
            <span className="absolute top-4 left-2 rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-black">
              {save.source_type.replace(/\s*\(.*?\)/, "")}
            </span>
          )}
        </div>

        <CardContent className="space-y-2 p-4">
          {/* Title — prefer AI-generated title, fall back to cleaned OG title, then URL */}
          <h3 className="font-semibold text-lg leading-snug line-clamp-2">
            {save.ai_title || (save.title ? cleanTitle(save.title) : displayUrl)}
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
                    <span key={tag} className="rounded-full bg-[#b89478]/15 px-2 py-0.5 text-xs text-[#b89478]">
                        #{tag}
                    </span>
                ))}
            </div>
            )}
        </CardContent>
      </div>

      {/* Detail modal — opens when card is clicked */}
      <SaveDetailModal save={save} open={open} onOpenChange={setOpen} />
    </Card>
  );
}

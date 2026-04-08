// components/save-detail-modal.tsx
// Modal popup that shows full details when a user clicks on a SaveCard.
// Inspired by clean card-detail designs with sectioned layout:
// hero image, title, metadata row, AI summary card, tags, and action footer.

"use client"

import type { Save } from "@/types/save";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, Calendar, Sparkles, Tag, ImageOff } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSave } from "@/lib/actions/delete-save";
import { toast } from "sonner";

type SaveDetailModalProps = {
  save: Save;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SaveDetailModal({ save, open, onOpenChange }: SaveDetailModalProps) {
  // Strip protocol and trailing slash for display
  const displayUrl = save.url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  // Format the saved date
  const savedDate = new Date(save.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-zinc-900 border-border/50 p-0 gap-0 [&>button]:z-20">
        {/* Hero image with category badge overlay */}
        <div className="relative w-full overflow-hidden rounded-t-lg bg-zinc-900">
          {save.image_url ? (
            <img
              src={save.image_url}
              alt={save.title || "Saved link preview"}
              className="w-full max-h-90 object-contain"
            />
          ) : (
            <div className="flex w-full items-center justify-center h-60">
              <ImageOff className="h-20 w-20 text-zinc-700" />
            </div>
          )}
          {save.category && (
            <span className="absolute top-4 left-4 rounded-full bg-black/70 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white">
              {save.category}
            </span>
          )}
        </div>

        {/* Content body */}
        <div className="px-6 pt-5 pb-6 space-y-5">
          {/* Title */}
          <h2 className="text-2xl font-bold leading-tight">
            {save.ai_title || save.title || displayUrl}
          </h2>

          {/* Metadata row — URL + date */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href={save.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#ccad97] hover:underline truncate"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              {save.source_type?.replace(/\s*\(.*?\)/, "") || displayUrl}
            </a>
            <span className="flex items-center gap-1.5 shrink-0">
              <Calendar className="size-3.5" />
              {savedDate}
            </span>
          </div>

          {/* AI Summary card */}
          {save.summary && (
            <div className="rounded-lg border-1 border-[#ccad97]/40 bg-zinc-900/50 p-4 space-y-2 overflow-hidden">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#ccad97]">
                <Sparkles className="size-4" />
                AI Generated Summary
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                {save.summary}
              </p>
            </div>
          )}

          {/* Tags section */}
          {save.tags && save.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Tag className="size-3.5" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {save.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#ccad97]/15 px-3 py-1 text-xs text-[#ccad97]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action footer — Delete left, Open Original right */}
          <div className="flex items-center justify-between pt-3">
            {/* Delete with confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 text-base text-red-400 hover:text-red-300 transition-colors cursor-pointer py-2 px-4">
                  <Trash2 className="size-5" />
                  Delete Save
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm sm:max-w-md p-6">
                <AlertDialogHeader>
                  <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                    <Trash2 className="h-7 w-7 text-red-500" />
                  </div>
                  <AlertDialogTitle className="text-xl text-center">Delete this save?</AlertDialogTitle>
                  <AlertDialogDescription className="text-base text-left">
                    This can&apos;t be undone. Your save and its AI data will be gone for good.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center gap-3 mt-2">
                  <AlertDialogCancel className="h-12 px-6 text-base cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await deleteSave(save.id);
                        onOpenChange(false);
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

            {/* Open original button */}
            <Button asChild className="bg-[#ccad97] text-black hover:!bg-[#b89a82] cursor-pointer px-8 py-3 h-auto text-base">
              <a href={save.url} target="_blank" rel="noopener noreferrer">
                Open Original
                <ExternalLink className="size-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

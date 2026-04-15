// components/paste-input.tsx
// The main paste input bar for the dashboard.
// Users type or paste a URL here and hit "Save" to bookmark it.
// This is a Client Component because it needs useState for the input
// and useTransition for the pending state while the server action runs.

"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveUrl } from "@/lib/actions/save-url";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SavingAnimation } from "@/components/saving-animation";

export function PasteInput() {
  // The URL the user has typed or pasted
  const [url, setUrl] = useState("");

  // useTransition gives us a pending state without blocking the UI.
  // While isPending is true, the Save button shows a spinner.
  // startTransition wraps the server action call so React knows it's async.
  const [isPending, startTransition] = useTransition();

  // Called when the user clicks Save or presses Enter
  const handleSave = () => {
    // Don't do anything if the input is empty or we're already saving
    if (!url.trim() || isPending) return;

    // Wrap the server action in startTransition so React tracks the async state
    startTransition(async () => {
      const result = await saveUrl(url.trim());

      if (result.success) {
        setUrl("");
        toast.success("URL saved successfully");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  if (isPending) {
    return (
      <div className="w-full max-w-3xl">
        <div className="bg-[#a38771] p-2 sm:p-3 rounded-[2rem] shadow-2xl">
          <div className="bg-white rounded-2xl py-2 px-4 sm:px-6">
            <SavingAnimation />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Input row — pill-shaped container */}
      <div className="relative max-w-3xl bg-[#a38771] p-2 sm:p-3 rounded-[2rem] shadow-2xl flex gap-2 sm:gap-3">
        
        {/* Inner Recessed Container (Darker Beige) with Lighter Beige Focus Ring */}
        <div className="flex-1 bg-[#806754] rounded-2xl border border-transparent focus-within:ring-[5px] focus-within:ring-[#d4c4b0] focus-within:border-transparent transition-all flex items-center">
          <Input
            type="url"
            placeholder="Paste a URL to save — tweet, post, reel, video, article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            disabled={isPending}
            className="w-full bg-transparent py-3 px-4 sm:py-4 sm:px-6 text-white placeholder:text-white/60 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none !text-lg h-auto"
          />
        </div>

        {/* Save Button (Now White) */}
        <Button
          onClick={handleSave}
          disabled={isPending || !url.trim()}
          className="bg-white text-black px-5 sm:px-8 py-3 sm:py-4 h-auto rounded-2xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shrink-0 text-base sm:text-lg cursor-pointer whitespace-nowrap"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        
      </div>
    </div>
  );
}

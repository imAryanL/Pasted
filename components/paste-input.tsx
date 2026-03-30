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
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <div className="w-full space-y-3">
      {/* Input row — pill-shaped container */}
      <div className="relative max-w-3xl bg-[#a38771] p-3 rounded-[2rem] shadow-2xl flex gap-3">
        
        {/* Inner Recessed Container (Darker Beige) with Lighter Beige Focus Ring */}
        <div className="flex-1 bg-[#806754] rounded-2xl border border-transparent focus-within:ring-2 focus-within:ring-[#e8cbb5] focus-within:border-transparent transition-all flex items-center">
          <Input
            type="url"
            placeholder="Paste a URL to save - post, tweet, video, article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            disabled={isPending}
            className="w-full bg-transparent py-4 px-6 text-white placeholder:text-white/60 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-lg md:text-lg h-auto"
          />
        </div>

        {/* Save Button (Now White) */}
        <Button
          onClick={handleSave}
          disabled={isPending || !url.trim()}
          className="bg-white text-black px-8 py-4 h-auto rounded-2xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shrink-0 text-lg cursor-pointer"
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

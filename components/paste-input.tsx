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
import { LinkIcon, Loader2 } from "lucide-react";

export function PasteInput() {
  // The URL the user has typed or pasted
  const [url, setUrl] = useState("");

  // Feedback message — shows success or error after saving
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // useTransition gives us a pending state without blocking the UI.
  // While isPending is true, the Save button shows a spinner.
  // startTransition wraps the server action call so React knows it's async.
  const [isPending, startTransition] = useTransition();

  // Called when the user clicks Save or presses Enter
  const handleSave = () => {
    // Don't do anything if the input is empty or we're already saving
    if (!url.trim() || isPending) return;

    // Clear any previous message
    setMessage(null);

    // Wrap the server action in startTransition so React tracks the async state
    startTransition(async () => {
      const result = await saveUrl(url.trim());

      if (result.success) {
        // Clear the input and show a success message
        setUrl("");
        setMessage({ text: "Saved!", type: "success" });

        // Auto-clear the success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        // Show the error from the server action
        setMessage({
          text: result.error || "Something went wrong",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="w-full space-y-3">
      {/* Input row — URL field + Save button side by side */}
      <div className="flex gap-3">
        {/* URL input field */}
        <div className="relative flex-1">
          {/* Link icon inside the input for visual context */}
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Paste a URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            // Submit on Enter key — same as clicking Save
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            disabled={isPending}
            className="pl-9 h-12 text-base rounded-xl"
          />
        </div>

        {/* Save button — shows spinner while the server action is running */}
        <Button
          onClick={handleSave}
          disabled={isPending || !url.trim()}
          className="h-12 px-6 text-base rounded-xl cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      {/* Feedback message — appears below the input after save attempt */}
      {message && (
        <p
          className={`text-sm pl-1 ${
            message.type === "success"
              ? "text-emerald-400"
              : "text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

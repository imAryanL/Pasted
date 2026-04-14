"use client";
// app/error.tsx
// Global error boundary — catches unhandled errors in the route tree.
// Next.js requires this to be a Client Component.

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-12 w-12 text-[#b89478]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-base text-zinc-400">
            An unexpected error occurred. Try again — if it keeps happening, the
            issue is on our end.
          </p>
        </div>
        <Button
          onClick={reset}
          className="bg-[#b89478] hover:bg-[#a07d63] text-white cursor-pointer"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

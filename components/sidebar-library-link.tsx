// components/sidebar-library-link.tsx
// Library nav link that resets the category filter when clicked.

"use client";

import { Library } from "lucide-react";
import { useFilter } from "./filter-context";

export function SidebarLibraryLink() {
  const { setCategory } = useFilter();

  return (
    <button
      onClick={() => setCategory(null)}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium bg-sidebar-accent text-white cursor-pointer active:scale-95 transition-transform"
    >
      <Library className="h-5 w-5" />
      <span>Library</span>
    </button>
  );
}

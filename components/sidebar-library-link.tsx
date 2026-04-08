// components/sidebar-library-link.tsx
// Library nav link that resets the category filter when clicked.
// Highlights when on the home page (/).

"use client";

import { Library } from "lucide-react";
import { useFilter } from "./filter-context";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SidebarLibraryLink() {
  const { setCategory } = useFilter();
  const pathname = usePathname();
  const isActive = pathname === "/";

  return (
    <Link
      href="/"
      onClick={() => setCategory(null)}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-bold cursor-pointer transition-colors active:scale-95 ${
        isActive
          ? "bg-sidebar-accent text-white"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
      }`}
    >
      <Library className="h-5 w-5" strokeWidth={2.5} />
      <span>Library</span>
    </Link>
  );
}

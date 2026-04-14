// components/sidebar-explore-link.tsx
// Explore nav link — highlights when on the /explore page.

"use client";

import { Compass } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SidebarExploreLink() {
  const pathname = usePathname();
  const isActive = pathname === "/explore";

  return (
    <Link
      href="/explore"
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-bold cursor-pointer transition-colors active:scale-95 ${
        isActive
          ? "bg-sidebar-accent text-white"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
      }`}
    >
      <Compass className="h-5 w-5" strokeWidth={2.5} />
      <span>Explore</span>
    </Link>
  );
}

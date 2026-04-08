// components/sidebar-actionables-link.tsx
// Actionables nav link — highlights when on the /actionables page.

"use client";

import { ClipboardCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SidebarActionablesLink() {
  const pathname = usePathname();
  const isActive = pathname === "/actionables";

  return (
    <Link
      href="/actionables"
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-bold cursor-pointer transition-colors active:scale-95 ${
        isActive
          ? "bg-sidebar-accent text-white"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
      }`}
    >
      <ClipboardCheck className="h-5 w-5" strokeWidth={2.5} />
      <span>Actionables</span>
    </Link>
  );
}

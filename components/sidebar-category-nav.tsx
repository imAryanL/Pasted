// components/sidebar-category-nav.tsx
// Renders the category list in the sidebar. Uses FilterContext
// to instantly update the save grid when a category is clicked.

"use client";

import { Hash } from "lucide-react";
import { useFilter } from "./filter-context";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarCategoryNav({ categories }: { categories: string[] }) {
  const { category: activeCategory, setCategory } = useFilter();
  const pathname = usePathname();
  const router = useRouter();

  if (categories.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
        Your Categories
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {categories.map((category) => (
            <SidebarMenuItem key={category}>
              <button
                onClick={() => { setCategory(category); if (pathname !== "/") router.push("/"); }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-bold cursor-pointer transition-colors active:scale-95 ${
                  activeCategory === category
                    ? "bg-sidebar-accent text-white"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
                }`}
              >
                <Hash className="h-4 w-4" strokeWidth={2.5} />
                {category}
              </button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

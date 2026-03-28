// components/category-filter.tsx
// Renders horizontal scrollable pills for filtering saves by AI-generated category.
// Uses URL search params (?category=X) so filters are shareable and work with
// Server Component data fetching. Client Component because it needs onClick + useRouter.

"use client";

import { useRouter, useSearchParams } from "next/navigation";

type CategoryFilterProps = {
  categories: string[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  function handleCategoryClick(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeCategory === category) {
      params.delete("category"); // toggle off
    } else {
      params.set("category", category);
    }
    router.push(`?${params.toString()}`);
  }

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("category");
          router.push(`?${params.toString()}`);
        }}
        className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-[#ccad97]/20 text-[#d4b9a3] border border-[#ccad97]/30"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeCategory === category
              ? "bg-[#ccad97]/20 text-[#d4b9a3] border border-[#ccad97]/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

// components/filter-context.tsx
// Shared client-side state for category filtering between sidebar and save grid.

"use client";

import { createContext, useContext, useState } from "react";

type FilterContextType = {
  category: string | null;
  setCategory: (category: string | null) => void;
};

const FilterContext = createContext<FilterContextType>({
  category: null,
  setCategory: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<string | null>(null);

  return (
    <FilterContext.Provider value={{ category, setCategory }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}

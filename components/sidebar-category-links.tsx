  "use client"

  // sidebar-category-links.tsx
  // Renders the dynamic AI-generated categories in the sidebar.
  // Clicking a category filters saves on the dashboard via URL search params.

  import { useRouter, useSearchParams } from "next/navigation"
  import { Hash } from "lucide-react"
  import {
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
  } from "@/components/ui/sidebar"

  export function SidebarCategoryLinks({ categories }: { categories: string[] }) {
      const router = useRouter()
      const searchParams = useSearchParams()
      const activeCategory = searchParams.get("category")

      const handleClick = (category: string) => {
          const params = new URLSearchParams(searchParams.toString())

          // If clicking the already-active category, remove the filter
          if (activeCategory === category) {
              params.delete("category")
          } else {
              params.set("category", category)
          }

          router.push(`/?${params.toString()}`)
      }

      return (
          <SidebarMenu>
              {categories.map((category) => (
                  <SidebarMenuItem key={category}>
                      <SidebarMenuButton
                          onClick={() => handleClick(category)}
                          isActive={activeCategory === category}
                          className="cursor-pointer"
                      >
                          <Hash className="h-4 w-4" />
                          <span>{category}</span>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
          </SidebarMenu>
      )
  }
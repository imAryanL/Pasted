  // app-sidebar.tsx
  // Main sidebar component — Server Component that fetches user data,
  // categories, and usage stats, then renders the sidebar structure.
  // Interactive parts (category clicks, upgrade, sign out) are separate Client Components.

  import { createClient } from "@/lib/supabase/server"
  import Link from "next/link"
  import { SidebarLibraryLink } from "@/components/sidebar-library-link"
  import { SidebarActionablesLink } from "@/components/sidebar-actionables-link"
  import { SidebarExploreLink } from "@/components/sidebar-explore-link"
  import {
      Sidebar,
      SidebarHeader,
      SidebarContent,
      SidebarFooter,
      SidebarGroup,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
  } from "@/components/ui/sidebar"
  import { Crown } from "lucide-react"
  import { SidebarUpgradeButton } from "@/components/sidebar-upgrade-button"
  import { SidebarUserMenu } from "@/components/sidebar-user-menu"
  import { SidebarCategoryNav } from "@/components/sidebar-category-nav"



  export async function AppSidebar() {
      const supabase = await createClient()

      // Get the logged-in user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Get the user's profile (has subscription_tier)
      const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("user_id", user.id)
          .single()

      // Count saves this month (for the usage bar)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count: savesThisMonth } = await supabase
          .from("saves")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth)

      // Get unique categories from the user's saves
      const { data: saves } = await supabase
          .from("saves")
          .select("category")
          .eq("user_id", user.id)

      const categorySet = new Set<string>()
      for (const save of saves ?? []) {
          if (save.category) categorySet.add(save.category)
      }
      const categories = [...categorySet].sort()

      const tier = profile?.subscription_tier || "free"
      const usage = savesThisMonth || 0


      return (
          <Sidebar>
              {/* Top — Logo */}
              <SidebarHeader className="p-6">
                  <Link href="/" className="flex items-center font-bold tracking-tight text-white">
                      <img src="/pasted_icon_v1.png" alt="Pasted" className="h-11 w-11 rounded -mr-2.5 -mt-2" />
                      <span className="text-3xl">asted.</span>
                  </Link>
              </SidebarHeader>

              {/* Middle — Navigation + Categories */}
              <SidebarContent>
                  {/* Main nav */}
                  <SidebarGroup>
                      <SidebarGroupContent>
                          <SidebarMenu>
                              <SidebarMenuItem>
                                  <SidebarLibraryLink />
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                  <SidebarActionablesLink />
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                  <SidebarExploreLink />
                              </SidebarMenuItem>
                          </SidebarMenu>
                      </SidebarGroupContent>
                  </SidebarGroup>

                  <SidebarCategoryNav categories={categories} />

              </SidebarContent>

              {/* Bottom — Usage bar, upgrade, user profile */}
              <SidebarFooter className="p-6 space-y-4">
                  {/* Usage bar — only show for free users */}
                  {tier === "free" && (
                      <div className="space-y-3">
                          <div className="flex justify-between text-base font-medium text-muted-foreground">
                              <span>Free Plan</span>
                              <span>{usage} / 10</span>
                          </div>
                          <div className="h-3 rounded-full bg-muted">
                              <div
                                  className="h-3 rounded-full bg-[#b89478]"
                                  style={{ width: `${Math.min((usage / 10) * 100, 100)}%` }}
                              />
                          </div>
                          <SidebarUpgradeButton />
                      </div>
                  )}

                  {/* Pro users — styled plan badge */}
                  {tier === "pro" && (
                      <div className="rounded-xl bg-[#a38771] px-4 py-3 flex items-center gap-3">
                          <Crown className="h-6 w-6 text-white/80 shrink-0" />
                          <div>
                              <p className="text-base font-semibold text-white">Pro Plan</p>
                              <p className="text-sm text-white/80">Unlimited saves</p>
                          </div>
                      </div>
                  )}

                  {/* User profile + sign out */}
                  <SidebarUserMenu user={user} tier={tier} />
              </SidebarFooter>
          </Sidebar>
      )
  }
  
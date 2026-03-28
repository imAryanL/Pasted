  // app-sidebar.tsx
  // Main sidebar component — Server Component that fetches user data,
  // categories, and usage stats, then renders the sidebar structure.
  // Interactive parts (category clicks, upgrade, sign out) are separate Client Components.

  import { createClient } from "@/lib/supabase/server"
  import { Library } from "lucide-react"
  import Link from "next/link"
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
  import { SidebarUpgradeButton } from "@/components/sidebar-upgrade-button"
  import { SidebarUserMenu } from "@/components/sidebar-user-menu"



  export async function AppSidebar() {
      const supabase = await createClient()

      // Get the logged-in user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Get the user's profile (has subscription_tier)
      const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier, saves_count")
          .eq("id", user.id)
          .single()

      // Count saves this month (for the usage bar)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count: savesThisMonth } = await supabase
          .from("saves")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth)

      const tier = profile?.subscription_tier || "free"
      const usage = savesThisMonth || 0


      return (
          <Sidebar>
              {/* Top — Logo */}
              <SidebarHeader className="p-6">
                  <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
                      <img src="/pasted_icon_v1.png" alt="Pasted" className="h-9 w-9 rounded" />
                      Pasted.
                  </Link>
              </SidebarHeader>

              {/* Middle — Navigation + Categories */}
              <SidebarContent>
                  {/* Main nav */}
                  <SidebarGroup>
                      <SidebarGroupContent>
                          <SidebarMenu>
                              <SidebarMenuItem>
                                  <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                      <Library className="h-5 w-5" />
                                      <span>Library</span>
                                  </Link>
                              </SidebarMenuItem>
                          </SidebarMenu>
                      </SidebarGroupContent>
                  </SidebarGroup>

              </SidebarContent>

              {/* Bottom — Usage bar, upgrade, user profile */}
              <SidebarFooter className="p-6 space-y-4">
                  {/* Usage bar — only show for free users */}
                  {tier === "free" && (
                      <div className="space-y-3">
                          <div className="flex justify-between text-base font-medium text-muted-foreground">
                              <span>Free Plan</span>
                              <span>{usage} / 30</span>
                          </div>
                          <div className="h-3 rounded-full bg-muted">
                              <div
                                  className="h-3 rounded-full bg-[#ccad97]"
                                  style={{ width: `${Math.min((usage / 30) * 100, 100)}%` }}
                              />
                          </div>
                          <SidebarUpgradeButton />
                      </div>
                  )}

                  {/* Pro users just see their plan */}
                  {tier === "pro" && (
                      <div className="text-sm text-muted-foreground">Pro Plan — Unlimited saves</div>
                  )}

                  {/* User profile + sign out */}
                  <SidebarUserMenu user={user} tier={tier} />
              </SidebarFooter>
          </Sidebar>
      )
  }

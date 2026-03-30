
  "use client"

  // sidebar-user-menu.tsx
  // Displays the user's avatar, name, and a sign out dropdown at the bottom of the sidebar.
  // Uses Google OAuth user_metadata for avatar and name.

  import type { User } from "@supabase/supabase-js"
  import { createClient } from "@/lib/supabase/client"
  import { useRouter } from "next/navigation"
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
  import {
      DropdownMenu,
      DropdownMenuTrigger,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"
  import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
  import { LogOut, Settings } from "lucide-react"
  import Link from "next/link"

  export function SidebarUserMenu({ user, tier }: { user: User; tier: string }) {
      const router = useRouter()

      const name = user.user_metadata?.full_name || "User"
      const email = user.user_metadata?.email || ""
      const avatarUrl = user.user_metadata?.avatar_url || ""
      const initials = name.charAt(0).toUpperCase()

      const handleSignOut = async () => {
          const supabase = createClient()
          await supabase.auth.signOut()
          window.location.href = "/login"
      }

      return (
          <SidebarMenu>
              <SidebarMenuItem>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <SidebarMenuButton className="h-auto py-4 cursor-pointer">
                              <Avatar className="h-10 w-10">
                                  <AvatarImage src={avatarUrl} alt={name} referrerPolicy="no-referrer" />
                                  <AvatarFallback className="text-base">{initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-left">
                                  <span className="text-lg font-medium">{name}</span>
                                  <span className="text-sm text-muted-foreground">{tier === "pro" ? "Pro Plan" : "Free Tier"}</span>
                              </div>
                          </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="top" align="start" className="w-64">
                          <div className="px-3 py-2">
                              <p className="text-base font-medium">{name}</p>
                              <p className="text-sm text-muted-foreground">{email}</p>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                              onSelect={() => { window.location.href = "/account" }}
                              className="cursor-pointer py-2.5 text-sm"
                          >
                              <Settings className="mr-2 h-5 w-5" />
                              Account & Billing
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer py-2.5 text-sm">
                              <LogOut className="mr-2 h-5 w-5" />
                              Sign out
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </SidebarMenuItem>
          </SidebarMenu>
      )
  }

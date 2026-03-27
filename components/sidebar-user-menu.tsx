
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
          router.push("/login")
      }

      return (
          <SidebarMenu>
              <SidebarMenuItem>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <SidebarMenuButton className="h-auto py-2 cursor-pointer">
                              <Avatar size="sm">
                                  <AvatarImage src={avatarUrl} alt={name} />
                                  <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-left">
                                  <span className="text-sm font-medium">{name}</span>
                                  <span className="text-xs text-muted-foreground">{tier === "pro" ? "Pro Plan" : "Free Tier"}</span>
                              </div>
                          </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="top" align="start" className="w-56">
                          <div className="px-2 py-1.5">
                              <p className="text-sm font-medium">{name}</p>
                              <p className="text-xs text-muted-foreground">{email}</p>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              Account & Billing
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                              <LogOut className="mr-2 h-4 w-4" />
                              Sign out
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </SidebarMenuItem>
          </SidebarMenu>
      )
  }

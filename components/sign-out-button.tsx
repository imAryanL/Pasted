  "use client"

  // sign-out-button.tsx
  // Client Component — handles signing out via Supabase browser client.
  // Separated from the Navbar because signOut() must run in the browser.

  import { createClient } from "@/lib/supabase/client"
  import { useRouter } from "next/navigation"
  import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
  import { LogOut } from "lucide-react"

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
    }

    return (
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
        </DropdownMenuItem>
    )
}
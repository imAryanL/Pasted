  "use client"

  // sidebar-upgrade-button.tsx
  // Button that redirects free users to the Stripe checkout page.
  // Hits the existing /api/stripe/checkout endpoint.

  import { Button } from "@/components/ui/button"
  import { Zap } from "lucide-react"

  export function SidebarUpgradeButton() {
      const handleUpgrade = async () => {
          const response = await fetch("/api/stripe/checkout", { method: "POST" })
          const { url } = await response.json()
          if (url) window.location.href = url
      }

      return (
          <Button
              onClick={handleUpgrade}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold cursor-pointer"
          >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Pro
          </Button>
      )
  }
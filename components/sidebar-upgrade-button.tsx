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
              size="lg"
              className="w-full bg-[#ccad97] hover:bg-[#b89880] text-white font-semibold text-base h-12 cursor-pointer"
          >
              <Zap className="mr-2 h-5 w-5" />
              Upgrade to Pro
          </Button>
      )
  }
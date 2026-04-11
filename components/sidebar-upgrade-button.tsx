  "use client"

  // sidebar-upgrade-button.tsx
  // Button that redirects free users to the Stripe checkout page.
  // Hits the existing /api/stripe/checkout endpoint.

  import { Button } from "@/components/ui/button"
  import { Zap } from "lucide-react"
  import { toast } from "sonner"

  export function SidebarUpgradeButton() {
      const handleUpgrade = async () => {
          try {
              const response = await fetch("/api/stripe/checkout", { method: "POST" })
              const data = await response.json()
              if (data.url) window.location.href = data.url
              else toast.error("Could not start checkout. Try again.")
          } catch {
              toast.error("Something went wrong. Try again.")
          }
      }

      return (
          <Button
              onClick={handleUpgrade}
              size="lg"
              className="w-full bg-[#b89478] hover:bg-[#c4a48b] text-white font-semibold text-base h-12 cursor-pointer"
          >
              <Zap className="mr-2 h-5 w-5" />
              Upgrade to Pro
          </Button>
      )
  }
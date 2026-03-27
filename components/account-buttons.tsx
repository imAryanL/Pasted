"use client"

// account-buttons.tsx
// Client components for the Account & Billing page.
// UpgradeButton — redirects free users to Stripe Checkout.
// ManageBillingButton — redirects Pro users to Stripe Customer Portal.
// SignOutButton — signs the user out via Supabase and redirects to login.

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Zap, CreditCard, LogOut } from "lucide-react"

export function UpgradeButton() {
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async () => {
        setLoading(true)
        const response = await fetch("/api/stripe/checkout", { method: "POST" })
        const { url } = await response.json()
        if (url) window.location.href = url
    }

    return (
        <Button
            onClick={handleUpgrade}
            disabled={loading}
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold cursor-pointer"
        >
            <Zap className="mr-2 h-4 w-4" />
            {loading ? "Redirecting..." : "Upgrade to Pro"}
        </Button>
    )
}

export function ManageBillingButton() {
    const [loading, setLoading] = useState(false)

    const handleManageBilling = async () => {
        setLoading(true)
        const response = await fetch("/api/stripe/portal", { method: "POST" })
        const { url } = await response.json()
        if (url) window.location.href = url
    }

    return (
        <Button
            onClick={handleManageBilling}
            disabled={loading}
            variant="outline"
            size="lg"
            className="cursor-pointer"
        >
            <CreditCard className="mr-2 h-4 w-4" />
            {loading ? "Redirecting..." : "Manage Billing"}
        </Button>
    )
}

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
    }

    return (
        <Button
            onClick={handleSignOut}
            variant="outline"
            size="lg"
            className="cursor-pointer"
        >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
    )
}

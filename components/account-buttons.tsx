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
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
            className="bg-white hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-200 text-[#3d2a14] font-semibold text-base px-6 cursor-pointer"
        >
            {loading ? "Redirecting..." : "Upgrade via Stripe"}
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
        window.location.href = "/login"
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 text-white font-semibold text-lg h-14 px-8 cursor-pointer"
                >
                    <LogOut className="mr-3 h-6 w-6 text-white" />
                    Sign Out
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm sm:max-w-md p-6">
                <AlertDialogHeader>
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                        <LogOut className="h-7 w-7 text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-xl text-center">Sign out of Pasted?</AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-center">
                        You&apos;ll need to sign in again with Google to access your saves.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center gap-3 mt-2">
                    <AlertDialogCancel className="h-12 px-6 text-base cursor-pointer">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSignOut}
                        className="h-12 px-6 text-base bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    >
                        Sign Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// components/upgrade-toast.tsx
// Fires a success toast when the user lands back on the dashboard after upgrading to Pro.
// Rendered by page.tsx when the ?upgraded=true search param is present.

"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function UpgradeToast() {
    useEffect(() => {
        toast.success("You're now on Pro! Unlimited saves unlocked.")
    }, [])

    return null
}

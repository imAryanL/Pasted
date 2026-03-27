// app/account/page.tsx
// Account & Billing page — Server Component.
// Shows user profile info, current plan, usage stats, and billing management.
// Data fetching follows the same pattern as app-sidebar.tsx.

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { UpgradeButton, ManageBillingButton, SignOutButton } from "@/components/account-buttons"
import { Crown, User, BarChart3 } from "lucide-react"

export default async function AccountPage() {
    // Fetch user and profile data (same pattern as app-sidebar.tsx)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single()

    // Count saves this month (same query as app-sidebar.tsx lines 50-55)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { count: savesThisMonth } = await supabase
        .from("saves")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth)

    const tier = profile?.subscription_tier || "free"
    const usage = savesThisMonth || 0
    const name = user.user_metadata?.full_name || "User"
    const email = user.user_metadata?.email || user.email || ""
    const avatarUrl = user.user_metadata?.avatar_url || ""

    return (
        <div className="mx-auto max-w-2xl p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Account & Billing</h1>

            {/* Card 1: Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            className="h-12 w-12 rounded-full"
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Plan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5" />
                        Plan
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        {tier === "pro" ? (
                            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                                Pro
                            </Badge>
                        ) : (
                            <Badge variant="secondary">Free</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                            {tier === "pro" ? "Unlimited saves" : "30 saves per month"}
                        </span>
                    </div>
                    {tier === "free" ? <UpgradeButton /> : <ManageBillingButton />}
                </CardContent>
            </Card>

            {/* Card 3: Usage — only for free tier */}
            {tier === "free" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Usage This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>{usage} / 30 saves used</span>
                            <span className="text-muted-foreground">
                                {Math.round((usage / 30) * 100)}%
                            </span>
                        </div>
                        <Progress
                            value={Math.min((usage / 30) * 100, 100)}
                            className="h-2 [&>div]:bg-amber-500"
                        />
                    </CardContent>
                </Card>
            )}

            {/* Sign Out */}
            <Separator />
            <SignOutButton />
        </div>
    )
}

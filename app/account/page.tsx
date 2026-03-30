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
import { Crown, User, BarChart3, Zap, CheckCircle2 } from "lucide-react"

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

    // Calculate the reset date (1st of next month)
    const now = new Date()
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const resetDateStr = resetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

    return (
        <div className="mx-auto max-w-5xl p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Account & Billing</h1>
                <p className="text-lg text-muted-foreground mt-2">Manage your subscription and account settings.</p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column — Profile + Usage */}
                <div className="space-y-8">
                    {/* Card 1: Profile */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <User className="h-6 w-6" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-5">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={name}
                                        className="h-16 w-16 rounded-full"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xl font-semibold">{name}</p>
                                    <p className="text-base text-muted-foreground">{email}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1.5">Connected Account</p>
                                <Badge variant="outline" className="text-sm px-3 py-1">Google OAuth</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Current Usage */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <BarChart3 className="h-6 w-6" />
                                Current Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-baseline justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">{usage}</span>
                                    <span className="text-xl text-muted-foreground">/ {tier === "pro" ? "∞" : "15"}</span>
                                </div>
                                <Badge className={tier === "pro"
                                    ? "bg-[#ccad97]/20 text-[#d4b9a3] border-[#ccad97]/30 text-sm px-3 py-1"
                                    : "text-sm px-3 py-1"
                                } variant={tier === "pro" ? "default" : "secondary"}>
                                    {tier === "pro" ? "Pro Plan" : "Free Plan"}
                                </Badge>
                            </div>
                            <p className="text-base text-muted-foreground">Saves used this billing cycle</p>
                            {tier === "free" && (
                                <>
                                    <Progress
                                        value={Math.min((usage / 15) * 100, 100)}
                                        className="h-3 [&>div]:bg-[#ccad97]"
                                    />
                                    <p className="text-sm text-muted-foreground text-right">Resets on {resetDateStr}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Manage Billing — only for pro users */}
                    {tier === "pro" && (
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <Crown className="h-6 w-6" />
                                    Billing Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-base text-muted-foreground">
                                    Manage your subscription and payment methods through the Stripe Customer Portal.
                                </p>
                                <ManageBillingButton />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right column — Upgrade to Pro promo */}
                {tier === "free" && (
                    <div className="relative overflow-hidden rounded-xl p-8 bg-[#ccad97] h-fit lg:sticky lg:top-8">
                        {/* Decorative Zap icon in background */}
                        <Zap className="absolute right-6 top-1/2 -translate-y-1/2 h-40 w-40 text-white/15" strokeWidth={1.5} />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-white/80 mb-4">
                                <Zap className="h-5 w-5" />
                                <span className="text-sm font-semibold uppercase tracking-wider">Upgrade to Pro</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Unlock unlimited AI organization</h2>
                            <p className="text-base text-white/70 mb-8">
                                Stop worrying about save limits. Get unlimited URL saves, priority AI processing, and upcoming features.
                            </p>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                    <span className="text-base text-white">Unlimited monthly saves</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                    <span className="text-base text-white">Faster Gemini 2.0 processing</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                    <span className="text-base text-white">Pattern detection & AI insights (Soon)</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-5xl font-bold text-white">$8</span>
                                    <span className="text-xl text-white/70">/mo</span>
                                </div>
                                <UpgradeButton />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sign Out */}
            <Separator />
            <SignOutButton />
        </div>
    )
}

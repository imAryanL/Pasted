"use client"

// Login page — lets users sign in with Google OAuth.
// Centered card with logo, tagline, and Google sign-in button.

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 space-y-8 text-center">
                {/* Logo + Branding */}
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <img src="/pasted_icon_v1.png" alt="Pasted" className="h-10 w-10 rounded" />
                        <h1 className="text-4xl font-bold tracking-tight">Pasted.</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Paste it. Forget it. Find it.
                    </p>
                </div>

                {/* Description */}
                <p className="text-base text-muted-foreground">
                    AI-powered bookmark manager. Paste any URL and let AI organize it for you.
                </p>

                {/* Google Sign In */}
                <Button
                    onClick={handleGoogleLogin}
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-100 text-gray-900 cursor-pointer"
                >
                    <svg className="mr-3 h-6 w-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                </Button>

                {/* Footer */}
                <p className="text-sm text-muted-foreground">
                    No account needed — sign in with Google to get started.
                </p>
            </CardContent>
        </Card>
    )
}

"use client"

  // Login page — lets users sign in with Google OAuth
  import { createClient } from '@/lib/supabase/client'


export default function LoginPage() {
    const supabase = createClient()

    const handleGoogleLogin = async() => {
        // This one line triggers the entire Google sign-in flow
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
    }

return (
    <div>
        <h1> Login </h1>
        <button onClick={handleGoogleLogin} className="google-login-button">
            Sign in with Google!
        </button>
    </div>
    )
};

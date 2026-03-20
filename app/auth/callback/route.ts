// OAuth callback route — handles the redirect from Google after sign-in.
// Google sends a "code" to this URL, we exchange it for a user session.
// This file runs once per login and you never need to touch it again.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Extract the auth code and redirect destination from the URL
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'

  // Security check: only allow relative URLs (prevents redirect attacks)
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    // Exchange the temporary code from Google for a real user session
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Login successful — redirect the user to the dashboard (or wherever "next" points)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // If something went wrong, send the user to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
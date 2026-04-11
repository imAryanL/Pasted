"use client"

// Landing page — first thing users see when not logged in.
// Hero section with tagline, Google sign-in button, and footer.

import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function LandingPage() {
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
        <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-[#b89478]/30 flex flex-col">
            {/* Hero — takes up remaining space, centered */}
            <section className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Logo + Title */}
                        <div className="flex items-center justify-center mb-8">
                            <img src="/pasted_icon_v1.png" alt="Pasted" className="h-16 w-16 md:h-30 md:w-30 rounded-xl -mt-2 md:-mt-4" />
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tight -ml-4 md:-ml-6">asted.</h1>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b89478]/10 border border-[#b89478]/20 text-sm text-[#b89478] mb-6">
                            <span>✦</span> Meet your AI bookmark manager
                        </div>

                        {/* Tagline */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter mb-8 leading-[1.1]">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b89478] via-[#d4bfae] to-[#b89478]">
                                Forget it. Find it.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                            Save any link, let Pasted AI handle the rest — summaries, tags, categories, all done for you.
                        </p>

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleLogin}
                            className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-400 hover:scale-110 transition-all duration-300 cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 px-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>© 2026 Pasted · Built by <span className="text-gray-300">Aryan Lakhani</span></p>
                    <div className="flex items-center gap-5">
                        <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <a href="https://linkedin.com/in/aryan-lakhani" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        <a href="https://github.com/imAryanL" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

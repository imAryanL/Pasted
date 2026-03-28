// components/greeting.tsx
// Displays a personalized greeting based on time of day + a random app-related subtitle.
// Client Component because it needs the browser's local time (server time may differ from user's timezone).

"use client"

import { useState, useEffect } from "react"

const subtitles = [
    "What are you saving today?",
    "Your AI librarian is ready.",
    "Paste it. Forget it. Find it.",
    "Let's organize the internet, one link at a time.",
    "What caught your eye today?",
    "Your bookmarks, but smarter.",
    "Save now, thank yourself later.",
    "Bookmarks that actually work for you",
    "Recall everything. Imagine the rest.",
    "The smarter way to bookmark."
]

function getGreeting() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Good morning"
    if (hour >= 12 && hour < 17) return "Good afternoon"
    if (hour >= 17 && hour < 21) return "Good evening"
    return "Night owl mode"
}

export function Greeting({ name }: { name: string }) {
    // Use useEffect to avoid mistmatch (server vs client time)
    const [greeting, setGreeting] = useState("")
    const [subtitle, setSubtitle] = useState("")

    useEffect(() => {
        setGreeting(getGreeting())
        setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)])
    }, [])

    if (!greeting) return null

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
                {greeting}, {name}.
            </h1>
            <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
    )
}

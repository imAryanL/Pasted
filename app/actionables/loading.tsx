// app/actionables/loading.tsx
// Instant loading skeleton shown while the Actionables page streams.
// Prevents mobile sidebar navigation from appearing stuck.

export default function ActionablesLoading() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
            <div className="space-y-2">
                <div className="h-9 w-48 rounded-lg bg-zinc-800 animate-pulse" />
                <div className="h-5 w-72 rounded-lg bg-zinc-800 animate-pulse" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-xl bg-zinc-800 animate-pulse" />
                ))}
            </div>
        </div>
    )
}

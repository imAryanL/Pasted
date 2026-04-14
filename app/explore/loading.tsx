// app/explore/loading.tsx
// Instant loading skeleton shown while the Explore page streams.

export default function ExploreLoading() {
    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-8">
            {/* Page header */}
            <div className="space-y-2">
                <div className="h-9 w-56 rounded-lg bg-zinc-800 animate-pulse" />
                <div className="h-5 w-72 rounded-lg bg-zinc-800 animate-pulse" />
            </div>

            {/* 2-col card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-64 rounded-2xl bg-zinc-800 animate-pulse" />
                ))}
            </div>
        </div>
    )
}

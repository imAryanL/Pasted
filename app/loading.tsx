// app/loading.tsx
// Instant loading skeleton shown while the Library (home) page streams.

export default function LibraryLoading() {
    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">
            {/* Greeting */}
            <div className="space-y-2">
                <div className="h-10 w-64 rounded-lg bg-zinc-800 animate-pulse" />
                <div className="h-5 w-48 rounded-lg bg-zinc-800 animate-pulse" />
            </div>

            {/* Paste input */}
            <div className="h-16 max-w-3xl rounded-[2rem] bg-zinc-800 animate-pulse" />

            {/* Stats toggle (mobile) / stats row (desktop) */}
            <div className="h-12 rounded-xl bg-zinc-800 animate-pulse sm:hidden" />
            <div className="hidden sm:grid sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 rounded-xl bg-zinc-800 animate-pulse" />
                ))}
            </div>

            {/* Save cards */}
            <div className="space-y-4">
                <div className="h-7 w-36 rounded-lg bg-zinc-800 animate-pulse" />
                <div className="h-10 rounded-xl bg-zinc-800 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 rounded-2xl bg-zinc-800 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}

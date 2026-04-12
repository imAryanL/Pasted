// (auth)/layout.tsx
// Layout for auth pages (login, callback) — no sidebar, centered content.

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>

}

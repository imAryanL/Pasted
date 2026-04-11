// app/privacy/page.tsx
// Privacy Policy page — static, accessible to logged-in users.

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground mt-2">Last updated: April 9, 2026</p>
            </div>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">What is Pasted?</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Pasted is a bookmark manager built by Aryan Lakhani. You paste a URL, and AI organizes it for you with categories, summaries, tags, and actionable steps.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">What data we collect</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                    <li><strong className="text-foreground">Google account info</strong> — your name, email, and profile picture when you sign in with Google.</li>
                    <li><strong className="text-foreground">URLs you save</strong> — the links you paste, along with the page title, description, and thumbnail image.</li>
                    <li><strong className="text-foreground">AI-generated data</strong> — categories, summaries, tags, and actionable steps created by AI for each URL you save.</li>
                    <li><strong className="text-foreground">Payment info</strong> — if you upgrade to Pro, Stripe handles your payment. We never see or store your card number.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">How we use your data</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                    <li>To run the app — displaying your saves, generating AI summaries, tracking your usage.</li>
                    <li>To process payments through Stripe if you subscribe to Pro.</li>
                    <li>We do not sell your data to anyone.</li>
                    <li>We do not use your data for advertising.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Third-party services</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                    <li><strong className="text-foreground">Supabase</strong> — stores your account and saved URLs.</li>
                    <li><strong className="text-foreground">Google OAuth</strong> — handles sign-in. We only receive your public profile info.</li>
                    <li><strong className="text-foreground">Google Gemini API</strong> — processes your saved URLs to generate categories, summaries, tags, and actionable steps. The URL metadata and thumbnail are sent to Gemini for analysis.</li>
                    <li><strong className="text-foreground">Stripe</strong> — handles Pro subscription payments. Your card details are stored by Stripe, not by us.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Deleting your data</h2>
                <p className="text-muted-foreground leading-relaxed">
                    You can delete individual saves anytime from the app. If you want your entire account and all data removed, email us and we will delete everything within 7 days.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Questions about this policy? Reach out at{" "}
                    <a href="mailto:aryanlakhani2001@gmail.com" className="text-[#b89478] hover:underline">
                        aryanlakhani2001@gmail.com
                    </a>
                </p>
            </section>
        </div>
    )
}

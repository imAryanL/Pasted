import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { FilterProvider } from "@/components/filter-context";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pasted",
  description: "AI-powered bookmark manager. Paste any URL, get instant categorization, summaries, and tags.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {user ? (
          <FilterProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 md:hidden">
                  <SidebarTrigger />
                  <span className="text-base font-bold">Pasted</span>
                </div>
                {children}
              </main>
            </SidebarProvider>
          </FilterProvider>
        ) : (
          <main className="flex-1">{children}</main>
        )}
        <Toaster position="top-center" toastOptions={{ style: { background: '#ffffff', color: '#000000' } }} />
      </body>
    </html>
  );
}

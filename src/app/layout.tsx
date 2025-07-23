import "../globals.css";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PageTransition from "@/components/PageTransition";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "Shortly - Link Shortener",
  description: "Shorten and manage your links easily.",
};

const navLinkClass =
  "relative px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 dark:hover:text-white dark:hover:bg-gradient-to-r dark:hover:from-blue-700 dark:hover:to-purple-700 transition-all duration-200 font-medium";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <head>
        <link rel="icon" href="/globe.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className="min-h-screen antialiased transition-colors duration-300 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-md flex items-center justify-between px-8 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Shortly</Link>
              <Link href="/dashboard" className={navLinkClass}>Dashboard</Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/profile" className={navLinkClass + " flex items-center gap-2"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Profile
                  </Link>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300 ml-2">Welcome, {session.user?.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className={navLinkClass}>Login</Link>
                  <Link href="/register" className={navLinkClass}>Register</Link>
                </>
              )}
              <div className="ml-2 scale-110">
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
} 
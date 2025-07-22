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
  "relative px-2 py-1 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition group";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body className="min-h-screen antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-md flex items-center justify-between px-8 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-extrabold text-xl tracking-tight text-black dark:text-white">Shortly</Link>
              <Link href="/dashboard" className={navLinkClass + " after:absolute after:left-0 after:-bottom-1 after:w-0 group-hover:after:w-full after:h-0.5 after:bg-black dark:after:bg-white after:transition-all after:duration-300"}>Dashboard</Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Welcome, {session.user?.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className={navLinkClass + " after:absolute after:left-0 after:-bottom-1 after:w-0 group-hover:after:w-full after:h-0.5 after:bg-black dark:after:bg-white after:transition-all after:duration-300"}>Login</Link>
                  <Link href="/register" className={navLinkClass + " after:absolute after:left-0 after:-bottom-1 after:w-0 group-hover:after:w-full after:h-0.5 after:bg-black dark:after:bg-white after:transition-all after:duration-300"}>Register</Link>
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
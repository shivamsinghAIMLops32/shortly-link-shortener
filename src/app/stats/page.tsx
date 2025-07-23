import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Stats | Shortly",
};

async function getStats() {
  const res = await fetch("/api/stats", { cache: "no-store" });
  if (!res.ok) return { totalLinks: 0 };
  return res.json();
}

export default async function StatsPage() {
  const stats = await getStats();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">Global Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">{stats.totalLinks}</span>
              <span className="text-lg text-zinc-600 dark:text-zinc-300">Total Links Created</span>
            </div>
            {/* Add more stats here as your API grows */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
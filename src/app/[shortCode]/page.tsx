import { trackClick } from "@/actions/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ShortLinkPage({ params }: { params: { shortCode: string } }) {
  const link = await prisma.link.findUnique({ where: { shortCode: params.shortCode } });
  if (link) {
    await trackClick(params.shortCode);
    redirect(link.originalUrl);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 px-4">
      <Card className="max-w-md w-full mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">Link not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-center mb-6">The short link you followed does not exist.</p>
          <div className="flex justify-center">
            <Button asChild className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white dark:text-black font-semibold px-6 py-2">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
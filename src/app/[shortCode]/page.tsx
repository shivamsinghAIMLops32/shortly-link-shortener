import { trackClick } from "@/actions/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ShortLinkPage({ params }: { params: { shortCode: string } }) {
  const link = await prisma.link.findUnique({ where: { shortCode: params.shortCode } });
  if (link) {
    await trackClick(params.shortCode);
    redirect(link.originalUrl);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Link not found</h1>
      <p className="text-zinc-500">The short link you followed does not exist.</p>
    </div>
  );
} 
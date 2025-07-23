import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import QRCode from "qrcode";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

const linkSchema = z.object({
  originalUrl: z.string().url(),
  userId: z.string(),
  expiresAt: z.union([z.date(), z.string().datetime()]).optional(),
});

export async function createLink(data: { originalUrl: string; userId: string; expiresAt?: Date|string }) {
  const parsed = linkSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }
  // Upstash rate limiting
  const { success } = await ratelimit.limit(data.userId);
  if (!success) {
    return { error: "Rate limit exceeded. Max 5 links per minute." };
  }
  const shortCode = nanoid(6);
  const link = await prisma.link.create({
    data: {
      shortCode,
      originalUrl: data.originalUrl,
      userId: data.userId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });
  return { success: true, link };
}

export async function getUserLinks(userId: string) {
  const now = new Date();
  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return links.map(link => ({ ...link, expired: link.expiresAt ? new Date(link.expiresAt) < now : false }));
}

export async function deleteLink(linkId: string, userId: string) {
  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link || link.userId !== userId) return { error: "Not found or unauthorized" };
  await prisma.link.delete({ where: { id: linkId } });
  return { success: true };
}

export async function trackClick(shortCode: string) {
  const link = await prisma.link.findUnique({ where: { shortCode } });
  if (!link) return;
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) return;
  await prisma.link.update({
    where: { shortCode },
    data: { clicks: { increment: 1 } },
  });
}

export async function getGlobalStats() {
  const totalLinks = await prisma.link.count();
  return { totalLinks };
}

export async function getQRCode(shortUrl: string) {
  return await QRCode.toDataURL(shortUrl);
}

// Delete expired links from both Redis and the database
export async function deleteExpiredLinks() {
  const now = new Date();
  // Find expired links
  const expiredLinks = await prisma.link.findMany({
    where: { expiresAt: { lt: now } },
    select: { id: true, shortCode: true }
  });
  for (const link of expiredLinks) {
    // Remove from Redis (if you store shortCode as a key)
    await redis.del(link.shortCode);
    // Remove from DB
    await prisma.link.delete({ where: { id: link.id } });
  }
  return { deleted: expiredLinks.length };
} 
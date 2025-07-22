import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerUser(data: { email: string; password: string }) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "User already exists" };
  }
  const hashed = await bcrypt.hash(data.password, 10);
  await prisma.user.create({ data: { email: data.email, password: hashed } });
  return { success: true };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return { error: "Invalid credentials" };
  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) return { error: "Invalid credentials" };
  return { success: true, user: { id: user.id, email: user.email } };
} 
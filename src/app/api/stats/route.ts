import { getGlobalStats } from "@/actions/link";
import { NextResponse } from "next/server";

export async function GET() {
  const stats = await getGlobalStats();
  return NextResponse.json(stats);
} 
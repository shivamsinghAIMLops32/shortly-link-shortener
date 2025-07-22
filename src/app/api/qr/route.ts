import { getQRCode } from "@/actions/link";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
  const qr = await getQRCode(url);
  return NextResponse.json({ qr });
} 
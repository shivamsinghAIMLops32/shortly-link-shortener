import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ShortenerClient from "../ShortenerClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user?.email) redirect("/login");
  return <ShortenerClient userEmail={session.user.email} />;
} 
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/Toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      setToast({ open: true, message: "Login successful!" });
      setTimeout(() => router.push("/dashboard"), 1200);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto">
        <Card className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="w-full flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white dark:text-black font-semibold text-lg py-3" disabled={loading}>
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                ) : "Sign In"}
              </Button>
              {error && <div className="text-red-500 text-sm text-center w-full mt-2">{error}</div>}
            </form>
            <div className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400 w-full">
              Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <Toast message={toast.message} open={toast.open} onOpenChange={open => setToast(t => ({ ...t, open }))} />
    </div>
  );
} 
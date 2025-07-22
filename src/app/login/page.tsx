"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/Toast";

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-8 border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white mb-2 text-center">Sign in to your account</h2>
        <form className="w-full flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full py-3 rounded-lg font-semibold text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition" disabled={loading}>
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white dark:text-black mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            ) : "Sign In"}
          </button>
          {error && <div className="text-red-500 text-sm text-center w-full mt-2">{error}</div>}
        </form>
        <div className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400 w-full">
          Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
        </div>
      </motion.div>
      <Toast message={toast.message} open={toast.open} onOpenChange={open => setToast(t => ({ ...t, open }))} />
    </div>
  );
} 
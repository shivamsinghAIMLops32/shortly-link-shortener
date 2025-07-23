"use client";
import { useEffect, useState } from "react";

export default function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem("shortly_welcome_shown")) {
      setOpen(true);
      sessionStorage.setItem("shortly_welcome_shown", "1");
    }
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-90 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-8 max-w-md w-full flex flex-col items-center text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-black dark:text-white">Welcome to Shortly!</h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-4">
          Shortly is a modern, secure, and beautiful link shortener. <br />
          <span className="font-semibold">Features:</span>
          <ul className="list-disc list-inside text-left text-zinc-500 dark:text-zinc-400 mt-2 mb-4">
            <li>Shorten long URLs with one click</li>
            <li>Track clicks and manage your links</li>
            <li>Set expiration dates and generate QR codes</li>
            <li>Full dark/light mode, rate limiting, and more</li>
          </ul>
          Get started by pasting your first link below!
        </p>
        <button
          className="btn btn-primary w-full py-2 rounded-lg font-semibold text-base bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition mt-2"
          onClick={() => setOpen(false)}
        >
          Get Started
        </button>
      </div>
    </div>
  );
} 
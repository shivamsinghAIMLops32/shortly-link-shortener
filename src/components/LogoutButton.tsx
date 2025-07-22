"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition underline"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </button>
  );
} 
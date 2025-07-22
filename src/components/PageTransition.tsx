"use client";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={typeof window !== "undefined" ? window.location.pathname : undefined}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="flex flex-col min-h-[calc(100vh-56px)] w-full items-center justify-center bg-transparent transition-colors duration-300 card mt-8 mb-8 mx-auto max-w-5xl p-8"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
} 
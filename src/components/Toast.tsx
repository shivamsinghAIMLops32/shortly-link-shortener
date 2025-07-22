"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { useState } from "react";

export function Toast({ message, open, onOpenChange }: { message: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root open={open} onOpenChange={onOpenChange} className="bg-zinc-900 text-white px-4 py-2 rounded shadow-lg">
        <ToastPrimitive.Title>{message}</ToastPrimitive.Title>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50" />
    </ToastPrimitive.Provider>
  );
} 
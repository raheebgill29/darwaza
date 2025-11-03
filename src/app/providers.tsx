"use client";
import React from "react";
import { CartProvider } from "@/lib/cartContext";
import { WishlistProvider } from "@/lib/wishlistContext";
import { ToastProvider } from "@/lib/toastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
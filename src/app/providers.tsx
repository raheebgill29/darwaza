"use client";
import React from "react";
import { CartProvider } from "@/lib/cartContext";
import { WishlistProvider } from "@/lib/wishlistContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>{children}</CartProvider>
    </WishlistProvider>
  );
}
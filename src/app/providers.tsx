"use client";
import React from "react";
import { CartProvider } from "@/lib/cartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
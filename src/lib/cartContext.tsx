"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  qty: number;
  size?: string; // optional variant size
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string, size?: string) => void;
  increment: (id: string, size?: string) => void;
  decrement: (id: string, size?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "app_cart_v1";

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // noop
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setItems(loadFromStorage());
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    saveToStorage(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === item.id && it.size === item.size);
      if (existing) {
        return prev.map((it) => (it.id === item.id && it.size === item.size ? { ...it, qty: it.qty + qty } : it));
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((id: string, size?: string) => {
    setItems((prev) => prev.filter((it) => !(it.id === id && (size === undefined || it.size === size))));
  }, []);

  const increment = useCallback((id: string, size?: string) => {
    setItems((prev) => prev.map((it) => (it.id === id && (size === undefined || it.size === size) ? { ...it, qty: it.qty + 1 } : it)));
  }, []);

  const decrement = useCallback((id: string, size?: string) => {
    setItems((prev) => prev
      .map((it) => (it.id === id && (size === undefined || it.size === size) ? { ...it, qty: Math.max(0, it.qty - 1) } : it))
      .filter((it) => it.qty > 0));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);
  const total = useMemo(() => items.reduce((sum, it) => sum + it.qty * it.price, 0), [items]);

  const value = useMemo(
    () => ({ items, count, total, addItem, removeItem, increment, decrement, clear }),
    [items, count, total, addItem, removeItem, increment, decrement, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
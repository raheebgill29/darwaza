"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type WishlistItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  size?: string; // optional variant size
};

type WishlistContextType = {
  items: WishlistItem[];
  count: number;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string, size?: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "app_wishlist_v1";

function loadFromStorage(): WishlistItem[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // noop
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
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

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === item.id && it.size === item.size);
      if (exists) return prev; // avoid duplicates
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string, size?: string) => {
    setItems((prev) => prev.filter((it) => !(it.id === id && (size === undefined || it.size === size))));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.length, [items]);

  const value = useMemo(
    () => ({ items, count, addItem, removeItem, clear }),
    [items, count, addItem, removeItem, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
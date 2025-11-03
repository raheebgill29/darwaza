"use client";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";

type Props = {
  productId: string;
  title: string;
  price: number | string;
  image?: string | null;
  sizeQuantities: Record<string, number>;
  className?: string;
  label?: string;
};

function parsePrice(p: number | string): number {
  if (typeof p === "number") return p;
  const cleaned = p.replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

export default function AddSelectedSizesButton({ productId, title, price, image, sizeQuantities, className, label = "Add Selected" }: Props) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const totalSelected = Object.values(sizeQuantities || {}).reduce((sum, q) => sum + (q || 0), 0);
  const disabled = adding || totalSelected <= 0;

  async function handleAdd() {
    if (disabled) return;
    setAdding(true);
    try {
      const unitPrice = parsePrice(price);
      for (const [size, qty] of Object.entries(sizeQuantities)) {
        const q = Number(qty) || 0;
        if (q > 0) {
          addItem({ id: productId, title, price: unitPrice, image: image ?? undefined, size }, q);
        }
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } finally {
      setAdding(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className={
        className ??
        "mt-3 w-full rounded-full bg-brand-base px-5 py-3 text-accent hover:opacity-90 disabled:opacity-50"
      }
      aria-label="Add selected sizes to cart"
    >
      {added ? "Added!" : adding ? "Adding…" : label}
    </button>
  );
}
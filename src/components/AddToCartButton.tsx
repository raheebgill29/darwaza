"use client";
import { useCart } from "@/lib/cartContext";
import { useMemo, useState } from "react";
import CartIcon from "./icons/CartIcon";

function parsePrice(input: string | number): number {
  if (typeof input === "number") return input;
  const digits = input.replace(/[^0-9.]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

type Props = {
  id: string;
  title: string;
  price: string | number;
  image?: string | null;
  className?: string;
  label?: string; // default: "Add to Cart"
  quantity?: number; // default: 1
  disabled?: boolean; // optional disabled state
  selectedSize?: string; // optional size variant
  sizeQuantities?: Record<string, number>; // optional per-size quantities (multi-add)
};

export default function AddToCartButton({ id, title, price, image, className, label, quantity = 1, disabled = false, selectedSize, sizeQuantities }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const priceNum = useMemo(() => parsePrice(price), [price]);
  const totalSelected = useMemo(() => {
    if (!sizeQuantities) return 0;
    return Object.values(sizeQuantities).reduce((sum, q) => sum + (Number(q) || 0), 0);
  }, [sizeQuantities]);

  const isDisabled = disabled || (sizeQuantities ? totalSelected <= 0 : quantity <= 0);

  const onAdd = () => {
    if (isDisabled) return;
    // If per-size quantities are provided, add each selected size with its quantity
    if (sizeQuantities) {
      for (const [size, qtyRaw] of Object.entries(sizeQuantities)) {
        const qty = Number(qtyRaw) || 0;
        if (qty > 0) {
          addItem({ id, title, price: priceNum, image: image ?? undefined, size }, qty);
        }
      }
    } else {
      // Fallback to single add behavior
      addItem({ id, title, price: priceNum, image: image ?? undefined, size: selectedSize }, quantity);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={isDisabled}
      className={
        className ??
        `rounded-full bg-brand-base px-5 py-2 text-accent flex items-center justify-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`
      }
    >
      <CartIcon className="w-5 h-5" />
      {added ? "Added" : `${label ?? "Add to Cart"}${quantity > 1 ? ` (${quantity})` : ''}`}
    </button>
  );
}
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
};

export default function AddToCartButton({ id, title, price, image, className, label, quantity = 1 }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const priceNum = useMemo(() => parsePrice(price), [price]);

  const onAdd = () => {
    addItem({ id, title, price: priceNum, image: image ?? undefined }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className={
        className ??
        "rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90 flex items-center justify-center gap-2"
      }
    >
      <CartIcon className="w-5 h-5" />
      {added ? "Added" : `${label ?? "Add to Cart"}${quantity > 1 ? ` (${quantity})` : ''}`}
    </button>
  );
}
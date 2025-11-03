"use client";
import { useState } from "react";
import { useWishlist } from "@/lib/wishlistContext";

type Props = {
  id: string;
  title: string;
  price: number | string;
  image?: string | null;
  size?: string;
  className?: string;
};

function parsePrice(p: number | string): number {
  if (typeof p === "number") return p;
  const cleaned = p.replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

export default function AddToWishlistButton({ id, title, price, image, size, className }: Props) {
  const { addItem } = useWishlist();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ id, title, price: parsePrice(price), image: image ?? undefined, size });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Add to wishlist"
      className={className ?? "rounded-full border-2 border-accent px-3 py-2 text-accent hover:bg-accent hover:text-white"}
    >
      <span className="inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.815 3 8.25c0 7.219 2.912 11.38 7.518 14.025 1.412.606 2.762.606 4.174 0C18.088 19.63 21 15.469 21 8.25z" />
        </svg>
        {added ? "Added" : "Wishlist"}
      </span>
    </button>
  );
}
"use client";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlist();

  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-accent">Your Wishlist</h1>
          {items.length > 0 && (
            <button
              className="rounded-full border border-brand-200 px-4 py-2 text-accent hover:bg-brand-base"
              onClick={() => clear()}
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-brand-200 bg-brand-base p-6 text-center">
            <p className="text-accent">No items in your wishlist yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full border border-accent px-5 py-2 text-accent hover:bg-white/60"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.size ?? "_"}`}
                className="rounded-xl border border-brand-200 bg-brand-base p-3 transition-shadow hover:shadow-sm"
              >
                <Link href={`/${item.id}`} className="block">
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-brand-100">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-accent/50">No image</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-accent">{item.title}</p>
                    <p className="text-xs text-accent/70">Rs {item.price.toLocaleString("en-IN")} {item.size ? `• Size: ${item.size}` : ""}</p>
                  </div>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    className="rounded-full border border-red-400 px-3 py-1 text-xs text-red-600 hover:bg-red-500 hover:text-white"
                    onClick={() => removeItem(item.id, item.size)}
                  >
                    Remove
                  </button>
                  <Link
                    href={`/${item.id}`}
                    className="rounded-full border border-accent px-3 py-1 text-xs text-accent hover:bg-accent hover:text-white"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
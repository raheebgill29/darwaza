"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import CartIcon from "@/components/icons/CartIcon";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, count, total, increment, decrement, removeItem, clear } = useCart();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-accent">Your Cart</h1>
        {count === 0 ? (
          <p className="mt-2 text-accent/80">Your cart is empty.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 rounded-xl border border-brand-200 bg-brand-base p-3">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.title} className="h-16 w-16 rounded object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded bg-accent/10" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-accent">{it.title}</p>
                  <p className="text-accent/80">Rs {it.price.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decrement(it.id)} className="rounded-full bg-brand-base px-3 py-1 text-accent">-</button>
                  <span className="min-w-6 text-center text-accent">{it.qty}</span>
                  <button onClick={() => increment(it.id)} className="rounded-full bg-brand-base px-3 py-1 text-accent">+</button>
                </div>
                <button onClick={() => removeItem(it.id)} className="rounded-full border border-accent px-3 py-1 text-accent hover:bg-white/60">Remove</button>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl bg-brand-base p-4">
              <p className="text-accent">Total</p>
              <p className="text-accent font-semibold">Rs {total.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={clear} className="rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90 flex items-center gap-2">
                <CartIcon className="w-5 h-5" />
                <span>Clear Cart</span>
              </button>
              <button 
                onClick={() => router.push('/checkout')}
                className="rounded-full border border-accent px-5 py-2 text-accent hover:bg-white/60 flex items-center gap-2"
              >
                <CartIcon className="w-5 h-5" />
                <span>Checkout</span>
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
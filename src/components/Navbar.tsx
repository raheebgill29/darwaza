"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/lib/cartContext";
import CartIcon from "./icons/CartIcon";

export default function Navbar() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { count } = useCart();

  useEffect(() => {
    let mounted = true;
    // Initialize from current session
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const user = data.user;
      const name = user?.user_metadata?.full_name as string | undefined;
      const role = user?.user_metadata?.role as string | undefined;
      setDisplayName(name ?? user?.email ?? null);
      setIsAdmin(role === "admin");
    });
    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      const name = user?.user_metadata?.full_name as string | undefined;
      const role = user?.user_metadata?.role as string | undefined;
      setDisplayName(name ?? user?.email ?? null);
      setIsAdmin(role === "admin");
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 120; // Approximate height of the navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-brand-200">
      <div className="flex flex-col items-center justify-center py-4">
        <div className="flex w-full items-center justify-between px-4">
          <div className="w-1/3">{/* Left spacer */}</div>
          <Link href="/" className="text-3xl font-serif font-bold text-accent">
            Darwaza
          </Link>
          <div className="flex w-1/3 items-center justify-end gap-4">
            <button aria-label="Search" className="text-accent hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            {displayName ? (
              <Link href={isAdmin ? "/admin-dashboard" : "/profile"} className="text-accent hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            ) : (
              <Link href="/sign-in" className="text-accent hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}
            <button aria-label="Wishlist" className="text-accent hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.815 3 8.25c0 7.219 2.912 11.38 7.518 14.025 1.412.606 2.762.606 4.174 0C18.088 19.63 21 15.469 21 8.25z" />
              </svg>
            </button>
            <Link href="/cart" className="relative text-accent hover:text-primary">
              <CartIcon className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
        <nav className="mt-4 flex items-center justify-center gap-6 text-sm font-medium">
          <Link href="/" className="text-accent hover:text-primary">Home</Link>
          <button onClick={() => scrollToSection('shop-by-category')} className="text-accent hover:text-primary">Shop</button>
          <button onClick={() => scrollToSection('new-arrivals')} className="text-accent hover:text-primary">New Arrivals</button>
          <button onClick={() => scrollToSection('top-rated')} className="text-accent hover:text-primary">Top Rated</button>
        </nav>
      </div>
    </header>
  );
}
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  displayName: string | null;
  isAdmin: boolean;
  wishCount: number;
};

export default function MobileMenu({ displayName, isAdmin, wishCount }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileHref = displayName ? (isAdmin ? "/admin-dashboard" : "/user-dashboard") : "/sign-in";
  const profileLabel = displayName ? "Profile" : "Sign In";

  return (
    <div className="relative z-[70] md:hidden">
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="rounded-md border border-brand-200 bg-brand-base p-2 text-accent hover:opacity-90"
      >
        {/* Hamburger icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[1000]">
          {/* Overlay */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80%] bg-gradient-to-b from-brand-100 to-brand-base shadow-lg border-l border-brand-200 overflow-y-auto nice-scrollbar">
            <div className="flex items-center justify-between p-4 border-b border-brand-200">
              <span className="text-lg font-semibold text-accent">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-md border border-brand-200 bg-white px-2 py-1 text-accent hover:bg-brand-base"
              >
                Close
              </button>
            </div>

            <nav className="p-2">
              <Link href={profileHref} className="flex items-center justify-between rounded-md px-3 py-3 text-accent hover:bg-brand-base">
                <span className="inline-flex items-center gap-2">
                  {/* User icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {profileLabel}
                </span>
              </Link>

              <Link href="/wishlist" className="mt-1 flex items-center justify-between rounded-md px-3 py-3 text-accent hover:bg-brand-base">
                <span className="inline-flex items-center gap-2">
                  {/* Heart icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.815 3 8.25c0 7.219 2.912 11.38 7.518 14.025 1.412.606 2.762.606 4.174 0C18.088 19.63 21 15.469 21 8.25z" />
                  </svg>
                  Wishlist
                </span>
                {wishCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-white">{wishCount}</span>
                )}
              </Link>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
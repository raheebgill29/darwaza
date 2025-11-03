"use client";
import Link from "next/link";
import { scrollToSection } from "@/lib/scrollToSection";

type Props = {
  className?: string;
};

export default function NavLinks({ className = "" }: Props) {
  return (
    <nav className={`items-center justify-center gap-6 text-sm font-medium ${className}`}>
      <Link href="/" className="text-accent hover:text-primary">Home</Link>
      <button onClick={() => scrollToSection('shop-by-category')} className="text-accent hover:text-primary">Shop</button>
      <button onClick={() => scrollToSection('new-arrivals')} className="text-accent hover:text-primary">New Arrivals</button>
      <button onClick={() => scrollToSection('top-rated')} className="text-accent hover:text-primary">Top Rated</button>
    </nav>
  );
}
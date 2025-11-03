"use client";

import Image from "next/image";
import { scrollToSection } from "@/lib/scrollToSection";

export default function Banner() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/download.avif"
        alt="New Arrivals Banner"
        fill
        quality={100}
        className="z-0 object-cover"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 text-white">
        <h2 className="text-5xl font-bold tracking-wide md:text-7xl">New Arrivals</h2>
        <button
          onClick={() => scrollToSection("shop-by-category")}
          className="mt-8 rounded-full border-2 border-white px-8 py-3 text-lg font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black"
          aria-label="Shop Now"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
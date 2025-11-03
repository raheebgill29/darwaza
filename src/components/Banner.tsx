"use client";

import Image from "next/image";
import { scrollToSection } from "@/lib/scrollToSection";

export default function Banner() {
  return (
    <section className="relative h-[50vh] md:h-screen min-h-[300px] w-full overflow-hidden">
      <Image
        src="/download.avif"
        alt="New Arrivals Banner"
        fill
        quality={100}
        priority
        sizes="100vw"
        className="z-0 object-cover"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 text-white px-4 py-8">
        <h2 className="text-2xl sm:text-4xl md:text-7xl font-bold tracking-wide text-center">New Arrivals</h2>
        <button
          onClick={() => scrollToSection("shop-by-category")}
          className="mt-4 md:mt-8 rounded-full border-2 border-white px-5 md:px-8 py-2 md:py-3 text-sm md:text-lg font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black"
          aria-label="Shop Now"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
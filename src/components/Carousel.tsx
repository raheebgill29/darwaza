"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  image: string;
  bg: string; // gradient utility classes
};

const slides: Slide[] = [
  {
    title: "New Arrivals",
    subtitle: "Fresh picks just for you",
    image: "/next.svg",
    bg: "from-brand-100 via-brand-200 to-brand-300",
  },
  {
    title: "Spring Sale",
    subtitle: "Up to 40% off selected items",
    image: "/vercel.svg",
    bg: "from-brand-200 via-brand-300 to-brand-400",
  },
  {
    title: "Darwaza Essentials",
    subtitle: "Everyday must-haves in soft rose tones",
    image: "/globe.svg",
    bg: "from-brand-300 via-brand-400 to-brand-500",
  },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index];

  return (
    <section aria-label="Promotions" className="mt-6">
      <div className={`relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-r ${slide.bg}`}>
        <div className="flex h-full items-center justify-between p-6">
          <div className="max-w-lg">
            <h2 className="text-2xl font-semibold text-accent">{slide.title}</h2>
            <p className="mt-2 text-accent/80">{slide.subtitle}</p>
            <button className="mt-4 rounded-full bg-brand-base px-4 py-2 text-accent hover:opacity-90">
              Shop Now
            </button>
          </div>
          <div className="hidden sm:block">
            <Image src={slide.image} alt={slide.title} width={120} height={120} className="opacity-80" />
          </div>
        </div>

        {/* dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-accent" : "bg-brand-base"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
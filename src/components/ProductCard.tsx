"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProductCardProps = {
  title: string;
  price?: string;
  image?: string; // local or remote URL
  href?: string;
  badge?: string;
};

export default function ProductCard({
  title,
  price,
  image = "/file.svg",
  href = "#",
  badge,
}: ProductCardProps) {
  const [src, setSrc] = useState(image);
  return (
    <article className="rounded-2xl bg-brand-base p-4 shadow-sm">
      {badge && (
        <span className="inline-block rounded-full bg-white/70 px-2 py-1 text-xs text-accent">
          {badge}
        </span>
      )}

      <div className="mt-2 flex h-40 items-center justify-center">
        <Image
          src={src}
          alt={title}
          width={400}
          height={300}
          className="rounded-md object-cover"
          onError={() => setSrc("https://picsum.photos/400/300")}
        />
      </div>

      <h5 className="mt-2 text-accent font-semibold">{title}</h5>
      {price && <p className="text-accent/80">{price}</p>}

      <Link
        href={href}
        className="mt-3 inline-block rounded-full border border-accent px-3 py-1 text-accent hover:bg-white/60"
      >
        View
      </Link>
    </article>
  );
}
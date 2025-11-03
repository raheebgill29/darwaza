"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";

type ProductGridProps = {
  products: Array<Product & { href?: string }>;
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg bg-white/50 p-8 text-center">
        <p className="text-lg text-accent/70">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-accent">
          {products.length} {products.length === 1 ? "Product" : "Products"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link
              href={product.href ?? `/products/${product.slug}`}
              aria-label={`View details for ${product.title}`}
              className="block"
            >
              <div
                className="relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => setHoveredProduct(product.slug)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/70 to-transparent p-4 text-white transition-opacity duration-300 ${
                      hoveredProduct === product.slug ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="text-center text-lg font-semibold">{product.title}</p>
                    <p className="mt-1 text-center">{product.price}</p>
                    <span className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-accent transition-colors ring-1 ring-accent cursor-pointer hover:bg-accent hover:text-white">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-accent">{product.title}</h3>
                  <p className="mt-1 text-accent/90">{product.price}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
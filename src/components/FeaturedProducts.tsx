"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get up to 3 featured products
  const featuredProducts = products.slice(0, 3);
  
  if (featuredProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-accent/5 to-accent/10 p-6"
    >
      <h2 className="mb-6 text-2xl font-bold text-accent">Featured Products</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/products/${product.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
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
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-accent">{product.title}</h3>
                  <p className="mt-1 text-accent/90">{product.price}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-accent/70">
                    {product.description}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm font-medium text-accent">View Details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
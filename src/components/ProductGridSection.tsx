import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HoverInfoOverlay from '@/components/HoverInfoOverlay';

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  href: string;
  discount?: string;
  isNew?: boolean;
  colors?: string[];
}

import { products as dataProducts } from "@/data/products";

// Map data products to the format needed for this component
const products: Product[] = dataProducts.slice(0, 6).map(product => ({
  id: product.slug,
  name: product.title,
  price: product.price,
  originalPrice: product.details?.["Original Price"],
  imageUrl: product.image,
  href: `/products/${product.slug}`,
  discount: product.badge,
  isNew: product.badge === "NEW",
}));

const ProductGridSection: React.FC = () => {
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mr-2">Top Rated</h2>
        <span className="text-2xl text-gray-400">/</span>
        <h2 className="text-2xl font-bold text-gray-400 ml-2">Best Sellers</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={product.href} key={product.id} className="group block">
            <div className="group relative w-full h-[350px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <HoverInfoOverlay title={product.name} price={product.price} />
              {(product.discount || product.isNew) && (
                <div className="absolute top-2 left-2 flex space-x-1">
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              )}
            </div>
            {/* Removed below-the-card name/price; they now appear on hover over the card */}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductGridSection;
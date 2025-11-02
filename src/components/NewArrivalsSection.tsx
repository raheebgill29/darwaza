import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HoverInfoOverlay from '@/components/HoverInfoOverlay';
import { products as dataProducts } from "@/data/products";

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  href: string;
  badge?: string;
}

// Get the newest 4 products from the data
const newArrivalsProducts: Product[] = dataProducts
  .filter(product => product.badge === "NEW" || !product.badge)
  .slice(0, 4)
  .map(product => ({
    id: product.slug,
    name: product.title,
    price: product.price,
    imageUrl: product.image,
    href: `/products/${product.slug}`,
    badge: product.badge
  }));

const NewArrivalsSection: React.FC = () => {
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 text-accent">NEW IN</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newArrivalsProducts.map((product) => (
          <Link href={product.href} key={product.id} className="group block">
            <div className="group relative w-full h-[350px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <HoverInfoOverlay title={product.name} price={product.price} />
              {product.badge && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
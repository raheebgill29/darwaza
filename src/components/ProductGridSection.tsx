import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HoverInfoOverlay from '@/components/HoverInfoOverlay';
import { supabase } from '@/lib/supabaseClient';

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

function formatPrice(num: number | string) {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (Number.isNaN(n)) return `${num}`;
  return `Rs ${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

async function fetchTopRated(limit: number = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price,product_images(image_url,order_index),top_rated,new_arrival,featured')
    .eq('top_rated', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const rows = data as any[];
  return rows.map((p) => {
    const imgs = (p.product_images ?? []).sort(
      (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
    );
    const image = imgs[0]?.image_url || 'https://via.placeholder.com/800x800';
    return {
      id: p.id,
      name: p.name,
      price: formatPrice(p.price),
      originalPrice: undefined,
      imageUrl: image,
      href: `/db-products/${p.id}`,
      discount: p.featured ? 'FEATURED' : undefined,
      isNew: Boolean(p.new_arrival),
    } as Product;
  });
}

const ProductGridSection: React.FC = async () => {
  const products = await fetchTopRated(8);
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-center items-center gap-4 mb-8">
        <h2 className="text-3xl font-semibold text-accent">Top Rated</h2>
        <span className="text-2xl text-accent">/</span>
        <h2 className="text-3xl font-semibold text-accent">Best Sellers</h2>
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
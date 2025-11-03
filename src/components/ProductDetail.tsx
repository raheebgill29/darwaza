"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { products as dataProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import SizeQuantityTable from "@/components/SizeQuantityTable";
import AddSelectedSizesButton from "@/components/AddSelectedSizesButton";

type Props = {
  product: Product;
  images?: string[]; // optional gallery of images
  relatedProducts?: Array<Product & { href?: string }>; // optional related items from DB
  maxStock?: number; // optional stock limit to cap quantity selection
};

export default function ProductDetail({ product, images, relatedProducts, maxStock }: Props) {
  const { title, price, image, description, details, category, badge } = product;
  // Use provided gallery from props; fall back to the single product image
  const gallery = (images && images.length > 0) ? images : [image];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeCount, setSizeCount] = useState<number>(0);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});

  // Keep selectedImage in sync if gallery updates (e.g., after async fetch)
  useEffect(() => {
    setSelectedImage(gallery[0]);
  }, [image, images]);
  const [quantity, setQuantity] = useState(1);
  const effectiveMax = Number.isFinite(maxStock as number) && typeof maxStock === 'number' ? Math.max(0, maxStock) : Number.POSITIVE_INFINITY;
  // Clamp if max changes or is lower than current
  useEffect(() => {
    setQuantity((q) => Math.min(q, effectiveMax === Number.POSITIVE_INFINITY ? q : Math.max(0, effectiveMax) || 0) || (effectiveMax > 0 ? 1 : 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveMax]);
  
  // Gallery thumbnails come from Supabase (via props) or the main product image

  // Prepare related products: use provided ones, otherwise pick 4 random from local data
  const related = (relatedProducts && relatedProducts.length > 0)
    ? relatedProducts
    : dataProducts
        .filter((p) => p.slug !== product.slug)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map((p) => ({ ...p, href: `/products/${p.slug}` }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-accent/70 hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-accent/70">/</span>
                <Link href={`/products?category=${category}`} className="text-sm font-medium text-accent/70 hover:text-accent">
                  {category}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-accent/70">/</span>
                <span className="text-sm font-medium text-accent truncate max-w-[150px]">{title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-brand-base p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
            {badge && (
              <div className="absolute top-6 left-6 z-10 rounded-full bg-accent px-3 py-1 text-sm font-medium text-white">
                {badge}
              </div>
            )}
            <div className="relative h-[560px] md:h-[680px] w-full overflow-hidden rounded-xl">
              <Image
                src={selectedImage}
                alt={title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === img ? "border-accent" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-6 border-b border-accent/10 pb-4">
              <div className="flex items-center gap-2">
                <p className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">{category}</p>
                {badge && (
                  <p className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-white">
                    {badge}
                  </p>
                )}
              </div>
              <h1 className="mt-3 text-4xl font-bold text-accent">{title}</h1>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-accent">{price}</p>
                {details?.["Original Price"] && (
                  <p className="text-lg text-accent/60 line-through">{details["Original Price"]}</p>
                )}
              </div>
              
              {/* Rating Stars (Demo) */}
              <div className="mt-3 flex items-center">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-accent/70">128 reviews</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-accent">Description</h2>
              <p className="text-accent/90 leading-relaxed">{description}</p>
            </div>

            {details && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-semibold text-accent">Product Details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(details)
                    .filter(([k]) => k !== "Original Price")
                    .map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-brand-base/70 p-4 shadow-sm transition-all hover:shadow-md">
                        <p className="text-sm font-medium text-accent/70">{k}</p>
                        <p className="text-accent font-medium">{v}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            {/* Per-size stock table (if sizes exist) */}
            <SizeQuantityTable
              productId={product.slug}
              selectable
              selectedSize={selectedSize}
              onSelect={(sz) => setSelectedSize(sz)}
              allowQuantityInput
              selectedQuantities={sizeQuantities}
              onQuantitiesChange={(map) => setSizeQuantities(map)}
              onLoaded={(rows) => setSizeCount(rows.length)}
              className="rounded-xl border border-brand-200 bg-white p-3"
            />
            {/* Add selected per-size quantities */}
            <AddSelectedSizesButton
              productId={product.slug}
              title={title}
              price={price}
              image={image}
              sizeQuantities={sizeQuantities}
              label="Add Selected Sizes"
              className="w-full rounded-full bg-brand-base px-5 py-3 text-accent hover:opacity-90"
            />
            {/* Quantity Selector */}
            {sizeCount <= 1 && (
            <div className="flex items-center">
              <span className="mr-4 text-accent font-medium">Quantity:</span>
              <div className="flex items-center border border-accent/20 rounded-lg">
                <button 
                  onClick={() => setQuantity(q => Math.max(effectiveMax > 0 ? 1 : 0, q - 1))}
                  className="px-3 py-1 text-accent hover:bg-accent/10 transition-colors"
                  aria-label="Decrease quantity"
                  >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="px-4 py-1 text-accent font-medium min-w-[40px] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(q + 1, effectiveMax === Number.POSITIVE_INFINITY ? q + 1 : effectiveMax))}
                  className={`px-3 py-1 text-accent transition-colors ${quantity >= effectiveMax ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/10'}`}
                  aria-label="Increase quantity"
                  disabled={quantity >= effectiveMax}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            )}
            {/* Stock info */}
            {effectiveMax !== Number.POSITIVE_INFINITY && (
              <p className="text-sm text-accent/70">{effectiveMax > 0 ? `In stock: ${effectiveMax}` : 'Out of stock'}</p>
            )}
            
            <div className="flex flex-wrap gap-4">
              <AddToCartButton id={product.slug} title={title} price={price} image={image} quantity={quantity} disabled={effectiveMax === 0} selectedSize={selectedSize ?? undefined} />
              <Link href="/" className="rounded-full border-2 border-accent px-6 py-2 text-accent transition-all hover:bg-accent hover:text-white">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products Section */}
      <div className="mt-16 border-t border-accent/10 pt-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-accent">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard
              key={(p as any).slug || (p as any).id || p.title}
              id={(p as any).slug || (p as any).id}
              title={p.title}
              price={p.price}
              image={p.image}
              href={p.href ?? `/db-products/${(p as any).slug || (p as any).id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
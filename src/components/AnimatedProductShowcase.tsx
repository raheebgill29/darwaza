"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products as dataProducts } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  href: string;
  quote: string;
}

// Default quotes to keep the section's style intact
const defaultQuotes = [
  'Elegance is the only beauty that never fades. Embrace timeless style with our signature collection.',
  'Confidence comes from within, but a well-tailored accessory helps. Discover style redefined.',
  'The finishing touch that speaks volumes. Our accessories add subtle luxury to every outfit.',
  'Carry your world with style. Thoughtfully designed for the modern lifestyle.',
  'Adorn yourself with pieces that tell your story. Accessories that become a part of you.',
];

function formatPrice(num: number | string) {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (Number.isNaN(n)) return `${num}`;
  return `Rs ${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

// Fallback showcase built from local data to preserve section visuals if DB has none
const fallbackShowcase: Product[] = dataProducts.slice(0, 5).map((p, idx) => ({
  id: `local-${idx + 1}`,
  name: p.title,
  price: p.price,
  imageUrl: p.image,
  href: `/products/${p.slug}`,
  quote: defaultQuotes[idx % defaultQuotes.length],
}));

export default function AnimatedProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [items, setItems] = useState<Product[]>(fallbackShowcase);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionDuration = 500; // ms
  const displayDuration = 5000; // ms

  const currentProduct = items[currentIndex];
  const isEven = currentIndex % 2 === 0;

  // Fetch new-arrival products from DB, map to showcase items while preserving style
  useEffect(() => {
    let mounted = true;
    async function fetchNewArrivals() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id,name,price,product_images(image_url,order_index)')
          .eq('new_arrival', true)
          .order('created_at', { ascending: false })
          .limit(5);
        if (error) throw error;
        const rows = (data ?? []) as any[];
        if (!mounted) return;
        if (rows.length === 0) {
          setItems(fallbackShowcase);
          return;
        }
        const mapped: Product[] = rows.map((p, idx) => {
          const imgs = (p.product_images ?? []).sort(
            (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
          );
          const image = imgs[0]?.image_url || 'https://via.placeholder.com/800x800';
          return {
            id: p.id,
            name: p.name,
            price: formatPrice(p.price),
            imageUrl: image,
            href: `/db-products/${p.id}`,
            quote: defaultQuotes[idx % defaultQuotes.length],
          };
        });
        setItems(mapped);
      } catch (err) {
        // On error, keep fallback to avoid breaking UI
        setItems(fallbackShowcase);
        // eslint-disable-next-line no-console
        console.error('Failed to fetch new arrivals:', err);
      }
    }
    fetchNewArrivals();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, displayDuration);
    };

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  // Handle slide transition
  const goToSlide = (index: number, dir: 'next' | 'prev') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    // Reset interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
      
      // Restart interval
      intervalRef.current = setInterval(() => {
        goToNext();
      }, displayDuration);
    }, transitionDuration);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    goToSlide(nextIndex, 'next');
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    goToSlide(prevIndex, 'prev');
  };

  return (
    <section className="relative overflow-hidden py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-semibold text-accent">New Arrivals Showcase</h2>
        
        <div className="relative h-[500px] md:h-[600px]">
          {/* Product Card with Quote */}
          <div 
            className={`absolute inset-0 flex flex-col md:flex-row items-center transition-opacity duration-500 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Product Image - Always in the center for mobile, alternating for desktop */}
            <div className={`w-full md:w-1/2 order-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
              <div className="relative mx-auto h-[300px] w-full max-w-md overflow-hidden rounded-lg md:h-[500px]">
                <Image
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h3 className="text-xl font-medium">{currentProduct.name}</h3>
                  <p className="mt-1">{currentProduct.price}</p>
                </div>
              </div>
            </div>
            
            {/* Quote - Always below for mobile, alternating for desktop */}
            <div className={`w-full md:w-1/2 order-2 mt-6 md:mt-0 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
              <div 
                className={`mx-auto max-w-md p-6 ${
                  isEven 
                    ? 'animate-slide-in-right md:pl-12' 
                    : 'animate-slide-in-left md:pr-12'
                }`}
              >
                <blockquote className="text-xl italic text-accent">
                  "{currentProduct.quote}"
                </blockquote>
                <Link 
                  href={currentProduct.href}
                  className="mt-6 inline-block rounded-full bg-accent px-6 py-2 text-white transition hover:bg-accent/90"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={goToPrev}
            className="rounded-full bg-accent/10 p-3 text-accent transition hover:bg-accent/20"
            aria-label="Previous product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index, index > currentIndex ? 'next' : 'prev')}
                className={`h-2 w-2 rounded-full transition ${
                  currentIndex === index ? 'bg-accent w-4' : 'bg-accent/30'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNext}
            className="rounded-full bg-accent/10 p-3 text-accent transition hover:bg-accent/20"
            aria-label="Next product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
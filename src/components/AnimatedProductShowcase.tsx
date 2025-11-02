"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  href: string;
  quote: string;
}

const showcaseProducts: Product[] = [
  {
    id: '1',
    name: 'Idolize Tote Bag',
    price: 'Rs 4,500',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974',
    href: '/products/idolize-tote-bag',
    quote: 'Elegance is the only beauty that never fades. Embrace timeless style with our signature collection.',
  },
  {
    id: '2',
    name: 'Rectangular Sunglasses',
    price: 'Rs 5,800',
    imageUrl: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
    href: '/products/rectangular-sunglasses',
    quote: 'Confidence comes from within, but a well-tailored accessory helps. Discover style redefined.',
  },
  {
    id: '3',
    name: 'Necessary Scarf',
    price: 'Rs 1,500',
    imageUrl: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vZGVsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
    href: '/products/necessary-scarf',
    quote: 'The finishing touch that speaks volumes. Our accessories add subtle luxury to every outfit.',
  },
  {
    id: '4',
    name: 'Relay Track Pants',
    price: 'Rs 2,900',
    imageUrl: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg',
    href: '/products/relay-track-pants',
    quote: 'Carry your world with style. Thoughtfully designed for the modern lifestyle.',
  },
  {
    id: '5',
    name: 'Polarised Sunglasses',
    price: 'Rs 2,300',
    imageUrl: 'https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY',
    href: '/products/polarised-sunglasses',
    quote: 'Adorn yourself with pieces that tell your story. Accessories that become a part of you.',
  }
];

export default function AnimatedProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionDuration = 500; // ms
  const displayDuration = 5000; // ms

  const currentProduct = showcaseProducts[currentIndex];
  const isEven = currentIndex % 2 === 0;

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
    const nextIndex = (currentIndex + 1) % showcaseProducts.length;
    goToSlide(nextIndex, 'next');
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + showcaseProducts.length) % showcaseProducts.length;
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
            {showcaseProducts.map((_, index) => (
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
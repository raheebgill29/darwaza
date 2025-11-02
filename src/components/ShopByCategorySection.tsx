"use client";

import CategoryCard from "@/components/CategoryCard";
import { useEffect, useRef, useState } from "react";

export default function ShopByCategorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set visibility based on intersection state
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Adjust this value to control when the animation triggers
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const categories = [
    {
      title: "Clothes",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
      href: "/category/clothes",
    },
    {
      title: "Accessories",
      image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop",
      href: "/category/accessories",
    },
    {
      title: "Jewelry",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2070&auto=format&fit=crop",
      href: "/category/jewelry",
    },
    {
      title: "New In",
      image: "https://fastly.picsum.photos/id/152/3888/2592.jpg?hmac=M1xv1MzO9xjf5-tz1hGR9bQpNt973ANkqfEVDW0-WYU",
      href: "/category/new-in",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-10 px-4 max-w-7xl mx-auto"
    >
      <div 
        className={`transition-all duration-1000 transform ${
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-20"
        }`}
      >
        <h2 className="mb-8 text-center text-3xl font-semibold text-accent">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.title}
              className={`transition-all duration-1000 delay-${index * 100} transform ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-20"
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms" 
              }}
            >
              <CategoryCard
                title={category.title}
                image={category.image}
                href={category.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
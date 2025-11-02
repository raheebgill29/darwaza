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
      title: "Makeup",
      image: "https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg",
      href: "/categories/makeup",
    },
    {
      title: "Skincare",
      image: "https://fastly.picsum.photos/id/65/4912/3264.jpg?hmac=uq0IxYtPIqRKinGruj45KcPPzxDjQvErcxyS1tn7bG0",
      href: "/categories/skincare",
    },
    {
      title: "Foundation",
      image: "https://fastly.picsum.photos/id/146/5000/3333.jpg?hmac=xdlFnzoavokA3U-bzo35Vk4jTBKx8C9fqH5IuCPXj2U",
      href: "/categories/foundation",
    },
    {
      title: "New In",
      image: "https://fastly.picsum.photos/id/152/3888/2592.jpg?hmac=M1xv1MzO9xjf5-tz1hGR9bQpNt973ANkqfEVDW0-WYU",
      href: "/categories/new-in",
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
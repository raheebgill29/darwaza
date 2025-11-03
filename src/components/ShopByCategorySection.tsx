"use client";

import CategoryCard from "@/components/CategoryCard";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Category = {
  id: string;
  name: string;
  image_url: string | null;
  image_alt: string | null;
};

export default function ShopByCategorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, image_url, image_alt')
          .order('name');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Fallback categories if database is empty
  const fallbackCategories = [
    {
      id: "1",
      name: "Clothes",
      image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
      image_alt: "Clothes category",
    },
    {
      id: "2",
      name: "Accessories",
      image_url: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop",
      image_alt: "Accessories category",
    },
    {
      id: "3",
      name: "Jewelry",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2070&auto=format&fit=crop",
      image_alt: "Jewelry category",
    },
    {
      id: "4",
      name: "New In",
      image_url: "https://fastly.picsum.photos/id/152/3888/2592.jpg?hmac=M1xv1MzO9xjf5-tz1hGR9bQpNt973ANkqfEVDW0-WYU",
      image_alt: "New arrivals",
    },
  ];

  // Use database categories if available, otherwise use fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

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
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse">Loading categories...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <div 
                key={category.id}
                className={`transition-all duration-1000 transform ${
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-20"
                }`}
                style={{ 
                  transitionDelay: isVisible ? `${index * 150}ms` : "0ms" 
                }}
              >
                <CategoryCard
                  title={category.name}
                  image={category.image_url || ""}
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  alt={category.image_alt || category.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
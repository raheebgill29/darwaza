"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { getCategoryBySlug, getProductsByCategory } from "@/data/categories";
import CategoryHero from "@/components/CategoryHero";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [filters, setFilters] = useState({
    priceRange: [],
  });
  const category = getCategoryBySlug(slug);

  useEffect(() => {
    if (slug) {
      const categoryProducts = getProductsByCategory(slug, products);
      
      // Apply sorting and filtering
      let sortedAndFiltered = [...categoryProducts];
      
      // Apply price range filter if selected
      if (filters.priceRange && filters.priceRange.length > 0) {
        sortedAndFiltered = sortedAndFiltered.filter(product => {
          const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
          
          return filters.priceRange.some(range => {
            if (range === 'under-1000') return price < 1000;
            if (range === '1000-3000') return price >= 1000 && price <= 3000;
            if (range === '3000-5000') return price >= 3000 && price <= 5000;
            if (range === 'over-5000') return price > 5000;
            return true;
          });
        });
      }
      
      // Apply sorting
      sortedAndFiltered.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        
        if (sortOption === 'price-low-high') {
          return priceA - priceB;
        } else if (sortOption === 'price-high-low') {
          return priceB - priceA;
        } else if (sortOption === 'newest') {
          // For demo purposes, we'll just reverse the array
          return -1;
        }
        
        // Default: featured
        return 0;
      });
      
      setFilteredProducts(sortedAndFiltered);
    }
  }, [slug, sortOption, filters]);

  if (!category) {
    return (
      <div className="min-h-screen bg-brand-50 font-sans">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold text-accent">Category Not Found</h1>
          <p className="mt-4 text-accent/80">The category you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <CategoryHero category={category} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <CategoryBreadcrumb categoryName={category.name} />
        
        {/* Featured Products Section */}
        <FeaturedProducts products={filteredProducts} />
        
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        <NewsletterSubscribe />
      </main>
      <Footer />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import type { Product as UIProduct } from "@/data/products";
import type { Category as UICategory } from "@/data/categories";
import CategoryHero from "@/components/CategoryHero";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

function formatPrice(num: number | string) {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (Number.isNaN(n)) return `${num}`;
  return `Rs ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [dbCategory, setDbCategory] = useState<UICategory | null>(null);
  const [allProducts, setAllProducts] = useState<Array<UIProduct & { href?: string }>>([]);
  const [featuredOnly, setFeaturedOnly] = useState<Array<UIProduct & { href?: string }>>([]);
  const [filteredProducts, setFilteredProducts] = useState<Array<UIProduct & { href?: string }>>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [filters, setFilters] = useState<{ priceRange: string[] }>({ priceRange: [] });
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      if (!slug) return;
      setNotFound(false);
      // Derive category name from slug (reverse of slugify used in ShopByCategorySection)
      const nameQuery = slug.replace(/-/g, " ");

      const { data: cats, error: catErr } = await supabase
        .from("categories")
        .select("id,name,image_url")
        .ilike("name", `%${nameQuery}%`)
        .limit(1);
      if (catErr || !cats || cats.length === 0) {
        setNotFound(true);
        setDbCategory(null);
        setAllProducts([]);
        setFeaturedOnly([]);
        setFilteredProducts([]);
        return;
      }

      const catRow = cats[0] as { id: string; name: string; image_url: string | null };
      const heroCategory: UICategory = {
        id: catRow.id,
        name: catRow.name,
        slug,
        description: `Discover our selection in ${catRow.name}.`,
        image: catRow.image_url || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
        featured: true,
      };
      setDbCategory(heroCategory);

      const { data: prods, error: prodErr } = await supabase
        .from("products")
        .select("id,name,price,description,featured,product_images(image_url,order_index)")
        .eq("category_id", catRow.id)
        .order("created_at", { ascending: false });
      if (prodErr || !prods) {
        setAllProducts([]);
        setFeaturedOnly([]);
        setFilteredProducts([]);
        return;
      }

      const mapped: Array<UIProduct & { href?: string }> = (prods as any[]).map((p) => {
        const images = (p.product_images ?? []).sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
        const image = images[0]?.image_url || "https://via.placeholder.com/600x600";
        return {
          slug: p.id, // use id as unique slug key for UI components
          title: p.name,
          category: catRow.name as any,
          price: formatPrice(p.price),
          image,
          description: p.description ?? "",
          details: undefined,
          badge: p.featured ? "FEATURED" : undefined,
          href: `/db-products/${p.id}`,
        };
      });

      setAllProducts(mapped);
      setFeaturedOnly(mapped.filter((m) => m.badge === "FEATURED"));
      // Initialize filtered list to all mapped products
      setFilteredProducts(mapped);
    }

    fetchCategoryAndProducts();
  }, [slug]);

  // Apply filters and sorting on the mapped products whenever controls change
  useEffect(() => {
    let sortedAndFiltered = [...allProducts];

    if (filters.priceRange && filters.priceRange.length > 0) {
      sortedAndFiltered = sortedAndFiltered.filter((product) => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ""));
        return filters.priceRange.some((range) => {
          if (range === "under-1000") return price < 1000;
          if (range === "1000-3000") return price >= 1000 && price <= 3000;
          if (range === "3000-5000") return price >= 3000 && price <= 5000;
          if (range === "over-5000") return price > 5000;
          return true;
        });
      });
    }

    sortedAndFiltered.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
      if (sortOption === "price-low-high") return priceA - priceB;
      if (sortOption === "price-high-low") return priceB - priceA;
      if (sortOption === "newest") return -1; // simple newest behavior
      return 0; // default featured keeps current order
    });

    setFilteredProducts(sortedAndFiltered);
  }, [allProducts, sortOption, filters]);

  if (notFound || !dbCategory) {
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

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleFilterChange = (newFilters: {priceRange: string[]}) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <CategoryHero category={dbCategory} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <CategoryBreadcrumb categoryName={dbCategory.name} />
        
        {/* Featured Products Section */}
        <FeaturedProducts products={featuredOnly} />
        
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
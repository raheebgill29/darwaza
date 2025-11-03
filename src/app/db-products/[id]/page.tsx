"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/data/products";

function formatPrice(num: number | string) {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (Number.isNaN(n)) return `${num}`;
  return `Rs ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function DbProductPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [related, setRelated] = useState<Array<Product & { href?: string }>>([]);
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) {
          setError("Product ID is missing");
          setLoading(false);
          return;
        }

        // Fetch the base product (without non-existent columns)
        const { data: p, error: fetchError } = await supabase
          .from("products")
          .select("id,name,price,description,featured,stock,category_id,product_images(id,image_url,order_index)")
          .eq("id", id)
          .single();

        if (fetchError || !p) {
          console.error("Error fetching product:", fetchError);
          setError("Product not found");
          setLoading(false);
          return;
        }

        // Fetch category name
        let categoryName: string = "Accessories";
        if (p.category_id) {
          const { data: cat } = await supabase
            .from("categories")
            .select("name")
            .eq("id", p.category_id)
            .single();
          
          if (cat?.name) {
            categoryName = cat.name;
          }
        }

        // Sort images by order_index
        const images = (p.product_images ?? []).sort(
          (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
        );
        const image = images[0]?.image_url || "https://via.placeholder.com/800x800";
        const galleryUrls: string[] = images
          .map((img: any) => img?.image_url)
          .filter((url: string | undefined): url is string => Boolean(url));
        setGallery(galleryUrls);

        // Fetch property values for this product and map to details
        let details: Record<string, string> | undefined = undefined;
        const { data: propRows, error: propErr } = await supabase
          .from("product_property_values")
          .select("value, category_properties(name)")
          .eq("product_id", id);

        if (!propErr && propRows && propRows.length > 0) {
          const mappedDetails: Record<string, string> = {};
          (propRows as any[]).forEach((row) => {
            const name = row?.category_properties?.name;
            const value = row?.value;
            if (name && value) {
              mappedDetails[name] = value;
            }
          });
          if (Object.keys(mappedDetails).length > 0) {
            details = mappedDetails;
          }
        }

        // Map to Product type
        const mappedProduct: Product = {
          slug: p.id,
          title: p.name,
          category: categoryName as any,
          price: formatPrice(p.price),
          image,
          description: p.description ?? "",
          details,
          badge: p.featured ? "FEATURED" : undefined,
        };

        setProduct(mappedProduct);
        setStock(p.stock ?? 0);
        // Fetch random related products after product loads
        await fetchRelatedRandom(id, categoryName);
        setLoading(false);
      } catch (err) {
        console.error("Error in product fetch:", err);
        setError("Failed to load product");
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  async function fetchRelatedRandom(currentId: string, currentCategoryName?: string) {
    try {
      // Fetch a sample of products across all categories, exclude the current one
      const { data: prods, error: prodErr } = await supabase
        .from("products")
        .select("id,name,price,product_images(image_url,order_index)")
        .neq("id", currentId)
        .order("created_at", { ascending: false })
        .limit(24);

      if (prodErr || !prods) return;

      const items = (prods as any[]).map((p) => {
        const images = (p.product_images ?? []).sort(
          (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
        );
        const image = images[0]?.image_url || "https://via.placeholder.com/600x600";
        const mapped: Product & { href?: string } = {
          slug: p.id,
          title: p.name,
          category: (currentCategoryName || "Accessories") as any,
          price: formatPrice(p.price),
          image,
          description: "",
          details: undefined,
          badge: undefined,
          href: `/db-products/${p.id}`,
        };
        return mapped;
      });

      // Shuffle and take 4
      const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 4);
      setRelated(shuffled);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 font-sans">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-accent/80">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-brand-50 font-sans">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold text-accent">Product Not Found</h1>
          <p className="mt-4 text-accent/80">The product you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <ProductDetail product={product} images={gallery} relatedProducts={related} maxStock={stock ?? undefined} />
      </main>
      <Footer />
    </div>
  );
}
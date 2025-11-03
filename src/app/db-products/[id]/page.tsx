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

export default async function DbProductPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const { data: p, error } = await supabase
    .from("products")
    .select("id,name,price,description,featured,category_id,product_images(image_url,order_index)")
    .eq("id", id)
    .single();

  let categoryName: string | null = null;
  if (p?.category_id) {
    const { data: cat } = await supabase
      .from("categories")
      .select("name")
      .eq("id", p.category_id)
      .single();
    categoryName = cat?.name ?? null;
  }

  if (error || !p) {
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

  const images = (p.product_images ?? []).sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
  const image = images[0]?.image_url || "https://via.placeholder.com/800x800";

  const product: Product = {
    slug: p.id,
    title: p.name,
    category: (categoryName ?? "Accessories") as any,
    price: formatPrice(p.price),
    image,
    description: p.description ?? "",
    details: undefined,
    badge: p.featured ? "FEATURED" : undefined,
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  );
}
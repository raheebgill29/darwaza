import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/data/products";

type Params = { id: string };

function formatPrice(p: number | string) {
  const num = typeof p === "string" ? parseFloat(p) : p;
  if (Number.isNaN(num)) return `${p}`;
  return `Rs ${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { data } = await supabase
    .from("products")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  const title = data?.name ? `${data.name} | Darwaza` : "Product";
  return { title };
}

export default async function DbProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `id,name,description,price,
       category:categories(name),
       product_images(image_url,order_index),
       product_sizes(size,stock),
       product_property_values(value, property:category_properties(name))`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    return (
      <div className="min-h-screen bg-brand-50 font-sans">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-accent">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const images = (product.product_images ?? []).sort(
    (a: any, b: any) => (a?.order_index ?? 0) - (b?.order_index ?? 0)
  );
  const image = images[0]?.image_url ?? "/file.svg";

  const details: Record<string, string> = {};
  const props = (product.product_property_values ?? []) as Array<{
    value: string | null;
    property?: { name?: string } | null;
  }>;
  for (const row of props) {
    const key = row.property?.name?.trim();
    const val = (row.value ?? "").trim();
    if (key && val) details[key] = val;
  }

  const sizes = (product.product_sizes ?? []) as Array<{ size: string; stock: number }>;
  if (sizes.length > 0) {
    const sizeText = sizes.map((s) => `${s.size}: ${s.stock}`).join(", ");
    details["Sizes"] = sizeText;
  }

  const uiProduct: Product = {
    slug: id,
    title: product.name,
    category: "Clothes", // map to existing union to satisfy type
    price: formatPrice(product.price),
    image,
    description: product.description ?? "",
    details: Object.keys(details).length > 0 ? details : undefined,
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main>
        <ProductDetail product={uiProduct} />
      </main>
      <Footer />
    </div>
  );
}
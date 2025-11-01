import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  categoryName: string;
  title?: string;
  limit?: number;
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  product_images?: Array<{ image_url: string; order_index: number }>; // related table
};

function formatPrice(p: number | string) {
  const num = typeof p === "string" ? parseFloat(p) : p;
  if (Number.isNaN(num)) return `${p}`;
  return `Rs ${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default async function CategoryProductsSection({ categoryName, title, limit = 8 }: Props) {
  // Find category id by a case-insensitive match (handles "Dress"/"Dresses")
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id,name")
    .ilike("name", `%${categoryName}%`)
    .limit(1);

  if (catErr || !cats || cats.length === 0) {
    // Silently render nothing if category missing
    return null;
  }

  const categoryId = cats[0].id as string;

  // Fetch products in this category with their images
  const { data: prods, error: prodErr } = await supabase
    .from("products")
    .select("id,name,price,product_images(image_url,order_index)")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (prodErr || !prods || prods.length === 0) {
    return null;
  }

  const items = (prods as ProductRow[]).map((p) => {
    const images = (p.product_images ?? []).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const image = images[0]?.image_url || undefined;
    return {
      title: p.name,
      price: formatPrice(p.price),
      image,
      href: `/db-products/${p.id}`,
    };
  });

  return (
    <section className="mx-auto max-w-6xl py-10">
      {title && <h3 className="text-2xl font-semibold text-accent">{title}</h3>}
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.title} title={p.title} price={p.price} image={p.image} href={p.href} />
        ))}
      </div>
    </section>
  );
}
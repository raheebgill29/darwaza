import ProductCard from "@/components/ProductCard";
import CategoryProductsSection from "@/components/CategoryProductsSection";

export default function CategorySections() {
  // Dynamic section powered by Supabase: Dress products
  // Rendered first, then fallback demo sections below
  // Note: If no Dress category or products, this renders nothing
  const DressSection = (
    <CategoryProductsSection categoryName="dress" title="Dress" />
  );

  const clothes = [
    { title: "Rose Midi Dress", price: "Rs 4,500", image: "https://images.unsplash.com/photo-1520975666741-aabf2f5b1cb7?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/rose-midi-dress" },
    { title: "Soft Knit Top", price: "Rs 2,100", image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/soft-knit-top" },
    { title: "Flowy Skirt", price: "Rs 3,200", image: "https://images.unsplash.com/photo-1495121605193-b116b5b09aaf?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/flowy-skirt" },
    { title: "Classic Blazer", price: "Rs 5,800", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/classic-blazer" },
  ];

  const accessories = [
    { title: "Everyday Tote", price: "Rs 2,900", image: "https://images.unsplash.com/photo-1512436991641-6745b483bdf2?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/everyday-tote" },
    { title: "Silk Scarf", price: "Rs 1,500", image: "https://images.unsplash.com/photo-1520962919747-0db62351a250?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/silk-scarf" },
    { title: "Compact Wallet", price: "Rs 1,800", image: "https://images.unsplash.com/photo-1582587773867-8b3db5dfdeb3?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/compact-wallet" },
    { title: "Rose Hair Clip", price: "Rs 650", image: "https://images.unsplash.com/photo-1543353071-087092ec3936?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/rose-hair-clip" },
  ];

  const jewelry = [
    { title: "Petal Studs", price: "Rs 1,200", image: "https://images.unsplash.com/photo-1518544801976-3e9aae69b2f5?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/petal-studs" },
    { title: "Rose Pendant", price: "Rs 2,300", image: "https://images.unsplash.com/photo-1542332213-32a0d66f2b1f?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/rose-pendant" },
    { title: "Stacking Rings", price: "Rs 1,000", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/stacking-rings" },
    { title: "Charm Bracelet", price: "Rs 1,750", image: "https://images.unsplash.com/photo-1535585209827-a15fc8ff8e88?auto=format&fit=crop&w=400&h=300&q=60", href: "/products/charm-bracelet" },
  ];

  return (
    <section className="mx-auto max-w-6xl py-10">
      {DressSection}
      {/* Clothes */}
      <h3 className="text-2xl font-semibold text-accent">Clothes</h3>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clothes.map((p) => (
          <ProductCard key={p.title} title={p.title} price={p.price} image={p.image} href={p.href} />
        ))}
      </div>

      {/* Accessories */}
      <h3 className="mt-10 text-2xl font-semibold text-accent">Accessories</h3>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {accessories.map((p) => (
          <ProductCard key={p.title} title={p.title} price={p.price} image={p.image} href={p.href} />
        ))}
      </div>

      {/* Jewelry */}
      <h3 className="mt-10 text-2xl font-semibold text-accent">Jewelry</h3>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {jewelry.map((p) => (
          <ProductCard key={p.title} title={p.title} price={p.price} image={p.image} href={p.href} />
        ))}
      </div>
    </section>
  );
}
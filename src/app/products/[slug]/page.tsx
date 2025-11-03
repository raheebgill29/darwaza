import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { products, getProductBySlug } from "@/data/products";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Product Not Found" };
  return { title: `${p.title} | Darwaza` };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  );
}
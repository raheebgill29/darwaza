import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const { title, price, image, description, details, category } = product;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-brand-base p-4">
          <Image
            src={image}
            alt={title}
            width={800}
            height={600}
            className="rounded-xl object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-accent/70">{category}</p>
          <h1 className="mt-1 text-3xl font-semibold text-accent">{title}</h1>
          <p className="mt-2 text-xl text-accent">{price}</p>

          <p className="mt-4 text-accent/90">{description}</p>

          {details && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(details).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-brand-base/70 p-3">
                  <p className="text-xs text-accent/70">{k}</p>
                  <p className="text-accent">{v}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button className="rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90">Add to Cart</button>
            <Link href="/" className="rounded-full border border-accent px-5 py-2 text-accent hover:bg-white/60">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
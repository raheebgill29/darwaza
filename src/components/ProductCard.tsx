import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type ProductCardProps = {
  title: string;
  price?: string;
  image?: string; // local or remote URL
  href?: string;
  id?: string;
  showMeta?: boolean; // controls title/price block below image
};

export default function ProductCard({
  title,
  price,
  image = "/file.svg",
  href = "#",
  id,
  showMeta = true,
}: ProductCardProps) {
  const [src, setSrc] = useState(image);
  const resolvedId = useMemo(() => {
    if (id) return id;
    if (href && href !== "#") {
      const seg = href.split("/").filter(Boolean).pop();
      if (seg) return seg;
    }
    return title.toLowerCase().replace(/\s+/g, "-");
  }, [id, href, title]);
  return (
    <Link href={href} className="relative flex flex-col group">
      <div className="relative h-72 overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          onError={() => setSrc("https://picsum.photos/400/300")}
        />
      </div>
      {showMeta && (
        <div className="p-4">
          <h3 className="text-sm tracking-tight group-hover:underline">{title}</h3>
          <div className="flex items-center justify-between">
            {price && <p className="text-sm font-bold">{price}</p>}
          </div>
        </div>
      )}
    </Link>
  );
}
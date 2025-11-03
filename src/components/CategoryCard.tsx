import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  image: string;
  href: string;
  alt?: string;
};

export default function CategoryCard({
  title,
  image,
  href,
  alt,
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block text-center">
      <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105">
        <Image
          src={image}
          alt={alt || title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-accent transition-colors duration-300">
        {title}
      </h3>
    </Link>
  );
}
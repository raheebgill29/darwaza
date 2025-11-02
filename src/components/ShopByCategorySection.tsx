import CategoryCard from "@/components/CategoryCard";

export default function ShopByCategorySection() {
  const categories = [
    {
      title: "Makeup",
      image: "https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg",
      href: "/categories/makeup",
    },
    {
      title: "Skincare",
      image: "https://fastly.picsum.photos/id/65/4912/3264.jpg?hmac=uq0IxYtPIqRKinGruj45KcPPzxDjQvErcxyS1tn7bG0",
      href: "/categories/skincare",
    },
    {
      title: "Foundation",
      image: "https://fastly.picsum.photos/id/146/5000/3333.jpg?hmac=xdlFnzoavokA3U-bzo35Vk4jTBKx8C9fqH5IuCPXj2U",
      href: "/categories/foundation",
    },
    {
      title: "New In",
      image: "https://fastly.picsum.photos/id/152/3888/2592.jpg?hmac=M1xv1MzO9xjf5-tz1hGR9bQpNt973ANkqfEVDW0-WYU",
      href: "/categories/new-in",
    },
  ];

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="mb-8 text-center text-3xl font-semibold text-accent">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            image={category.image}
            href={category.href}
          />
        ))}
      </div>
    </section>
  );
}
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
};

export const categories: Category[] = [
  {
    id: "clothes",
    name: "Clothes",
    slug: "clothes",
    description: "Discover our stunning collection of clothes designed for comfort and style.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
    featured: true
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look with our carefully curated accessories collection.",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop",
    featured: true
  },
  {
    id: "jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description: "Add a touch of elegance with our exquisite jewelry pieces.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2070&auto=format&fit=crop",
    featured: true
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string, products: any[]): any[] {
  return products.filter((product) => {
    const category = typeof product.category === 'string' 
      ? product.category.toLowerCase() 
      : '';
    
    return category === categorySlug.toLowerCase();
  });
}
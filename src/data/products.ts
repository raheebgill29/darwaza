export type Product = {
  slug: string;
  title: string;
  category: "Clothes" | "Accessories" | "Jewelry";
  price: string;
  image: string;
  description: string;
  details?: Record<string, string>;
  badge?: string;
};

export const products: Product[] = [
  // Clothes
  {
    slug: "rose-midi-dress",
    title: "Brown Dress",
    category: "Clothes",
    price: "$90.00",
    image:
      "https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY",
    description:
      "Elegant brown dress with a modern silhouette. Perfect for both casual and formal occasions.",
    details: {
      Material: "Polyester blend",
      Fit: "Regular",
      Care: "Machine wash cold",
      Color: "Brown",
    },
  },
  {
    slug: "soft-knit-top",
    title: "Brigette Longsleeve",
    category: "Clothes",
    price: "120.00$",
    image:
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
    description:
      "Elegant longsleeve top with a comfortable fit. Perfect for casual and semi-formal occasions.",
    details: {
      Material: "Cotton blend",
      Fit: "Regular",
      Care: "Machine wash cold",
      Color: "Multiple colors available",
      "Original Price": "100.00$"
    },
    badge: "-33%",
  },
  {
    slug: "flowy-skirt",
    title: "Flowy Skirt",
    category: "Clothes",
    price: "Rs 3,200",
    image:
      "https://images.unsplash.com/photo-1495121605193-b116b5b09aaf?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "A light, airy skirt with a gentle drape. Elastic waistband for comfort and fit.",
    details: {
      Material: "Polyester",
      Length: "Midi",
      Care: "Machine wash cold",
      Color: "Dusty rose",
    },
  },
  {
    slug: "classic-blazer",
    title: "Relay Track Pants",
    category: "Clothes",
    price: "250.00$",
    image:
      "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg",
    description:
      "Comfortable track pants with modern design. Perfect for active lifestyles and casual wear.",
    details: {
      Material: "Cotton blend",
      Fit: "Regular",
      Care: "Machine wash cold",
      Color: "Black",
    },
  },

  // Accessories
  {
    slug: "everyday-tote",
    title: "Idolize Tote Bag",
    category: "Accessories",
    price: "116.00$",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974",
    description:
      "Stylish tote bag with sturdy handles and interior pockets. Perfect for everyday use with a modern design.",
    details: {
      Material: "Premium canvas",
      Size: "42cm x 35cm",
      Care: "Wipe clean",
      Color: "Beige",
      "Original Price": "200.00$"
    },
    badge: "NEW",
  },
  {
    slug: "silk-scarf",
    title: "Rectangular Sunglasses",
    category: "Accessories",
    price: "110.00$",
    image:
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
    description:
      "Stylish rectangular sunglasses with UV protection. Modern design that complements any outfit.",
    details: {
      Material: "Acetate frame",
      Size: "Standard",
      Care: "Clean with microfiber cloth",
      Color: "Black",
      "Original Price": "120.00$"
    },
    badge: "NEW",
  },
  {
    slug: "compact-wallet",
    title: "Compact Wallet",
    category: "Accessories",
    price: "Rs 1,800",
    image:
      "https://images.unsplash.com/photo-1582587773867-8b3db5dfdeb3?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Slim wallet with card slots and a secure zip pocket. Fits easily in small bags.",
    details: {
      Material: "Leather",
      Size: "10cm x 8cm",
      Care: "Wipe clean",
      Color: "Mocha",
    },
  },
  {
    slug: "rose-hair-clip",
    title: "Rose Hair Clip",
    category: "Accessories",
    price: "Rs 650",
    image:
      "https://images.unsplash.com/photo-1543353071-087092ec3936?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Delicate rose-shaped hair clip with a secure clasp. Finishes hairstyles with a romantic touch.",
    details: {
      Material: "Metal & resin",
      Size: "5cm",
      Care: "Wipe clean",
      Color: "Rose blush",
    },
  },

  // Jewelry
  {
    slug: "petal-studs",
    title: "Gold Hoops",
    category: "Jewelry",
    price: "$60.00",
    image:
      "https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY",
    description:
      "Elegant gold hoop earrings that add a touch of sophistication to any outfit. Perfect for everyday wear or special occasions.",
    details: {
      Material: "Gold-plated brass",
      Size: "Medium",
      Care: "Store in jewelry box when not in use",
      Color: "Gold",
    },
  },
  {
    slug: "rose-pendant",
    title: "Polarised Sunglasses",
    category: "Accessories",
    price: "200.00$",
    image:
      "https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY",
    description:
      "High-quality polarised sunglasses that reduce glare and provide UV protection. Stylish design for everyday wear.",
    details: {
      Material: "Metal frame with polarised lenses",
      Size: "Standard",
      Care: "Store in case when not in use",
      Color: "Gold/Brown",
    },
  },
  {
    slug: "stacking-rings",
    title: "Stacking Rings",
    category: "Jewelry",
    price: "Rs 1,000",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Set of slim rings designed for stacking. Mix and match for a personalized look.",
    details: {
      Material: "Brass",
      Finish: "Matte",
      Care: "Keep dry",
      Color: "Gold",
    },
  },
  {
    slug: "charm-bracelet",
    title: "Charm Bracelet",
    category: "Jewelry",
    price: "Rs 1,750",
    image:
      "https://images.unsplash.com/photo-1535585209827-a15fc8ff8e88?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Delicate bracelet with rose-themed charms. Lightweight and comfortable for daily wear.",
    details: {
      Material: "Alloy",
      Finish: "Polished",
      Care: "Wipe with soft cloth",
      Color: "Rose gold",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
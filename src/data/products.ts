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
    title: "Rose Midi Dress",
    category: "Clothes",
    price: "Rs 4,500",
    image:
      "https://images.unsplash.com/photo-1520975666741-aabf2f5b1cb7?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "A soft, flowy midi dress in a rose-toned fabric. Tailored waist with gentle pleats for an elegant silhouette.",
    details: {
      Material: "100% Viscose",
      Fit: "Regular",
      Care: "Machine wash cold",
      Color: "Rose blush",
    },
  },
  {
    slug: "soft-knit-top",
    title: "Soft Knit Top",
    category: "Clothes",
    price: "Rs 2,100",
    image:
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Cozy knit top with subtle ribbing and a relaxed neckline. Perfect for everyday layering.",
    details: {
      Material: "Cotton blend",
      Fit: "Relaxed",
      Care: "Hand wash recommended",
      Color: "Warm taupe",
    },
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
    title: "Classic Blazer",
    category: "Clothes",
    price: "Rs 5,800",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Tailored blazer with clean lines and soft structure. Versatile piece for work and evenings.",
    details: {
      Material: "Poly-cotton",
      Fit: "Tailored",
      Care: "Dry clean",
      Color: "Charcoal cocoa",
    },
  },

  // Accessories
  {
    slug: "everyday-tote",
    title: "Everyday Tote",
    category: "Accessories",
    price: "Rs 2,900",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745b483bdf2?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Spacious tote with sturdy handles and interior pockets. Minimal design in soft rose tones.",
    details: {
      Material: "PU leather",
      Size: "40cm x 32cm",
      Care: "Wipe clean",
      Color: "Blush",
    },
  },
  {
    slug: "silk-scarf",
    title: "Silk Scarf",
    category: "Accessories",
    price: "Rs 1,500",
    image:
      "https://images.unsplash.com/photo-1520962919747-0db62351a250?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Lightweight silk scarf with delicate sheen. Adds a soft touch to any outfit.",
    details: {
      Material: "Silk",
      Size: "90cm x 90cm",
      Care: "Dry clean",
      Color: "Rose print",
    },
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
    title: "Petal Studs",
    category: "Jewelry",
    price: "Rs 1,200",
    image:
      "https://images.unsplash.com/photo-1518544801976-3e9aae69b2f5?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Minimal petal-shaped studs with a soft shine. Everyday earrings in a subtle rose hue.",
    details: {
      Material: "Stainless steel",
      Finish: "Rose gold",
      Care: "Avoid water",
      Color: "Rose gold",
    },
  },
  {
    slug: "rose-pendant",
    title: "Rose Pendant",
    category: "Jewelry",
    price: "Rs 2,300",
    image:
      "https://images.unsplash.com/photo-1542332213-32a0d66f2b1f?auto=format&fit=crop&w=800&h=600&q=70",
    description:
      "Pendant necklace with a delicate rose charm. Adjustable chain length for versatile styling.",
    details: {
      Material: "Alloy",
      Finish: "Rose gold",
      Length: "45cm + 5cm",
      Care: "Avoid perfume",
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
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HoverInfoOverlay from '@/components/HoverInfoOverlay';

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  href: string;
  discount?: string;
  isNew?: boolean;
  colors?: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Idolize Tote Bag',
    price: '116.00$',
    originalPrice: '200.00$',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974',
    href: '#',
    discount: '-42%',
    isNew: true,
  },
  {
    id: '2',
    name: 'Rectangular Sunglasses',
    price: '110.00$',
    originalPrice: '120.00$',
    imageUrl: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
    href: '#',
    isNew: true,
  },
  {
    id: '3',
    name: 'Necessary Scarf',
    price: '200.00$',
    imageUrl: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vZGVsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
    href: '#',
  },
  {
    id: '4',
    name: 'Relay Track Pants',
    price: '250.00$',
    imageUrl: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg',
    href: '#',
  },
  {
    id: '7',
    name: 'Polarised Sunglasses',
    price: '200.00$',
    imageUrl: 'https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY',
    href: '#',
  },
  {
    id: '8',
    name: 'Brigette Longsleeve',
    price: '120.00$',
    originalPrice: '100.00$',
    imageUrl: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
    href: '#',
    discount: '-33%',
    colors: ['#D1D5DB', '#F3F4F6', '#6B7280'],
  },
];

const ProductGridSection: React.FC = () => {
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mr-2">Top Rated</h2>
        <span className="text-2xl text-gray-400">/</span>
        <h2 className="text-2xl font-bold text-gray-400 ml-2">Best Sellers</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={product.href} key={product.id} className="group block">
            <div className="group relative w-full h-[350px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <HoverInfoOverlay title={product.name} price={product.price} />
              {(product.discount || product.isNew) && (
                <div className="absolute top-2 left-2 flex space-x-1">
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              )}
            </div>
            {/* Removed below-the-card name/price; they now appear on hover over the card */}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductGridSection;
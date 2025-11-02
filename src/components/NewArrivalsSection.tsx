import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  href: string;
}

const newArrivalsProducts: Product[] = [
  {
    id: '1',
    name: 'Brown Kimono',
    price: '$120.00',
    imageUrl: 'https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY',
    href: '#',
  },
  {
    id: '2',
    name: 'Beige Pouch',
    price: '$45.00',
    imageUrl: 'https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY',
    href: '#',
  },
  {
    id: '3',
    name: 'Brown Dress',
    price: '$90.00',
    imageUrl: 'https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY',
    href: '#',
  },
  {
    id: '4',
    name: 'Gold Hoops',
    price: '$60.00',
    imageUrl: 'https://fastly.picsum.photos/id/628/2509/1673.jpg?hmac=TUdtbj7l4rQx5WGHuFiV_9ArjkAkt6w2Zx8zz-aFwwY',
    href: '#',
  },
];

const NewArrivalsSection: React.FC = () => {
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 text-accent">NEW IN</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newArrivalsProducts.map((product) => (
          <Link href={product.href} key={product.id} className="group block">
            <div className="relative w-full h-[350px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
'use client';

import { StarFilled } from '@ant-design/icons';
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    name: "Converse 70’s - Black",
    image: "/products/converse-black.jpeg",
    price: 1770000,
    rating: 4.5,
    discount: 0,
  },
  {
    id: 2,
    name: "New Balance 993 - Grey",
    image: "/products/nb-990.jpeg",
    price: 795000,
    discount: 20,
    rating: 3.5,
  },
  {
    id: 3,
    name: "Adidas Samba OG - White",
    image: "/products/samba-og.jpeg",
    price: 1750000,
    discount: 0,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Onitsuka Tiger Kyoto - Black",
    image: "/products/onitsuka-black.jpeg",
    price: 1570000,
    discount: 30,
    rating: 4.5,
  },
];

// Animation variants
const productVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number): any => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  }),
};

export default function FeaturedProducts() {
  return (
    <div className="bg-gray-100 pt-0 pb-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-sm relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
            variants={productVariants}
            whileHover={{ scale: 1.02 }}
          >
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-40 object-contain mb-4"
            />
            <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
            <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
              <StarFilled />
              <span className="text-gray-700">{product.rating}/5</span>
            </div>
            <div className="mt-2 text-base font-semibold text-gray-900">
              Rp.{' '}
              {(product.price * (1 - product.discount / 100)).toLocaleString('id-ID')}
              {product.discount > 0 && (
                <span className="text-gray-400 line-through text-sm ml-2 font-normal">
                  Rp. {product.price.toLocaleString('id-ID')}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tombol View All */}
      <div className="flex justify-center mt-10">
        <Link href="/shop">
          <Button type="default" className="rounded-full px-6">
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
}

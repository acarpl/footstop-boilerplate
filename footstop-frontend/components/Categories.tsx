'use client';

import { Card, Button } from 'antd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Data untuk kategori
const categoriesData = [
    {
    name: 'Snikers',
    image: '/images/categories/sneakers.png',
    alt: 'Kategori Sneakers',
  },
  {
    name: 'Formal',
    image: '/images/categories/formal.png',
    alt: 'Kategori Sepatu Formal',
  },
  {
    name: 'Apparels',
    image: '/images/categories/apparels.png',
    alt: 'Kategori Pakaian',
  },
  {
    name: 'Sporty',
    image: '/images/categories/sporty.png',
    alt: 'Kategori Sepatu Sporty',
  },
];

// Variants untuk animasi masuk (dengan perbaikan)
const cardVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  }),
} as const; // Menggunakan 'as const' untuk keamanan tipe dengan Framer Motion

export default function Categories() {
  return (
    <div className="bg-red-600 py-16 px-4 sm:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {categoriesData.map((category, index) => (
            <motion.div
              key={category.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
              className="rounded-2xl"
            >
              <Card
                hoverable
                className="bg-white rounded-2xl border-none shadow-md overflow-hidden"
                // Peringatan Ant Design menyarankan ini:
                styles={{ body: { padding: '1.5rem' } }} 
              >
                <h3 className="font-bold text-2xl mb-4 text-gray-800">{category.name}</h3>
                <div className="relative h-48 md:h-56 w-full">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tombol View All */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button
              ghost
              size="large"
              className="border-white text-white hover:bg-white hover:text-red-600 !rounded-lg !px-10 !font-semibold"
            >
              View All
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
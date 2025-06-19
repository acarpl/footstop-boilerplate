'use client';

import { Card, Button } from 'antd';
import Image from 'next/image';

// Data untuk kategori, agar lebih mudah dikelola
const categoriesData = [
  {
    name: 'Snikers',
    image: '/images/categories/sneakers.png', // Rekomendasi: Gunakan gambar dengan background transparan (PNG/WEBP)
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

export default function Categories() {
  return (
    <div className="bg-red-600 py-16 px-4 sm:px-8">
      <div className="max-w-screen-xl mx-auto">

        {/* Grid untuk Kategori */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {categoriesData.map((category) => (
            <Card
              key={category.name}
              hoverable
              className="bg-white rounded-2xl border-none shadow-md overflow-hidden"
              bodyStyle={{ padding: '1.5rem' }} // Memberi padding di dalam card
            >
              <h3 className="font-bold text-2xl mb-4 text-gray-800">{category.name}</h3>
              {/* Kontainer untuk gambar agar posisinya terkontrol */}
              <div className="relative h-48 md:h-56 w-full">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill // 'fill' akan mengisi div parent
                  className="object-contain" // 'object-contain' memastikan seluruh gambar terlihat
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Tombol View All */}
        <div className="text-center mt-12">
          <Button
            ghost // 'ghost' membuat background transparan, cocok untuk background berwarna
            size="large"
            className="border-white text-white hover:bg-white hover:text-red-600 !rounded-lg !px-10 !font-semibold"
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Select } from "antd";
import Footer from '#/components/Footer';
import Navbar from '#/components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const products = new Array(6).fill({
  name: "Converse 70's - Black",
  price: "Rp 1,770,000",
  rating: 4.5,
  image: "products/converse-black.png",
  slug: "converse-70s-black",
});

const categories = [
  "Sneakers", "Boots", "Loafers", "Sandals", "Formal", "Running",
  "Training", "Slip-on", "Hiking", "Football", "Basket", "Classic Series",
  "Sportswear", "Outerwear", "Accessories", "Colabs"
];

export default function ShopPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filter */}
          <aside className="bg-white rounded-lg shadow p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>
            <ul className="space-y-2 text-sm">
              {categories.map((cat, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input type="checkbox" id={cat} className="accent-red-500" />
                  <label htmlFor={cat}>{cat}</label>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="text-sm font-medium">Brands</label>
              <Select
                className="w-full mt-1"
                placeholder="Select Brandnya"
                options={categories.map(cat => ({ label: cat, value: cat }))}
              />
            </div>
          </aside>

          {/* Product Section */}
          <main className="md:col-span-3 space-y-6">
            {/* Swiper Carousel */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              loop
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation
              className="rounded-xl overflow-hidden shadow-lg h-[200px] sm:h-[250px] md:h-[300px]"
            >
              <SwiperSlide className="relative h-full">
                <Image src="/images/bestseller.jpg" alt="Best Seller" className="object-cover w-full h-full" />
                <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-xl shadow backdrop-blur-sm">
                  <h2 className="text-lg sm:text-2xl font-semibold">🔥 Best Seller</h2>
                </div>
              </SwiperSlide>
              <SwiperSlide className="relative h-full">
                <Image src="/images/newproduct.jpg" alt="New Arrival" className="object-cover w-full h-full" />
                <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-xl shadow backdrop-blur-sm">
                  <h2 className="text-lg sm:text-2xl font-semibold">🆕 New Arrivals</h2>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-red-600 text-center">Choose Your Own Style</h2>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/product/${product.slug}`)}
                  className="bg-white rounded-lg p-4 shadow-md text-center transform transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-700 hover:text-white cursor-pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-contain mb-4"
                  />
                  <h3 className="text-base font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-center items-center mb-2 text-yellow-400 text-sm">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        className="w-4 h-4"
                      />
                    ))}
                    <span className="ml-1 text-sm">{product.rating}/5</span>
                  </div>
                  <p className="text-red-500 font-bold">{product.price}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

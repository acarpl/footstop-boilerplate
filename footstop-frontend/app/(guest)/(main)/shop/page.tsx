'use client';

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Select } from "antd";
import Footer from '#/components/Footer';
import Navbar from '#/components/Navbar';

const products = new Array(6).fill({
  name: "Converse 70's - Black",
  price: "Rp 1,770,000",
  rating: 4.5,
  image: "products/converse-black.png",
  slug: "converse-70s-black", // digunakan untuk detail page
});

const categories = [
  "Sneakers", "Boots", "Loafers", "Sandals", "Formal", "Running",
  "Training", "Slip-on", "Hiking", "Football", "Basket", "Classic Series",
  "Sportswear", "Outerwear", "Accessories", "Colabs"
];

export default function ShopPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-200 min-h-screen py-6 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
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

          {/* Product Grid */}
          <main className="md:col-span-3 space-y-6">
            {/* Banner */}
            <div className="rounded-lg overflow-hidden">
              <img
                src="/banner.jpg"
                alt="Banner"
                className="w-full h-40 object-cover"
              />
              <h2 className="text-3xl font-bold text-center text-red-600 mt-4">
                Choose Your Own Style
              </h2>
            </div>

            {/* Produk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/product/${product.slug}`)}
                  className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition hover:scale-[1.03] cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-contain"
                  />
                  <div className="mt-4 space-y-1">
                    <h3 className="text-sm font-semibold">{product.name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          stroke="currentColor"
                          className="w-4 h-4"
                        />
                      ))}
                      <span className="ml-1 text-gray-600">{product.rating}/5</span>
                    </div>
                    <p className="text-red-600 font-bold">{product.price}</p>
                  </div>
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

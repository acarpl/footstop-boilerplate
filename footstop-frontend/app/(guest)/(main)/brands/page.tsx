"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox, Select, message, App } from "antd"; // Import App & message
import Image from "next/image"; // Gunakan Image dari Next.js untuk optimisasi

// Import service dan tipe data
import {
  getCategories,
  getBrands,
  type Category,
  type Brand,
} from "../../../../lib/services/productService"; // Sesuaikan path jika perlu

const BrandPageContent = () => {
  const [showBrands, setShowBrands] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const { message: messageApi } = App.useApp();

  // useEffect untuk mengambil semua data dari backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ambil data kategori dan merek secara bersamaan
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);

        // Tunda animasi setelah data berhasil dimuat
        setTimeout(() => setShowBrands(true), 100);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        messageApi.error("Could not load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [messageApi]); // Tambahkan dependensi yang stabil

  // Handler untuk filter (bisa Anda kembangkan nanti untuk memfilter produk berdasarkan merek/kategori)
  const handleCategoryChange = (id: number, checked: boolean) => {
    console.log(`Category ${id} ${checked ? "selected" : "unselected"}`);
    // Logika filter di sini
  };

  const handleBrandChange = (value: number) => {
    console.log(`Brand selected: ${value}`);
    // Logika filter di sini
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 mt-20">
      {/* Sidebar Categories */}
      <aside className="bg-white rounded-lg shadow p-4 md:h-fit md:col-span-1 w-full md:sticky md:top-28">
        <div className="md:block border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id_category} className="flex items-center space-x-2">
                <Checkbox
                  onChange={(e) =>
                    handleCategoryChange(cat.id_category, e.target.checked)
                  }
                >
                  {cat.category_name}
                </Checkbox>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="text-sm font-medium">Brands</label>
          <Select
            className="w-full mt-1"
            placeholder="Select Brand"
            onChange={handleBrandChange}
            options={brands.map((brand) => ({
              label: brand.brand_name,
              value: brand.id_brand,
            }))}
            allowClear
          />
        </div>
      </aside>

      {/* Brand Grid */}
      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? // Tampilkan placeholder loading
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-xl h-40 animate-pulse"
              ></div>
            ))
          : brands.map((brand, index) => (
              <motion.div
                key={brand.id_brand}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 120,
                }}
                className="bg-red-800 rounded-xl flex items-center justify-center h-40 cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Gunakan komponen Image dari Next.js */}
                <Image
                  src={brand.logo || "/placeholder.png"} // Tambahkan placeholder jika logo null
                  alt={brand.brand_name}
                  width={80} // Tentukan ukuran
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </motion.div>
            ))}
      </div>
    </div>
  );
};

// Bungkus dengan <App> untuk konteks message
export default function BrandPage() {
  return (
    <App>
      <BrandPageContent />
    </App>
  );
}

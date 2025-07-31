'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Checkbox, Spin, Empty, Pagination, Typography, message, App } from "antd";
import Image from 'next/image';
import type { TableProps } from 'antd'; // Meskipun tidak ada tabel, ini hanya untuk referensi tipe jika perlu

// Mengimpor dari service, sama seperti halaman admin
import {
  getProducts,
  getCategories,
  getBrands,
} from '../../../../lib/services/productService'; // Sesuaikan path
import { number } from 'framer-motion';

// Definisikan tipe data di sini juga untuk konsistensi
interface Image {
  id_gambar: number;
  url: string;
}
interface Brand {
  id_brand: number;
  brand_name: string;
}
interface Category {
  id_category: number;
  category_name: string;
}
interface Product {
  id_product: number;
  product_name: string;
  price: string;
  size: string;
  brand: Brand;
  category: Category;
  images: Image[];
}

const ShopPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message: messageApi } = App.useApp();

  // State Management - sama seperti halaman admin
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });

  // State untuk filter, diinisialisasi dari URL
  const [filters, setFilters] = useState({
  page: 1,
  limit: 9,
  idCategory: null as number | null,
  idBrand: null as number | null, // Update the type here
  search: searchParams?.get('search') || '',
});

  // useEffect untuk mengambil data produk, sama seperti halaman admin
  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null && value !== '')
    );

    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProducts(activeFilters);
        setProducts(productData.data);
        setPagination(prev => ({ ...prev, total: productData.total, current: productData.page, pageSize: productData.limit }));
      } catch (error) {
        console.error("ShopPage Error: Could not load products.", error);
        messageApi.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // useEffect untuk mengambil data sidebar, sama seperti halaman admin
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("ShopPage Error: Could not load sidebar data.", error);
      }
    };
    fetchSidebarData();
  }, []);

  // Handlers untuk filter, sama seperti halaman admin
  const handleBrandChange = (id_brand: number) => {
    setFilters(prev => ({ ...prev, idBrand: id_brand, page: 1 }));
  };
  const handleCategoryChange = (id_category: number, checked: boolean) => {
    setFilters(prev => ({ ...prev, idCategory: checked ? id_category : null, page: 1 }));
  };
  const handlePageChange = (page: number, pageSize: number) => {
    setFilters(prev => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id_category}>
                  <Checkbox onChange={(e) => handleCategoryChange(cat.id_category, e.target.checked)}>
                    {cat.category_name}
                  </Checkbox>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="text-sm font-medium">Brands</label>
              <Select
                className="w-full mt-1"
                placeholder="Select Brand"
                onChange={handleBrandChange}
                options={brands.map(brand => ({ label: brand.brand_name, value: brand.id_brand }))}
                allowClear
              />
            </div>
          </aside>

          {/* Produk */}
          <main className="md:col-span-3 space-y-6">
            <Typography.Title level={2} className="text-center">
              {filters.search ? `Results for "${filters.search}"` : "Choose Your Own Style"}
            </Typography.Title>

            {loading ? (
              <div className="text-center p-10"><Spin size="large" /></div>
            ) : products.length === 0 ? (
              <Empty description="No products found." />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id_product}
                      onClick={() => router.push(`/product/${product.id_product}`)}
                      className="bg-white rounded-lg p-4 shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                    >
                      {/* --- LOGIKA RENDER GAMBAR, SAMA SEPERTI HALAMAN ADMIN --- */}
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.product_name}
                        width={200}
                        height={200}
                        className="w-full h-40 object-contain mb-4"
                      />
                      <h3 className="text-base font-semibold mb-2 h-12 overflow-hidden">{product.product_name}</h3>
                      <p className="text-red-500 font-bold">
                        Rp {parseInt(product.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};


// Bungkus dengan <App> agar message dari antd berfungsi tanpa error
export default function ShopPage() {
    return (
        <App>
            <ShopPageContent />
        </App>
    );
}
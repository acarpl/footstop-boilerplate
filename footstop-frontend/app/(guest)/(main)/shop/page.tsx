'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Select, Checkbox, Spin, Empty, Pagination } from "antd";
import Footer from '#/components/Footer';
import Navbar from '#/components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

import { getProducts, getCategories, getBrands } from '../../../../lib/services/productService';

const dummyProducts = [
  {
    id_product: "dummy-1",
    product_name: "Kaos Polos Hitam",
    price: 79000,
    gambar: [{ url: "/images/kaos-hitam.png" }],
  },
  {
    id_product: "dummy-2",
    product_name: "Jaket Hoodie Keren",
    price: 189000,
    gambar: [{ url: "/images/hoodie-keren.png" }],
  },
  {
    id_product: "dummy-3",
    product_name: "Celana Cargo Coklat",
    price: 149000,
    gambar: [{ url: "/images/cargo-coklat.png" }],
  },
];


export default function ShopPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    id_category: null,
    id_brand: null,
  });

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // Load kategori dan brand
      if (categories.length === 0) {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      }
      if (brands.length === 0) {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands);
      }

      // Coba ambil produk dari backend
      const productData = await getProducts(filters);

      if (!productData || !productData.data || productData.data.length === 0) {
        throw new Error("Produk kosong atau null dari backend");
      }

      setProducts(productData.data);
      setTotalProducts(productData.total);
    } catch (err) {
      console.error("Fallback to dummy:", err);
      setProducts(dummyProducts);
      setTotalProducts(dummyProducts.length);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [filters]);

  const handleBrandChange = (id_brand: any) => {
    setFilters(prev => ({ ...prev, id_brand, page: 1 }));
  };

  const handleCategoryChange = (id_category: any, checked: boolean) => {
    setFilters(prev => ({ ...prev, id_category: checked ? id_category : null, page: 1 }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters(prev => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
              < Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/*Ini Peringatan Dummy : Frontend Offline no Backend*/}
                      {products[0]?.id_product?.startsWith('dummy') && (
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center text-sm">
                  Menampilkan data dummy karena server tidak merespons.
                </div>
              )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id_category} className="flex items-center space-x-2">
                  <Checkbox
                    onChange={(e) => handleCategoryChange(cat.id_category, e.target.checked)}
                  >
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
                options={brands.map(brand => ({
                  label: brand.brand_name,
                  value: brand.id_brand
                }))}
                allowClear
              />
            </div>
          </aside>

          {/* Produk */}
                <main className="md:col-span-3 space-y-6">
                  <h2 className="text-3xl font-bold text-red-600 text-center">Choose Your Own Style</h2>

                  {products[0]?.id_product?.startsWith('dummy') && (
                    <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center text-sm">
                      Menampilkan data dummy karena server tidak merespons.
                    </div>
                  )}
                            {/*ini gua ganti*/}
                  {loading ? (
                    <div className="text-center p-10">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      {/* Jika produk kosong dan bukan dummy */}
                      {products.length === 0 && !products[0]?.id_product?.startsWith('dummy') ? (
                        <Empty description="No products found matching your criteria." />
                      ) : (
                        <>
                          {products[0]?.id_product?.startsWith('dummy') && (
                            <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center text-sm">
                              Menampilkan data dummy karena server tidak merespons.
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {products.map((product) => (
                              <div
                                key={product.id_product}
                                onClick={() => router.push(`/product/${product.id_product}`)}
                                className="bg-white rounded-lg p-4 shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                              >
                                <Image
                                  src={product.gambar?.[0]?.url || "/placeholder.png"}
                                  alt={product.product_name}
                                  width={200}
                                  height={200}
                                  className="w-full h-40 object-contain mb-4"
                                />
                                <h3 className="text-base font-semibold mb-2 h-12">{product.product_name}</h3>
                                <p className="text-red-500 font-bold">
                                  Rp {parseInt(product.price).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-center mt-8">
                            <Pagination
                              current={filters.page}
                              pageSize={filters.limit}
                              total={totalProducts}
                              onChange={handlePageChange}
                              showSizeChanger
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  
                </main>

        </div>
        
      </div>
      < Footer />
    </div>
  );
}

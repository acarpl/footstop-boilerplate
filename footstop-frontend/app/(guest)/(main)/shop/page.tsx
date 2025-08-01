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
import { motion } from "framer-motion";
import Image from 'next/image';

import { getProducts, getCategories, getBrands, Product, Category, Brand } from '../../../../lib/services/productService';

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
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
        if (categories.length === 0) {
          const fetchedCategories = await getCategories();
          setCategories(fetchedCategories);
        }
        if (brands.length === 0) {
          const fetchedBrands = await getBrands();
          setBrands(fetchedBrands);
        }

        const productData = await getProducts(filters);
        setProducts(productData.data);
        setTotalProducts(productData.total);
      } catch (error) {
        console.error("Error loading shop data:", error);
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

  // Function to get the first image URL from product
  const getProductImageUrl = (product: Product): string => {
    // Check if product has images array and get first image
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    // Return placeholder if no image found
    return '/placeholder-image.jpg';
  };

return (
  <div className="bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4">
      {/* Wrapper layout responsif */}
      <div className="flex flex-col md:grid md:grid-cols-4 gap-6">
        
        {/* Sidebar / Filter - pindah ke atas di mobile */}
        {/* REVISI MOBILE SHOPEE STYLE */}
        <aside className="bg-white rounded-lg shadow p-4 md:h-fit md:col-span-1 w-full md:sticky md:top-4">
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

        {/* Products */}
        <main className="md:col-span-3 space-y-6">
          <h2 className="text-3xl font-bold text-red-600 text-center">
            Choose Your Own Style
          </h2>

          {loading ? (
            <div className="text-center p-10">
              <Spin size="large" />
            </div>
          ) : products.length === 0 ? (
            <Empty description="No products found matching your criteria." />
          ) : (
            <>
              {/* Grid 2 kolom di mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id_product}
                    onClick={() =>
                      router.push(`/product/${product.id_product}`)
                    }
                    className="bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden"
                  >
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-image.jpg";
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-base font-semibold mb-2 h-12 line-clamp-2">
                        {product.product_name}
                      </h3>
                      <p className="text-red-500 font-bold">
                        Rp {parseInt(product.price).toLocaleString()}
                      </p>
                      <div className="mt-2 text-sm text-gray-600">
                        {product.brand && (
                          <span className="block">{product.brand.brand_name}</span>
                        )}
                        {product.category && (
                          <span className="block text-xs text-gray-500">
                            {product.category.category_name}
                          </span>
                        )}
                      </div>
                    </div>
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
        </main>
      </div>
    </div>
    <Footer />
  </div>
);

}
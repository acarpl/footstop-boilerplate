'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Checkbox, Spin, Empty, Pagination, App } from "antd";
import Image from 'next/image';

import {
  getProducts,
  getCategories,
  getBrands,
  type Product,
  type Category,
  type Brand,
} from '../../../../lib/services/productService';

// Komponen konten utama
const ShopPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message: messageApi } = App.useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    idCategory: null as number | null,
    idBrand: null as number | null,
    search: searchParams?.get('search') || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const snakeCaseFilters = Object.fromEntries(
        Object.entries(filters)
          .filter(([_, val]) => val !== null && val !== '')
          .map(([key, val]) => {
            if (key === 'idCategory') return ['id_category', val];
            if (key === 'idBrand') return ['id_brand', val];
            return [key, val];
          })
      );

      try {
        const productData = await getProducts(snakeCaseFilters);
        setProducts(productData.data);
        setTotalProducts(productData.total);
      } catch (error) {
        console.error("ShopPage Error: Could not load products.", error);
        messageApi.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

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

  // Handlers
  const handleBrandChange = (idBrand: number | null) => {
    setFilters(prev => ({ ...prev, idBrand, page: 1 }));
  };

  const handleCategoryChange = (idCategory: number) => {
    setFilters(prev => ({
      ...prev,
      idCategory: prev.idCategory === idCategory ? null : idCategory,
      page: 1
    }));
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
                  <Checkbox
                    checked={filters.idCategory === cat.id_category}
                    onChange={() => handleCategoryChange(cat.id_category)}
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
                allowClear
                value={filters.idBrand ?? undefined}
                onChange={(value) => handleBrandChange(value ?? null)}
                options={brands.map(brand => ({
                  label: brand.brand_name,
                  value: brand.id_brand
                }))}
              />
            </div>
          </aside>

          {/* Produk */}
          <main className="md:col-span-3 space-y-6">
            <h2 className="text-3xl font-bold text-red-600 text-center">
              {filters.search ? `Results for "${filters.search}"` : "Choose Your Own Style"}
            </h2>

            {loading ? (
              <div className="text-center p-10">
                <Spin size="large" />
              </div>
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
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.product_name}
                        width={200}
                        height={200}
                        className="w-full h-40 object-contain mb-4"
                      />
                      <h3 className="text-base font-semibold mb-2 h-12 overflow-hidden">
                        {product.product_name}
                      </h3>
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
          </main>
        </div>
      </div>
    </div>
  );
};

// Bungkus dengan App untuk context `message`
export default function ShopPage() {
  return (
    <App>
      <ShopPageContent />
    </App>
  );
}

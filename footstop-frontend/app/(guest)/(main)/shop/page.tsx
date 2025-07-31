'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, Checkbox, Spin, Empty, Pagination, App } from 'antd';
import Image from 'next/image';

import {
  getProducts,
  getCategories,
  getBrands,
  type Product,
  type Category,
  type Brand,
} from '../../lib/services/productService'; // Sesuaikan path jika perlu

const { Option } = Select;

const ShopContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // State untuk filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  
  // State untuk paginasi
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // useEffect untuk mengambil data produk
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.current,
          limit: pagination.pageSize,
          idCategory: selectedCategory || undefined, // Kirim jika tidak null
          // Backend mungkin perlu di-update untuk menerima 'idBrand' sebagai array
          idBrand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined, 
        };

        const res = await getProducts(params);
        setProducts(res.data);
        setPagination(prev => ({ ...prev, total: res.total }));
      } catch (error) {
        messageApi.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, selectedBrands, pagination.current, pagination.pageSize]); // Dependensi

  // useEffect untuk mengambil data filter (kategori & merek)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catData, brandData] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        messageApi.error('Failed to load filter options');
      }
    };
    fetchInitialData();
  }, []);

  // Handlers
  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset ke halaman 1
  };

  const handleBrandChange = (checkedValues: number[]) => {
    setSelectedBrands(checkedValues);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset ke halaman 1
  };
  
  const handlePageChange = (page: number) => {
      setPagination(prev => ({...prev, current: page}));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select
          placeholder="Filter by Category"
          style={{ width: '100%', maxWidth: '250px' }}
          onChange={handleCategoryChange}
          allowClear
        >
          {categories.map((cat) => (
            // 1. GUNAKAN NAMA PROPERTI YANG BENAR
            <Option key={cat.id_category} value={cat.id_category}>
              {cat.category_name}
            </Option>
          ))}
        </Select>

        <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold">Brands:</span>
            <Checkbox.Group onChange={handleBrandChange}>
            {brands.map((brand) => (
                // 1. GUNAKAN NAMA PROPERTI YANG BENAR
                <Checkbox key={brand.id_brand} value={brand.id_brand}>
                {brand.brand_name}
                </Checkbox>
            ))}
            </Checkbox.Group>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="No products found" className="mt-20" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id_product} className="border p-2 rounded-md cursor-pointer hover:shadow-lg transition">
                <Image
                  // 2. AKSES URL GAMBAR DENGAN BENAR
                  src={product.images?.[0]?.url || '/placeholder.png'}
                  alt={product.product_name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-contain rounded"
                />
                <div className="mt-2 font-semibold truncate">{product.product_name}</div>
                <div className="text-sm text-gray-600">
                    {/* 3. PARSE HARGA SEBELUM FORMAT */}
                    Rp {parseInt(product.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

// Bungkus dengan <App> agar message berfungsi
export default function Shop() {
    return (
        <App>
            <ShopContent />
        </App>
    );
}
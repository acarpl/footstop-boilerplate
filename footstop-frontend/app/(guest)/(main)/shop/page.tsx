'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Select, Checkbox, Spin, Empty, Pagination, message } from 'antd';
import Image from 'next/image';

import {
  getProducts,
  getCategories,
  getBrands,
  type Product,
  type Category,
  type Brand,
} from '../../../../lib/services/productService';

const Shop = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

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
        message.error('Gagal memuat kategori atau brand');
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProducts({
          categoryId: selectedCategory ?? undefined,
          brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
          page,
          limit: 10,
        });
        setProducts(res.data);
        setTotal(res.total);
      } catch (error) {
        message.error('Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, selectedBrands, page]);

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleBrandChange = (checkedValues: any[]) => {
    setSelectedBrands(checkedValues);
    setPage(1);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Select
          placeholder="Pilih Kategori"
          style={{ width: 200 }}
          onChange={handleCategoryChange}
          allowClear
        >
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        <Checkbox.Group onChange={handleBrandChange}>
          {brands.map((brand) => (
            <Checkbox key={brand.id} value={brand.id}>
              {brand.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spin size="large" />
        ) : products.length === 0 ? (
          <Empty description="Produk tidak ditemukan" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-2 rounded-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover rounded"
                />
                <div className="mt-2 font-semibold">{product.name}</div>
                <div className="text-sm text-gray-600">Rp {product.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Pagination
          current={page}
          total={total}
          pageSize={10}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default Shop;

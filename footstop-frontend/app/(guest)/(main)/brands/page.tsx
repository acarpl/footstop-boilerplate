"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox, Select, message, App, Card, Empty, Spin } from "antd";
import Image from "next/image";

// Import service and types
import {
  getCategories,
  getBrands,
  type Category,
  type Brand,
} from "../../../../lib/services/productService";

const BrandPageContent = () => {
  const [showBrands, setShowBrands] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { message: messageApi } = App.useApp();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
        setFilteredBrands(fetchedBrands);
        setTimeout(() => setShowBrands(true), 100);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        messageApi.error("Could not load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [messageApi]);

  useEffect(() => {
    // Apply filters whenever selectedCategories or selectedBrand changes
    let result = [...brands];

    if (selectedCategories.length > 0) {
      result = result.filter((brand) =>
        brand.categories?.some((cat) =>
          selectedCategories.includes(cat.id_category)
        )
      );
    }

    if (selectedBrand) {
      result = result.filter((brand) => brand.id_brand === selectedBrand);
    }

    setFilteredBrands(result);
  }, [selectedCategories, selectedBrand, brands]);

  const handleCategoryChange = (id: number, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((catId) => catId !== id)
    );
  };

  const handleBrandSelectChange = (value: number | null) => {
    setSelectedBrand(value);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrand(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 mt-20">
      {/* Sidebar Filters */}
      <aside className="bg-white rounded-lg shadow p-4 md:h-fit md:col-span-1 w-full md:sticky md:top-28">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          {(selectedCategories.length > 0 || selectedBrand) && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Reset all
            </button>
          )}
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="font-medium mb-2">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id_category} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedCategories.includes(cat.id_category)}
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

        <div className="mb-4">
          <h3 className="font-medium mb-1">Brands</h3>
          <Select
            className="w-full"
            placeholder="Filter by brand"
            onChange={handleBrandSelectChange}
            value={selectedBrand}
            options={brands.map((brand) => ({
              label: brand.brand_name,
              value: brand.id_brand,
            }))}
            allowClear
          />
        </div>

        <div className="text-xs text-gray-500">
          Showing {filteredBrands.length} of {brands.length} brands
        </div>
      </aside>

      {/* Brand Grid */}
      <div className="md:col-span-3">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : filteredBrands.length === 0 ? (
          <Card className="flex justify-center items-center h-64">
            <Empty
              description={
                <span className="text-gray-500">
                  No brands match your filters
                </span>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id_brand}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.05 * index,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  hoverable
                  className="h-full flex flex-col items-center justify-center p-4"
                  cover={
                    <div className="p-4 flex items-center justify-center h-32">
                      <Image
                        src={brand.logo || "/placeholder-brand.png"}
                        alt={brand.brand_name}
                        width={120}
                        height={80}
                        className="object-contain max-h-full"
                        style={{ width: "auto", height: "auto" }}
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={brand.brand_name}
                    description={
                      <div className="text-center">
                        {brand.categories
                          ?.slice(0, 2)
                          .map((c) => c.category_name)
                          .join(", ")}
                        {brand.categories &&
                          brand.categories.length > 2 &&
                          "..."}
                      </div>
                    }
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function BrandPage() {
  return (
    <App>
      <BrandPageContent />
    </App>
  );
}

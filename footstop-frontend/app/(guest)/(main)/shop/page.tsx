"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, X } from "lucide-react";
import { Select, Checkbox, Spin, Empty, Pagination, Input } from "antd";
import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";
import { Swiper, SwiperSlide } from "swiper/src/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  getProducts,
  getCategories,
  getBrands,
  Product,
  Category,
  Brand,
} from "../../../../lib/services/productService";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Get search query from URL
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    id_category: null,
    id_brand: null,
    search: searchQuery, // Add search to filters
  });

  // Update filters when URL search params change
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search") || "";
    setFilters((prev) => ({
      ...prev,
      search: urlSearchQuery,
      page: 1, // Reset to first page when search changes
    }));
  }, [searchParams]);

  // Filter products based on search query
  useEffect(() => {
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase().trim();
      const filtered = products.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchTerm) ||
          product.brand?.brand_name.toLowerCase().includes(searchTerm) ||
          product.category?.category_name.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
      setTotalProducts(filtered.length);
    } else {
      setFilteredProducts(products);
      setTotalProducts(products.length);
    }
  }, [products, filters.search]);

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

        // Don't pass search to backend, we'll filter on frontend
        const backendFilters = {
          ...filters,
          search: "", // Remove search from backend query
        };

        const productData = await getProducts(backendFilters);
        setProducts(productData.data);
        // Don't set totalProducts here - will be set in the filter effect
      } catch (error) {
        console.error("Error loading shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.page, filters.limit, filters.id_category, filters.id_brand]); // Remove filters.search from dependency

  const handleBrandChange = (id_brand: any) => {
    setFilters((prev) => ({ ...prev, id_brand, page: 1 }));
  };

  const handleCategoryChange = (id_category: any, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      id_category: checked ? id_category : null,
      page: 1,
    }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  // Clear search functionality
  const clearSearch = () => {
    router.push("/shop");
    setFilters((prev) => ({ ...prev, search: "", page: 1 }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push("/shop");
    setFilters({
      page: 1,
      limit: 9,
      id_category: null,
      id_brand: null,
      search: "",
    });
  };

  // Function to get the first image URL from product
  const getProductImageUrl = (product: Product): string => {
    // Check if product has images array and get first image
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    // Return placeholder if no image found
    return "/placeholder-image.jpg";
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search || filters.id_category || filters.id_brand;

  // Paginate filtered products for display
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="bg-gray-100 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4">
        {/* Search Results Header */}
        {filters.search && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-medium">Search results for:</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                  "{filters.search}"
                </span>
                <span className="text-gray-600">
                  ({totalProducts} products found)
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <X size={16} />
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Wrapper layout responsif */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-6">
          {/* Sidebar / Filter - pindah ke atas di mobile */}
          <aside className="bg-white rounded-lg shadow p-4 md:h-fit md:col-span-1 w-full md:sticky md:top-4">
            {/* Filter Header with Clear All */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div className="md:block border-b pb-4 mb-4">
              <h3 className="text-md font-medium mb-2">Categories</h3>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li
                    key={cat.id_category}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={filters.id_category === cat.id_category}
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

            {/* Brands Filter */}
            <div>
              <label className="text-md font-medium block mb-2">Brands</label>
              <Select
                className="w-full"
                placeholder="Select Brand"
                value={filters.id_brand}
                onChange={handleBrandChange}
                options={brands.map((brand) => ({
                  label: brand.brand_name,
                  value: brand.id_brand,
                }))}
                allowClear
              />
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
                <div className="space-y-1 text-xs">
                  {filters.search && (
                    <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
                      <span>Search: {filters.search}</span>
                      <button onClick={clearSearch} className="text-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {filters.id_category && (
                    <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
                      <span>
                        Category:{" "}
                        {
                          categories.find(
                            (c) => c.id_category === filters.id_category
                          )?.category_name
                        }
                      </span>
                      <button
                        onClick={() =>
                          handleCategoryChange(filters.id_category, false)
                        }
                        className="text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {filters.id_brand && (
                    <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
                      <span>
                        Brand:{" "}
                        {
                          brands.find((b) => b.id_brand === filters.id_brand)
                            ?.brand_name
                        }
                      </span>
                      <button
                        onClick={() => handleBrandChange(null)}
                        className="text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Products */}
          <main className="md:col-span-3 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600">
                {filters.search ? `Search Results` : "Choose Your Own Style"}
              </h2>
              {!filters.search && (
                <p className="text-gray-600 mt-2">
                  Discover our amazing collection of shoes
                </p>
              )}
            </div>

            {loading ? (
              <div className="text-center p-10">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center p-10">
                <Empty
                  description={
                    filters.search
                      ? `No products found for "${filters.search}". Try different keywords or browse our categories.`
                      : "No products found matching your criteria."
                  }
                />
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    View All Products
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Showing {startIndex + 1} -{" "}
                    {Math.min(endIndex, totalProducts)} of {totalProducts}{" "}
                    products
                  </span>
                  <span>
                    Page {filters.page} of{" "}
                    {Math.ceil(totalProducts / filters.limit)}
                  </span>
                </div>

                {/* Grid 2 kolom di mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product.id_product}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
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
                        {/* Badge for search match */}
                        {filters.search && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-md">
                            Match
                          </div>
                        )}
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
                            <span className="block">
                              {product.brand.brand_name}
                            </span>
                          )}
                          {product.category && (
                            <span className="block text-xs text-gray-500">
                              {product.category.category_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={filters.page}
                    pageSize={filters.limit}
                    total={totalProducts}
                    onChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`
                    }
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

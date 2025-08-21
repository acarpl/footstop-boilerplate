"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Drawer, Spin, Empty, Rate, message, Carousel, Skeleton } from "antd";
import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import { getProducts, Product } from "../../../../lib/services/productService";

// Types
interface ProductImage {
  url: string;
}

interface ExtendedProduct extends Product {
  images?: ProductImage[];
  rating?: number;
  created_at: string;
}

export default function NewArrivalPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ExtendedProduct | null>(null);

  // Fetch products with error handling
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProducts({ page: 1, limit: 12 });

      // Ensure response has the expected structure
      const productsData = response?.data || response || [];

      if (Array.isArray(productsData)) {
        const sortedProducts = [...productsData].sort(
          (a, b) =>
            new Date(b.created_at || new Date()).getTime() -
            new Date(a.created_at || new Date()).getTime()
        );
        setProducts(sortedProducts);
      } else {
        console.warn("Unexpected products data structure:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      message.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get product image URL with fallback
  const getProductImageUrl = useCallback((product: ExtendedProduct): string => {
    try {
      if (
        product?.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        return product.images[0]?.url || "/placeholder-image.jpg";
      }
      return "/placeholder-image.jpg";
    } catch (error) {
      console.error("Error getting product image URL:", error);
      return "/placeholder-image.jpg";
    }
  }, []);

  // Drawer handlers
  const openDrawer = useCallback((product: ExtendedProduct) => {
    setSelectedProduct(product);
    setIsDrawerVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerVisible(false);
    setSelectedProduct(null);
  }, []);

  // Add to cart handler
  const handleAddToCart = useCallback((product: ExtendedProduct) => {
    try {
      message.success(`${product?.product_name || "Product"} added to cart!`);
      // Add actual cart logic here
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add product to cart");
    }
  }, []);

  // Sort handler
  const handleSort = useCallback(
    (value: string) => {
      try {
        let sortedProducts = [...products];

        switch (value) {
          case "price_low":
            sortedProducts.sort((a, b) => {
              const priceA = parseInt(a.price?.toString() || "0");
              const priceB = parseInt(b.price?.toString() || "0");
              return priceA - priceB;
            });
            break;
          case "price_high":
            sortedProducts.sort((a, b) => {
              const priceA = parseInt(a.price?.toString() || "0");
              const priceB = parseInt(b.price?.toString() || "0");
              return priceB - priceA;
            });
            break;
          default:
            sortedProducts.sort(
              (a, b) =>
                new Date(b.created_at || new Date()).getTime() -
                new Date(a.created_at || new Date()).getTime()
            );
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error sorting products:", error);
        message.error("Failed to sort products");
      }
    },
    [products]
  );

  // Navigate to product detail
  const handleViewDetail = useCallback(
    (productId: string | number) => {
      try {
        router.push(`/product/${productId}`);
      } catch (error) {
        console.error("Error navigating to product detail:", error);
        message.error("Failed to navigate to product detail");
      }
    },
    [router]
  );

  // Image error handler
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = "/placeholder-image.jpg";
    },
    []
  );

  // Format price
  const formatPrice = useCallback((price: string | number): string => {
    try {
      const numPrice = typeof price === "string" ? parseInt(price) : price;
      return isNaN(numPrice) ? "0" : numPrice.toLocaleString();
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0";
    }
  }, []);

  return (
    <main className="bg-gray-100">
      <Navbar />

      {/* Carousel Banner */}
      <div className="relative w-full h-64 mb-8">
        <Carousel autoplay>
          <div className="relative w-full h-64">
            <Image
              src="/banners/Carousel-Product.svg"
              alt="New Arrivals Banner 1"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Carousel>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header & Sorting */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-red-600 font-bold text-3xl mb-4 md:mb-0">
            New Arrival
          </h2>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Sort by:</span>
            <select
              className="border rounded-md p-2 bg-white"
              onChange={(e) => handleSort(e.target.value)}
              defaultValue="newest"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <Skeleton.Image className="w-full h-48 mb-4" />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <Empty
              description="No new arrivals found."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={`product-${product.id_product}`}
                className="relative bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden group"
              >
                {/* New Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  New
                </div>

                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={getProductImageUrl(product)}
                    alt={product.product_name || "Product"}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />

                  {/* Quick View Overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => openDrawer(product)}
                  >
                    <button
                      className="bg-white text-red-500 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 text-center">
                  <h3 className="text-base font-semibold mb-2 h-12 line-clamp-2">
                    {product.product_name || "Unnamed Product"}
                  </h3>
                  <Rate
                    disabled
                    value={product.rating || 4}
                    className="flex justify-center mb-2"
                  />
                  <p className="text-red-500 font-bold mb-2">
                    Rp {formatPrice(product.price)}
                  </p>
                  <button
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    type="button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Drawer */}
      <Drawer
        title={selectedProduct?.product_name || "Product Details"}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={400}
        destroyOnClose
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="relative w-full h-60 rounded-md overflow-hidden">
              <Image
                src={getProductImageUrl(selectedProduct)}
                alt={selectedProduct.product_name || "Product"}
                fill
                className="object-cover"
                onError={handleImageError}
              />
            </div>

            <Rate
              disabled
              value={selectedProduct.rating || 4}
              className="block"
            />

            <p className="text-red-500 font-bold text-lg">
              Rp {formatPrice(selectedProduct.price)}
            </p>

            <div className="space-y-2">
              <button
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                onClick={() => handleViewDetail(selectedProduct.id_product)}
                type="button"
              >
                View Detail
              </button>

              <button
                className="w-full bg-gray-200 text-black py-2 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => handleAddToCart(selectedProduct)}
                type="button"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Footer />
    </main>
  );
}

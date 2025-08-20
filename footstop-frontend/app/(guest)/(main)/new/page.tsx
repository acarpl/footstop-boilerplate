"use client";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, Spin, Empty, Rate, message, Carousel, Skeleton } from "antd";
import {
  getProducts,
  Product,
} from "../../../../lib/services/productService";

export default function NewArrivalPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ page: 1, limit: 12 });
        const sorted = [...data.data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        setProducts(sorted);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductImageUrl = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "/placeholder-image.jpg";
  };

  const openDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product) => {
    message.success(`${product.product_name} added to cart!`);
  };

  const handleSort = (value: string) => {
    let sortedProducts = [...products];
    if (value === "price_low") {
      sortedProducts.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (value === "price_high") {
      sortedProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    } else {
      sortedProducts.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    setProducts(sortedProducts);
  };

  return (
    <main className="bg-gray-100">
      <Navbar />

      {/* Carousel Banner */}
      <div className="relative w-full h-64 mb-8">
        <Carousel autoplay>
          <div className="relative w-full h-64">
            <Image
              src="/banners/new-arrivals-banner1.jpg"
              alt="Banner 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-64">
            <Image
              src="/banners/new-arrivals-banner2.jpg"
              alt="Banner 2"
              fill
              className="object-cover"
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
              className="border rounded-md p-2"
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <Skeleton key={idx} active />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Empty description="No new arrivals found." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id_product}
                className="relative bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden group"
              >
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  New
                </div>

                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={getProductImageUrl(product)}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                    loading="lazy"
                  />

                  {/* Quick View Overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => openDrawer(product)}
                  >
                    <button className="bg-white text-red-500 px-4 py-2 rounded-md font-semibold">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 text-center">
                  <h3 className="text-base font-semibold mb-2 h-12 line-clamp-2">
                    {product.product_name}
                  </h3>
                  <Rate
                    disabled
                    defaultValue={product.rating || 4}
                    className="flex justify-center mb-2"
                  />
                  <p className="text-red-500 font-bold">
                    Rp {parseInt(product.price).toLocaleString()}
                  </p>
                  <button
                    className="w-full mt-2 bg-red-500 text-white py-1 rounded-md hover:bg-red-600"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <Drawer
        title={selectedProduct?.product_name}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={400}
      >
        {selectedProduct && (
          <div>
            <Image
              src={getProductImageUrl(selectedProduct)}
              alt={selectedProduct.product_name}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <Rate
              disabled
              defaultValue={selectedProduct.rating || 4}
              className="mb-4"
            />
            <p className="text-red-500 font-bold mb-4">
              Rp {parseInt(selectedProduct.price).toLocaleString()}
            </p>
            <button
              className="w-full bg-red-500 text-white py-2 rounded-md mb-2 hover:bg-red-600"
              onClick={() =>
                router.push(`/product/${selectedProduct.id_product}`)
              }
            >
              View Detail
            </button>
            <button
              className="w-full bg-gray-200 text-black py-2 rounded-md hover:bg-gray-300"
              onClick={() => handleAddToCart(selectedProduct)}
            >
              Add to Cart
            </button>
          </div>
        )}
      </Drawer>

      <Footer />
    </main>
  );
}

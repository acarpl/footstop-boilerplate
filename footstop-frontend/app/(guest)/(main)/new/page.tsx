"use client";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, Spin, Empty, Rate } from "antd";
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

  // Ambil data produk terbaru
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ page: 1, limit: 12 }); // ambil 12 produk
        // urutkan berdasarkan tanggal terbaru
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

  return (
    <main className="bg-gray-100">
      <Navbar />

      {/* Banner */}
      <div className="relative w-full h-64">
        <Image
          src="/banners/new-arrivals-banner.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />
        <h1 className="absolute bottom-6 left-6 text-white text-4xl font-bold">
          New Arrival.
        </h1>
      </div>

      {/* Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-red-600 font-bold text-3xl mb-4 md:mb-0">
            New <br /> Arrival.
          </div>
          <Image
            src="/banners/new-left.jpg"
            alt="Side"
            width={200}
            height={250}
            className="md:mx-4"
          />
          <div className="text-red-600 font-bold text-3xl mt-4 md:mt-0">
            New <br /> Arrival.
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center p-10">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="No new arrivals found." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id_product}
                onClick={() => openDrawer(product)}
                className="bg-white rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden"
              >
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
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-base font-semibold mb-2 h-12 line-clamp-2">
                    {product.product_name}
                  </h3>
                  <p className="text-red-500 font-bold">
                    Rp {parseInt(product.price).toLocaleString()}
                  </p>
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
            <button
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
              onClick={() =>
                router.push(`/product/${selectedProduct.id_product}`)
              }
            >
              View Detail
            </button>
          </div>
        )}
      </Drawer>

      <Footer />
    </main>
  );
}

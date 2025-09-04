"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, Empty, Button, App, message } from "antd";
import {
  getProductById,
  type Product,
} from "../../../../../lib/services/productService";
import { addItemToCart } from "../../../../../lib/services/cartService";
import { useAuth } from "../../../../../context/AuthContext";
import { Tabs } from "antd";
import {
  CommentOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

// Import komponen UI Anda
import ProductGallery from "#/components/product/ProductGallery";
import ProductInfo from "#/components/product/ProductInfo";
import ReviewList from "#/components/product/ReviewList";
import FAQList from "#/components/product/FAQList";
import FeaturedProducts from "#/components/FeaturedProducts";

const ProductDetailPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const { message: messageApi } = App.useApp();

  // Ambil status user dari context
  const { user } = useAuth();

  // Pastikan id param aman dipakai
  const idParam = params?.id;
  const productId = Array.isArray(idParam) ? idParam[0] : idParam;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleAddToCart = async () => {
    // 1. Cek apakah user sudah login menggunakan data dari context
    if (!user) {
      messageApi.error("Please log in to add items to your cart.");
      // Arahkan ke halaman login
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      messageApi.warning("Please select a size first!");
      return;
    }

    try {
      // 2. Gunakan fungsi dari cartService
      await addItemToCart({
        id_product: product!.id_product,
        size: selectedSize,
        quantity,
      });
      messageApi.success(
        `${product!.product_name} has been added to your cart!`
      );
    } catch (err) {
      console.error("Failed to add to cart:", err);
      messageApi.error("Failed to add item to cart.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Empty description="Product not found." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={product.images || []} />
        <ProductInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onAddToCart={handleAddToCart}
        />
      </div>
      <div className="mt-10 mb-10">
        <Tabs
          tabPosition="left"
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <span>
                  <InfoCircleOutlined /> Product Details
                </span>
              ),
              children: (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {product.product_name}
                  </h3>
                  <p>
                    {product.description ||
                      `Wah ${product.product_name} produk ini sangat bagus! Keren, nyaman dipakai, dan recommended deh!`}
                  </p>
                </div>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <CommentOutlined /> Reviews
                </span>
              ),
              children: (
                <ReviewList
                  reviews={
                    product.reviews?.length
                      ? product.reviews
                      : [
                          {
                            id: 1,
                            username: "Aldo",
                            comment: `Wah ${product.product_name} sangat nyaman dipakai!`,
                            rating: 5,
                          },
                          {
                            id: 2,
                            username: "Rina",
                            comment: `Rekomen banget ${product.product_name} ini!`,
                            rating: 4,
                          },
                        ]
                  }
                />
              ),
            },
            {
              key: "3",
              label: (
                <span>
                  <QuestionCircleOutlined /> FAQ
                </span>
              ),
              children: (
                <FAQList
                  faqs={
                    product.faqs?.length
                      ? product.faqs
                      : [
                          {
                            id: 1,
                            question: "Apakah produk ini asli?",
                            answer: "Tentu saja, 100% original.",
                          },
                          {
                            id: 2,
                            question: "Berapa lama garansi?",
                            answer: "Garansi resmi 1 tahun.",
                          },
                        ]
                  }
                />
              ),
            },
          ]}
        />
      </div>
      <FeaturedProducts />

      {/* Modal Login sudah tidak diperlukan di sini lagi */}
    </div>
  );
};

// Bungkus dengan <App> untuk konteks message Ant Design
export default function ProductDetailPage() {
  return (
    <App>
      <ProductDetailPageContent />
    </App>
  );
}

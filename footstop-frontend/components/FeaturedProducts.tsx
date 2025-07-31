'use client';

import { StarFilled } from '@ant-design/icons';
import { Button, Spin, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getProducts, Product } from '../lib/services/productService';

// Animation variants
const productVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number): any => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  }),
};

// Function to get the first image URL from product
const getProductImageUrl = (product: Product): string => {
  if (product.images && product.images.length > 0) {
    return product.images[0].url;
  }
  return '/placeholder-image.jpg';
};

// Function to generate random rating (since backend doesn't have rating)
const generateRating = (productId: number): number => {
  // Use product ID as seed for consistent ratings
  const ratings = [3.5, 4.0, 4.5, 5.0, 3.8, 4.2, 4.7];
  return ratings[productId % ratings.length];
};

// Function to generate random discount (optional)
const generateDiscount = (productId: number): number => {
  // Use product ID as seed for consistent discounts
  const discounts = [0, 0, 10, 15, 20, 0, 25, 30, 0, 0]; // Most products have no discount
  return discounts[productId % discounts.length];
};

export default function FeaturedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        // Fetch first 8 products for featured section
        const productData = await getProducts({
          page: 1,
          limit: 8,
          // You can add more filters here if needed
          // featured: true, // if your backend supports featured flag
        });
        
        setProducts(productData.data || []);
      } catch (error) {
        console.error("Error loading featured products:", error);
        message.error('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 pt-0 pb-12">
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pt-0 pb-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600">Discover our most popular items</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const discount = generateDiscount(product.id_product);
            const rating = generateRating(product.id_product);
            const originalPrice = parseInt(product.price);
            const discountedPrice = originalPrice * (1 - discount / 100);

            return (
              <motion.div
                key={product.id_product}
                className="bg-white p-4 rounded-lg shadow-sm relative cursor-pointer hover:shadow-md transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
                variants={productVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleProductClick(product.id_product)}
              >
                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full z-10">
                    -{discount}%
                  </span>
                )}

                {/* Product Image */}
                <div className="relative w-full h-40 mb-4 bg-gray-50 rounded overflow-hidden">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10">
                    {product.product_name}
                  </h3>

                  {/* Brand and Category */}
                  <div className="text-xs text-gray-500">
                    {product.brand?.brand_name} • {product.category?.category_name}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <StarFilled />
                    <span className="text-gray-700">{rating}/5</span>
                  </div>

                  {/* Price */}
                  <div className="text-base font-semibold text-gray-900">
                    Rp {Math.floor(discountedPrice).toLocaleString('id-ID')}
                    {discount > 0 && (
                      <span className="text-gray-400 line-through text-sm ml-2 font-normal">
                        Rp {originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  {/* Available Sizes (if any) */}
                  {product.size && (
                    <div className="text-xs text-gray-500">
                      Sizes: {product.size}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link href="/shop">
              <Button type="default" className="rounded-full px-6 hover:bg-gray-50">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
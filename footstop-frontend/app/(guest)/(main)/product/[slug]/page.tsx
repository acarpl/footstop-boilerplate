'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Empty, Button, Typography, App, message } from 'antd';
import { Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

import { getProductById, type Product } from '../../../../../lib/services/productService'; // Sesuaikan path
import { addItemToCart } from '../../../../../lib/services/cartService'; // Untuk tombol Add to Cart

const ProductDetailPageContent = ({ id }: { id: string }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { message: messageApi } = App.useApp();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product details:", error);
        setProduct(null); // Set ke null jika produk tidak ditemukan (404)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      messageApi.warning('Please select a size first!');
      return;
    }
    try {
      await addItemToCart({
        idProduct: product!.id_product,
        quantity: quantity,
        size: selectedSize,
      });
      messageApi.success(`${product!.product_name} has been added to your cart.`);
    } catch (error) {
      // Menangani kasus jika user belum login
      if (error.response?.status === 401) {
          messageApi.error('Please log in to add items to your cart.');
      } else {
          messageApi.error('Failed to add item to cart.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }

  if (!product) {
    return <div className="text-center py-20"><Empty description="Product not found." /></div>;
  }
  
  // Ubah string ukuran menjadi array
  const availableSizes = product.size ? product.size.split(',').map(s => s.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Galeri Gambar */}
      <div>
        <Image
          src={product.images?.[0]?.url || '/placeholder.png'}
          alt={product.product_name}
          width={500}
          height={500}
          className="w-full h-auto object-contain rounded-xl shadow-lg"
        />
        <div className="flex gap-4 mt-4">
          {product.images?.map((img) => (
            <Image
              key={img.id_gambar}
              src={img.url}
              alt="Product thumbnail"
              width={80}
              height={80}
              className="w-20 h-20 object-contain border rounded-md cursor-pointer hover:border-red-500"
            />
          ))}
        </div>
      </div>

      {/* Detail Produk */}
      <div>
        <Typography.Title level={1}>{product.product_name}</Typography.Title>
        <Typography.Text type="secondary">{product.brand.brand_name}</Typography.Text>
        
        {/* Harga */}
        <p className="text-red-600 text-3xl font-bold mt-4">
          Rp {parseInt(product.price).toLocaleString()}
        </p>

        {/* Deskripsi (placeholder, tambahkan di backend jika perlu) */}
        <p className="text-gray-700 mt-4">
          A classic silhouette with a modern twist. Designed for all-day comfort and style, making it a versatile addition to any wardrobe.
        </p>
        
        {/* Pilih Ukuran */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-2">Select Size</h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-md border text-sm transition ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white text-black hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Jumlah & Add to Cart */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg hover:bg-gray-100">−</button>
            <span className="px-5 py-2 font-semibold">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 text-lg hover:bg-gray-100">+</button>
          </div>
          <Button type="primary" size="large" icon={<ShoppingCart />} onClick={handleAddToCart} className="flex-1">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};


// Komponen Halaman utama yang membungkus dengan <App>
export default function ProductDetailPage({ params }: { params: { id: string } }) {
    return (
        <App>
            <ProductDetailPageContent id={params.id} />
        </App>
    );
}
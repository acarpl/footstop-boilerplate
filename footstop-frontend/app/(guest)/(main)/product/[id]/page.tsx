'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Modal, Input, Button, Spin } from 'antd';

import ProductGallery from '#/components/product/ProductGallery';
import ProductInfo from '#/components/product/ProductInfo';
import ReviewList from '#/components/product/ReviewList';
import FAQList from '#/components/product/FAQList';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Ambil token & data produk
  useEffect(() => {
    if (!id) {
      setError('ID produk tidak tersedia.');
      setLoading(false);
      return;
    }

    setUserToken(localStorage.getItem('access_token'));
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      const data = res.data;

      if (!data || !data.id_product) {
        throw new Error('Produk tidak ditemukan di backend.');
      }

      console.log('✅ Produk:', data);
      setProduct(data);
    } catch (err) {
      console.error('❌ Gagal ambil produk:', err);
      setError('Produk tidak ditemukan atau gagal dimuat.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!userToken) {
      setLoginModalVisible(true);
      return;
    }

    if (!selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu!");
      return;
    }

    try {
      await axios.post(
        '/api/cart',
        {
          product_id: product.id_product,
          size: selectedSize,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.success("Berhasil ditambahkan ke cart!");
    } catch (err) {
      console.error("❌ Gagal add to cart:", err);
      toast.error("Gagal menambahkan ke cart.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('access_token', token);
      setUserToken(token);
      setLoginModalVisible(false);
      toast.success("Login berhasil!");
    } catch (err) {
      toast.error("Login gagal! Periksa email atau password.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Memuat produk..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-red-600 text-lg font-semibold">
        {error || 'Produk tidak ditemukan.'}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Toaster />

      {/* Bagian Atas */}
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

      {/* Bagian Tab */}
      <div className="mt-10">
        <ReviewList reviews={product.reviews || []} />
        <FAQList faqs={product.faqs || []} />
      </div>

      {/* Modal Login */}
      <Modal
        open={isLoginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">FOOTSTOP</h2>
          <p className="text-lg font-semibold">Welcome Back!</p>
          <p className="text-sm text-gray-500 mb-4">Log in to your account</p>

          <Input
            placeholder="e.g. kamu@mail.com"
            className="mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            placeholder="Masukkan Password"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="primary"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleLogin}
          >
            Log in
          </Button>

          <p className="mt-4 text-sm">
            Belum punya akun?{' '}
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={() => router.push('/register')}
            >
              Register di sini
            </span>
          </p>
        </div>
      </Modal>
    </div>
  );
}

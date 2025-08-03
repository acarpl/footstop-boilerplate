"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

type Product = {
  name: string;
  price: string;
  rating: number;
  image: string;
  description: string;
  sizes: number[];
};

type ProductDetailProps = {
  slug: string;
};

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

//Route product ke keranjang dan pembayaran.
const router = useRouter();

const handleAddToCart = () => {
  if (!selectedSize) {
    alert("Pilih ukuran terlebih dahulu!");
    return;
  }

  const cartItem = {
    slug,
    name: product?.name,
    price: product?.price,
    image: product?.image,
    size: selectedSize,
    quantity,
  };

  const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const updatedCart = [...existingCart, cartItem];
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  alert("Produk ditambahkan ke keranjang!");
};

const handleBuyNow = () => {
  if (!selectedSize) {
    alert("Pilih ukuran terlebih dahulu!");
    return;
  }

  const checkoutItem = {
    slug,
    name: product?.name,
    price: product?.price,
    image: product?.image,
    size: selectedSize,
    quantity,
  };

  localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));
  router.push("/checkout");
};
//aaa
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Gagal fetch produk", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
  //aaa
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold">Produk tidak ditemukan</h1>
      </div>
    );
  }

    

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Gambar */}
      <div>
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-contain rounded-xl"
        />
        <div className="flex gap-4 mt-4">
          <Image
            src={product.image}
            alt="Thumbnail 1"
            className="w-20 h-20 object-contain border rounded-md"
          />
          <Image
            src={product.image}
            alt="Thumbnail 2"
            className="w-20 h-20 object-contain border rounded-md"
          />
        </div>
      </div>

      {/* Detail Produk */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-5 h-5"
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">
            {product.rating}/5
          </span>
        </div>

        {/* Harga */}
        <p className="text-red-600 text-2xl font-bold mt-4">
          {product.price}
        </p>

        {/* Deskripsi */}
        <p className="text-gray-700 text-sm mt-4">{product.description}</p>

        {/* Warna */}
        <div className="mt-6">
          <h4 className="font-medium text-sm text-gray-800 mb-1">Warna</h4>
          <div className="flex gap-2">
            <button className="w-6 h-6 bg-gray-600 rounded-full border-2 border-black" />
          </div>
        </div>

        {/* Pilih Ukuran */}
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-800 mb-1">Pilih Ukuran</h4>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: number) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 rounded-full border text-sm ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Jumlah & Add to Cart */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center border rounded overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 text-lg"
            >
              −
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 text-lg"
            >
              ＋
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
              Tambah ke Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

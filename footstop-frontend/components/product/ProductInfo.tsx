// file: components/product/ProductInfo.tsx
import React from 'react';

type Product = {
  product_name: string;
  price: number | string;
  size?: string | null;
  brand?: { brand_name: string };
  category?: { category_name: string };
};

type Props = {
  product: Product;
  quantity: number;
  setQuantity: (qty: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  onAddToCart: () => void;
};

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  onAddToCart,
}: Props) {
  // Kalau ukuran produk stringnya pakai koma pisah, bisa di-split
  const sizes = product.size ? product.size.split(',').map((s) => s.trim()) : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>

      <p className="text-2xl font-semibold text-red-600 mb-4">
        Rp {Number(product.price).toLocaleString('id-ID')}
      </p>

      <div className="mb-4">
        <strong>Brand:</strong> {product.brand?.brand_name || '-'}
        <br />
        <strong>Category:</strong> {product.category?.category_name || '-'}
      </div>

      {sizes.length > 0 && (
        <div className="mb-4">
          <strong>Available Sizes:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 border rounded ${
                  selectedSize === size ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <strong>Quantity:</strong>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20 ml-2"
        />
      </div>

      <button
        onClick={onAddToCart}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

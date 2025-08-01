'use client';

interface ProductInfoProps {
  product: any;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  onAddToCart: () => void;
}

export default function ProductInfo({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart,
}: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
      <p className="text-red-600 font-bold text-2xl mb-4">
        Rp {parseInt(product.price).toLocaleString()}
      </p>
      <p className="text-gray-700 mb-6">{product.description}</p>

      <div className="mb-4">
        <p className="font-medium mb-1">Pilih Ukuran:</p>
        <div className="flex gap-2">
          {['42', '43', '44', '45'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border rounded-full w-10 h-10 flex items-center justify-center ${
                selectedSize === size
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-1 border rounded"
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-1 border rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={onAddToCart}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  );
}

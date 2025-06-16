"use client";
import Image from "next/image";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className="object-contain mx-auto"
      />
      <h2 className="mt-4 font-semibold text-sm">{product.name}</h2>
      <p className="text-sm text-gray-500">⭐⭐⭐⭐☆ 4.6/5</p>
      <p className="font-bold mt-1">{product.price}</p>
    </div>
  );
}

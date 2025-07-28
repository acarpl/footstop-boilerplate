'use client';
import { useEffect, useState } from 'react';
import ProductCard from '#/components/product/ProductCard';
import { getProducts } from '../../../../../lib/services/productService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProducts(data.data || []);
    };
    load();
  }, []);

  const recent = products.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Produk Terbaru */}
      <aside className="bg-white shadow p-4 rounded-lg h-fit">
        <h3 className="font-semibold mb-4">Produk Terbaru</h3>
        <ul className="text-sm space-y-2">
          {recent.map(prod => (
            <li key={prod.id_product}>{prod.product_name}</li>
          ))}
        </ul>
      </aside>

      {/* Card Produk */}
      <section className="md:col-span-3 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Semua Produk</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id_product} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

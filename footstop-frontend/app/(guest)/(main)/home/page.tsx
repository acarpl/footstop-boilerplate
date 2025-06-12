"use client";

import Navbar from "#/components/Navbar";
import Hero from "#/components/Hero";
import FeaturedProducts from "#/components/FeaturedProducts";
import Categories from "#/components/Categories";
import Footer from "#/components/Footer";
import { Button } from "antd";
import { ShoppingCart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Gunakan Navbar modular */}
      <Navbar />

      {/* Hero section */}
      <Hero />

      {/* Tombol Cart dari ant design */}
      <div className="flex justify-end p-4">
        <Button type="primary" icon={<ShoppingCart />}>
          Cart
        </Button>
      </div>

      {/* Produk unggulan */}
      <section className="py-12 px-6">
        <FeaturedProducts />
      </section>

      {/* Kategori */}
      <section className="py-12 px-6 bg-red-600 text-white">
        <Categories />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

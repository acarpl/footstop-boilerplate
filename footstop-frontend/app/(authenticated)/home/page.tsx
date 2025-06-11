"use client";

import Navbar from "#/components/Navbar";
import Hero from "#/components/Hero";
import FeaturedProducts from "#/components/FeaturedProducts";
import Categories from "#/components/Categories";
import Footer from "#/components/Footer";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      <Hero />
      <section className="py-12 px-6">
        <FeaturedProducts />
      </section>
      <section className="py-12 px-6 bg-red-600 text-white">
        <Categories />
      </section>
      <Footer />
    </main>
  );
}



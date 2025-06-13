"use client";

import Hero from '#/components/Hero'
import FeaturedProducts from '#/components/FeaturedProducts'
import Categories from '#/components/Categories'
import Footer from '#/components/Footer'
import Navbar from '#/components/Navbar'

export default function HomePage() {
  return (
  <div className="flex flex-col items-center">
  <Navbar />
  <Hero />

  {/* HEADER MERAH – pindah ke luar dari section */}
  <div className="w-full bg-red-600 text-white">
    <div className="max-w-screen-xl mx-auto text-center py-8">
      <h2 className="text-4xl font-bold">featured</h2>
      <h3 className="text-xl font-medium">Product</h3>
    </div>
  </div>

  {/* Section produk */}
  <section className="w-full max-w-screen-xl px-4 py-8">
    <FeaturedProducts />
  </section>

  {/* Categories */}
  <section className="w-full bg-red-600 py-10">
    <h2 className="text-3xl font-bold text-center text-white mb-6">CATEGORIES</h2>
    <Categories />
  </section>

  <Footer />
</div>
  )
}
'use client';

import Hero from '#/components/Hero';
import Footer from '#/components/Footer';
import FeaturedProducts from '#/components/FeaturedProducts';
import Categories from '#/components/Categories';
import { motion } from 'framer-motion';

export default function HomePage() {
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

  
  return (
    <div className="flex flex-col items-center">
      <Hero />

      {/* HEADER MERAH – FEATURED */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full bg-red-600 text-white"
      >
        <div className="max-w-screen-xl mx-auto text-center py-8">
          <h2 className="text-4xl font-bold">featured</h2>
          <h3 className="text-xl font-medium">Product</h3>
        </div>
      </motion.div>

      {/* Section produk */}
      <section className="w-full max-w-screen-xl px-4 py-8">
        <FeaturedProducts />
      </section>

      {/* Categories */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-red-600 py-10"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">CATEGORIES</h2>
        <Categories />
      </motion.section>

      <Footer />
    </div>
  );
}

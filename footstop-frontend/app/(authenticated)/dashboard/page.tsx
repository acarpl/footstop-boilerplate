'use client';

import Hero from '#/components/Hero';
import FeaturedProducts from '#/components/FeaturedProducts';
import Categories from '#/components/Categories';
import { motion } from 'framer-motion';
import { TokenUtil } from '#/utils/token';
TokenUtil.loadToken();

export default function HomePage() {
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  
  return (
    // Tidak perlu <div className="flex flex-col items-center">
    // Tidak perlu <Navbar /> dan <Footer /> karena sudah ada di layout.tsx
    <>
      <Hero />

      {/* HEADER MERAH – FEATURED */}
      <motion.div>
        ...
      </motion.div>

      {/* Section produk */}
      <section className="w-full max-w-screen-xl px-4 py-8 mx-auto">
        <FeaturedProducts />
      </section>

      {/* Categories */}
      <motion.section>
        ...
      </motion.section>
    </>
  );
}
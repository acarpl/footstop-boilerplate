'use client';

import { motion } from 'framer-motion';
import Navbar from '#/components/Navbar';
import Footer from '#/components/Footer';
import Image from 'next/image';

const brands = [
  { name: "Adidas", logo: "/brands/adidas.png" },
  { name: "Converse", logo: "/brands/converse.png" },
  { name: "Crocs", logo: "/brands/crocs.png" },
  { name: "Erspo", logo: "/brands/erspo.png" },
  { name: "Jordan", logo: "/brands/jordan.png" },
  { name: "New Balance", logo: "/brands/newbalance.png" },
  { name: "New Era", logo: "/brands/newera.png" },
  { name: "Nike", logo: "/brands/nike.png" },
  { name: "On", logo: "/brands/on.png" },
  { name: "Puma", logo: "/brands/puma.png" },
  { name: "Under Armour", logo: "/brands/underarmour.png" },
  { name: "Vans", logo: "/brands/vans.png" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function BrandPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Banner */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <Image
            src="/banners/new-arrivals-banner.jpg"
            alt="Step Worldwide"
            className="w-full h-48 object-cover"
          />
          <h1 className="text-4xl text-center text-red-600 font-bold py-4">
            Step Worldwide
          </h1>
        </div>

        {/* Brand Grid with Animation */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="bg-[#943939] rounded-xl flex items-center justify-center p-6 hover:scale-105 transition duration-300"
              variants={itemVariants}
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                className="h-12 object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

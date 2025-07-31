'use client';

import { Button } from 'antd';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div
      className="w-full bg-gray-100 bg-cover bg-center py-64"
      style={{
        backgroundImage: 'url(/images/hero-section.png)',
      }}
    >
      {/* <div className="max-w-screen-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="bg-white/80 md:bg-white/70 p-6 rounded-lg max-w-md"
        >
          <h1 className="text-4xl font-bold text-gray-900">Converse</h1>
          <p className="text-gray-600 mt-2">
            Dapatkan koleksi terbaru Converse dengan gaya klasik dan modern. Temukan sepatu yang mencerminkan gaya Anda.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button type="primary" className="mt-4 bg-black hover:bg-gray-800">
              Shop Now
            </Button>
          </motion.div>
        </motion.div>
      </div> */}
    </div>
  );
}

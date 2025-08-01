"use client";

import { motion } from "framer-motion";
import React from "react";
import { Footprints } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white">
      {/* Abstract Shoe Spinner */}
      <motion.div
        className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 via-gray-800 to-black shadow-2xl mb-6"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      >
        <Footprints className="w-10 h-10 text-white" />
      </motion.div>

      {/* Typing Effect Title */}
      <motion.div
        className="text-xl md:text-2xl font-semibold tracking-widest overflow-hidden whitespace-nowrap border-r-2 border-red-500 pr-2"
        initial={{ width: 0 }}
        animate={{ width: "auto" }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        Memuat Footstop...
      </motion.div>
    </div>
  );
}

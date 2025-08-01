"use client";

import { motion } from "framer-motion";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: i === 0 ? "#e11d48" : i === 1 ? "#6b7280" : "#000",
            }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const words = ["Style", "Sport", "Casual", "Feet*"];
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showRoller, setShowRoller] = useState(false);
  const [index, setIndex] = useState(0);
  const [showSubText, setShowSubText] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const fullText = " We Serve & Styling For Ur ";
  const typingIndex = useRef(0); // untuk menyimpan posisi typing yang mutakhir

  // Loading delay sebelum mulai typing
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect menggunakan useRef agar tidak ada delay closure state
  useEffect(() => {
    if (!isReady) return;

    const typingSpeed = 50;
    const typeInterval = setInterval(() => {
      if (typingIndex.current < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(typingIndex.current));
        typingIndex.current += 1;
      } else {
        clearInterval(typeInterval);
        setShowCursor(false);
        setShowRoller(true);
        setIndex(0);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [isReady]);

  // Roller effect
  useEffect(() => {
    if (!showRoller) return;

    if (index >= words.length - 1) {
      const subTimer = setTimeout(() => setShowSubText(true), 1000);
      return () => clearTimeout(subTimer);
    }

    const speed = 600;
    const timer = setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, words.length - 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [index, showRoller]);

  return (
    <main className="text-gray-800">
      <Navbar />
      {/* Hero Section */}
      <section className="relative w-full h-72 md:h-[400px]">
        <Image
          src="/images/about-hero.png"
          alt="About Hero"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide">
            ABOUT
          </h1>
        </div>
      </section>

      {/* Slogan Section */}
      <section className="text-center py-16 px-6 min-h-[200px]">
        <h2 className="text-3xl md:text-5xl font-bold uppercase leading-tight">
          {isReady && typedText}
          {isReady && showCursor && <span className="animate-pulse">|</span>}
          &nbsp;
          {isReady && showRoller && index < words.length && (
            <span className="text-red-600">{words[index]}</span>
          )}
        </h2>

        {showSubText && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="italic text-sm md:text-base mt-4 text-gray-500"
          >
            *No matter what kind of feet you have.
          </motion.p>
        )}
      </section>

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-red-600 text-white py-10 px-6 md:px-16"
      >
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Selamat datang di Footstop,
        </h3>
        <p className="leading-relaxed">
          tempat di mana gaya dan kenyamanan bertemu untuk memberikan pengalaman
          terbaik bagi kaki Anda. Kami hadir sebagai platform yang menyediakan
          berbagai pilihan sepatu dari berbagai merek ternama—tanpa batasan.
          Apapun bentuk, ukuran, atau gaya kaki Anda, Footstop hadir untuk
          melayani dan memperindah setiap langkah Anda.
        </p>
      </motion.section>

      {/* Siapa Kami */}
      <section className="py-10 px-6 md:px-16 grid md:grid-cols-2 gap-10 items-center">
        <Image
          src="/images/footstop-logo-block.png"
          alt="Footstop Illustration"
          width={500}
          height={400}
          className="mx-auto"
        />
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-4">Siapa Kami?</h3>
          <p className="leading-relaxed">
            Footstop bukan hanya toko sepatu biasa. Kami adalah penyedia solusi
            gaya untuk semua kalangan, tanpa memandang bentuk atau ukuran kaki.
            Misi kami sederhana: memastikan setiap orang merasa percaya diri dan
            nyaman dalam melangkah, dengan sepatu yang tepat dan gaya yang
            mencerminkan kepribadian mereka.
          </p>
        </div>
      </section>

      {/* Apa yang Kami Tawarkan */}
      <section className="px-6 md:px-16 pb-10">
        <Image
          src="/images/about-offers.png"
          alt="Shoes"
          width={1200}
          height={500}
          className="rounded-md w-full mb-6"
        />
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Apa yang Kami Tawarkan?
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Koleksi sepatu dari berbagai merek lokal maupun internasional</li>
          <li>
            Pilihan untuk berbagai kebutuhan: kasual, formal, olahraga, dan
            lainnya
          </li>
          <li>Pelayanan ramah dan responsif, baik online maupun offline</li>
          <li>
            Panduan ukuran dan style untuk membantu Anda menemukan pasangan
            sepatu yang pas
          </li>
        </ul>
      </section>

      {/* Mengapa Footstop */}
      <section className="bg-red-600 text-white py-10 px-6 md:px-16">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Mengapa Footstop?
        </h3>
        <p className="leading-relaxed">
          Karena kami percaya bahwa setiap kaki berhak tampil gaya. Lewat kurasi
          produk yang beragam dan layanan yang inklusif, kami hadir sebagai
          tempat yang bisa menjadi rumah bagi semua pecinta sepatu. Kami juga
          senantiasa mengikuti tren terkini dan tetap menjaga kenyamanan sebagai
          prioritas utama.
        </p>
        <p className="mt-4 leading-relaxed">
          Terima kasih telah memilih Footstop. Langkah Anda, gaya Anda—biarkan
          kami yang bantu menyempurnakannya.
        </p>
      </section>
      <Footer />
    </main>
  );
}

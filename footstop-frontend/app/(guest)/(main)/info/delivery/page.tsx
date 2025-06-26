"use client";

import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";

export default function InfoPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar />

        <section className="flex-grow px-6 py-20 text-center text-gray-700">
          <h1 className="text-xl md:text-2xl font-semibold mb-4">
            Halaman Delivery Segera Hadir
          </h1>
          <p>Mohon ditunggu, kami sedang menyiapkan info pengiriman terbaik untuk Anda.</p>
        </section>

      <Footer />
    </main>
  );
}

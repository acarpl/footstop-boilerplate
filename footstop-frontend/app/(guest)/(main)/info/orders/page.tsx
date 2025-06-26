"use client";

import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";

export default function InfoPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <section className="flex-grow px-6 py-20 text-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Ini halaman untuk orders
        </h1>
      </section>

      <Footer />
    </main>
  );
}

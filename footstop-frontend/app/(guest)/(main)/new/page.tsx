"use client";
import ProductCard from "#/components/product/ProductCard";
import Navbar from '#/components/Navbar'
import footer from '#/components/Footer'
import FeaturedProducts from '#/components/FeaturedProducts';
import Image from "next/image";

const dummyProducts = Array(6).fill({
  name: "Converse 70's - Black",
  price: "Rp 1.770.000",
  image: "/products/converse-black.jpeg",
});

export default function NewArrivalPage() {
  return (
    <main className="bg-gray-100">
      {/* Banner */}
      <Navbar />
      <div className="relative w-full h-64">
        <Image
          src="/banners/new-arrivals-banner.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />
        <h1 className="absolute bottom-6 left-6 text-white text-4xl font-bold">
          New Arrival.
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Sidebar - Now horizontal on top */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-red-600 font-bold text-3xl mb-4 md:mb-0">New <br /> Arrival.</div>
          <Image src="/banners/new-left.jpg" alt="Side" width={200} height={250} className="md:mx-4" />
          <div className="text-red-600 font-bold text-3xl mt-4 md:mt-0">New <br /> Arrival.</div>
        </div>

        {/* Products - Now takes full width */}
        <div className="w-full">
          <FeaturedProducts />
        </div>
      </div>
      <footer />
    </main>
  );
}
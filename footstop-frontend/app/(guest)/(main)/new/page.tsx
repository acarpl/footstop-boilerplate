"use client";
import ProductCard from "#/components/product/ProductCard";
import Navbar from '#/components/Navbar'
import footer from '#/components/Footer'
import Image from "next/image";

const dummyProducts = Array(6).fill({
  name: "Converse 70’s - Black",
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

      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-6 px-6 py-10">
        {/* Sidebar */}
        <aside className="space-y-6 md:col-span-1">
          <div className="text-red-600 font-bold text-3xl">New <br /> Arrival.</div>
          <Image src="/banners/new-left.jpg" alt="Side" width={300} height={400} />
          <div className="text-red-600 font-bold text-3xl">New <br /> Arrival.</div>
        </aside>

        {/* Products */}
        <section className="md:col-span-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProducts.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </section>
      </div>
      <footer />
    </main>
  );
}

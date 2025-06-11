// components/Categories.tsx
import React from "react";

const categories = [
  { title: "Sneakers", img: "/images/sneakers.jpg" },
  { title: "Formal", img: "/images/formal.jpg" },
  { title: "Apparels", img: "/images/apparels.jpg" },
  { title: "Sporty", img: "/images/sporty.jpg" },
];

export default function Categories() {
  return (
    <section className="bg-red-600 text-white py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-wide">Categories</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-20">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white overflow-hidden rounded-md shadow hover:shadow-lg transition"
          >
            <img src={cat.img} alt={cat.title} className="w-full h-40 object-cover" />
            <div className="text-center py-2 font-semibold text-lg text-black">{cat.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

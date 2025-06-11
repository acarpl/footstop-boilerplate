export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] bg-gradient-to-r from-red-600 to-red-400 flex items-center justify-center text-white">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Step Up Your Style</h1>
        <p className="text-lg md:text-xl mb-6">Discover the latest from Converse, Nike, Adidas, and more</p>
        <button className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
          Shop Now
        </button>
      </div>

      <div className="absolute inset-0 bg-black/30" />
      <img
        src="/hero-shoes.jpg"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
    </section>
  );
}

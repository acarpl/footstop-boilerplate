const products = [
  {
    id: 1,
    name: "Converse Chuck Taylor",
    price: "Rp 850.000",
    image: "/shoes1.jpg",
  },
  {
    id: 2,
    name: "Nike Air Max 90",
    price: "Rp 1.450.000",
    image: "/shoes2.jpg",
  },
  {
    id: 3,
    name: "Adidas Ultraboost",
    price: "Rp 1.800.000",
    image: "/shoes3.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-red-600 font-medium mt-1">{product.price}</p>
              <button className="mt-4 w-full py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

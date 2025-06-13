import { Button } from 'antd'

export default function Hero() {
  return (
    <div
      className="w-full bg-gray-100 bg-cover bg-center py-20"
      style={{
        backgroundImage: 'url(/images/hero-shoes.jpeg)',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-white/80 md:bg-white/70 p-6 rounded-lg max-w-md">
          <h1 className="text-4xl font-bold text-gray-900">Converse</h1>
          <p className="text-gray-600 mt-2">
            Dapatkan koleksi terbaru Converse dengan gaya klasik dan modern. Temukan sepatu yang mencerminkan gaya Anda.
          </p>
          <Button type="primary" className="mt-4 bg-black hover:bg-gray-800">Shop Now</Button>
        </div>
      </div>
    </div>
  )
}

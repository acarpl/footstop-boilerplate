'use client'
import Image from 'next/image'

interface CartItemProps {
  name: string
  size: string
  color: string
  price: number
  quantity: number
  img: string
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItem({
  name, size, color, price, quantity, img, onIncrease, onDecrease, onRemove
}: CartItemProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <Image src={img} alt={name} width={80} height={80} />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">Size: {size}</p>
          <p className="text-sm text-gray-500">Color: {color}</p>
          <p className="font-bold mt-1">Rp {price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={onDecrease} className="bg-gray-200 rounded-full px-3">−</button>
        <span>{quantity}</span>
        <button onClick={onIncrease} className="bg-gray-200 rounded-full px-3">+</button>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-xl">🗑️</button>
      </div>
    </div>
  )
}

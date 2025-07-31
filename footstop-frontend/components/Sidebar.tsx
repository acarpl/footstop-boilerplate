'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside className="w-[250px] p-6 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/images/user.png"
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
        <p className="font-semibold text-lg">Kingrasya</p>
        <ul className="w-full space-y-3">
          <li className="cursor-pointer hover:text-red-500" onClick={() => router.push('/dashboard')}>Dashboard</li>
          <li className="cursor-pointer hover:text-red-500" onClick={() => router.push('/profile')}>My Profile</li>
          <li className="cursor-pointer hover:text-red-500" onClick={() => router.push('/orders')}>Order History</li>
          <li className="font-semibold text-red-600 cursor-pointer" onClick={() => router.push('/cart')}>My Cart</li>
        </ul>
        <button className="text-red-600 mt-10 hover:underline" onClick={() => router.push('/logout')}>Logout</button>
      </div>
    </aside>
  )
}

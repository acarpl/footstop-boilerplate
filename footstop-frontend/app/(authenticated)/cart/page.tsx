'use client';

import Navbar from '#/components/Navbar';
import Footer from '#/components/Footer';
import Sidebar from '#/components/Sidebar';
import Image from 'next/image';
import { TokenUtil } from '#/utils/token';
import { Trash } from "lucide-react";
import Link from 'next/link';

TokenUtil.loadToken();

export default function CartPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-red-500 mb-8">YOUR CART</h1>

          {/* Produk List */}
          <div className="flex flex-col space-y-5">
            {[{
              name: 'Converse Run Star Trainer',
              size: '42',
              color: 'Sky Blue',
              price: 1199000,
              img: '/images/shoes.png'
            }, {
              name: 'Checkered Shirt',
              size: 'Medium',
              color: 'Red',
              price: 1990000,
              img: '/images/shirt.png'
            }, {
              name: 'Skinny Fit Jeans',
              size: 'Large',
              color: 'Blue',
              price: 2500000,
              img: '/images/jeans.png'
            }].map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <Image src={item.img} alt={item.name} width={80} height={80} />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                    <p className="font-bold mt-1">Rp {item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="bg-gray-200 rounded-full px-3">−</button>
                  <span>1</span>
                  <button className="bg-gray-200 rounded-full px-3">+</button>
                  <button className="text-red-500 hover:text-red-700 text-xl"><Trash /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-10 bg-white p-6 rounded-lg shadow w-full max-w-md ml-auto">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 5,689,000</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount (-20%)</span>
                <span>Rp 1,137,800</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>Rp 4,551,200</span>
              </div>
            </div>
            <div className="flex mt-4">
              <input
                type="text"
                placeholder="Add promo code"
                className="border px-3 py-2 w-full rounded-l-md"
              />
              <button className="bg-black text-white px-4 rounded-r-md">Apply</button>
            </div>
                     <Link href="/checkout">
                      <button className="mt-5 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                          Go to Checkout →
                      </button>
                    </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

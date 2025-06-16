"use client";

import Link from "next/link";
import { Button } from "antd";
import { Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-30 border-b border-gray-200 rounded-b-xl shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    {/* Left Section */}
    <div className="flex items-center space-x-8">
      <Link
        href="/"
        className="text-white font-semibold bg-black px-4 py-1.5 rounded-full shadow-inner"
      >
        Footstop
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex space-x-6 text-sm font-medium text-black">
        <Link href="/shop" className="hover:text-red-500 transition">Shop</Link>
        <Link href="/brands" className="hover:text-red-500 transition">Brand</Link>
        <Link href="/sale" className="hover:text-red-500 transition">Onsale</Link>
        <Link href="/new" className="hover:text-red-500 transition">New Arrivals</Link>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex items-center space-x-4">
      <Link href="/register">
        <Button type="default" className="border-red-500 text-red-600 hover:border-red-600">
          Register
        </Button>
      </Link>
      <Link href="/login">
        <Button type="primary" className="bg-red-600 hover:bg-red-700 border-none">
          Log In
        </Button>
      </Link>
    </div>
  </div>
</nav>
  );
}

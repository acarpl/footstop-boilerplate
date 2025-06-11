import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-red-600">Foot.Stop</Link>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <Link href="/">Home</Link>
            <Link href="/new">New Arrivals</Link>
            <Link href="/sale">Sale</Link>
            <Link href="/brands">Brands</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border text-sm w-64"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>
          <Link
            href="/register"
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-red-700"
          >
            Login
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-red-600">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

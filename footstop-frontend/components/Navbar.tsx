"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TokenUtil } from '#/utils/token';
TokenUtil.loadToken();

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

   const handleSearch = () => {
    // Hanya navigasi jika ada query yang diketik (bukan spasi kosong)
    if (searchQuery.trim() !== '') {
      // Navigasi ke halaman shop dengan query parameter 'search'
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
 console.log(user, TokenUtil.accessToken);
  // Loading state with proper skeleton
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md border border-white/20 rounded-b-3xl px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between h-[52px]">
          <div className="bg-gray-300 h-10 w-28 rounded-full animate-pulse"></div>
          <div className="hidden md:flex bg-gray-300 h-6 w-64 rounded-md animate-pulse"></div>
          <div className="hidden md:flex bg-gray-300 h-10 w-48 rounded-md animate-pulse"></div>
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      setIsOpen(false); // Close mobile menu
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show a toast notification here
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md border border-white/20 rounded-b-3xl px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
        >
          Footstop
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 ml-8">
          <li className="relative group">
            <Link 
              href="/shop" 
              className={`hover:text-red-600 transition-colors ${isActive('/shop') ? 'text-red-600 font-semibold' : ''}`}
            >
              Shop
            </Link>
          </li>
          <li className="relative group">
            <Link 
              href="/about" 
              className={`hover:text-red-600 transition-colors ${isActive('/about') ? 'text-red-600 font-semibold' : ''}`}
            >
              About
            </Link>
          </li>
          <li className="relative group">
            <Link 
              href="/contact" 
              className={`hover:text-red-600 transition-colors ${isActive('/contact') ? 'text-red-600 font-semibold' : ''}`}
            >
              Contact
            </Link>
          </li>
          <li className="relative group">
            <Link 
              href="/admin/dashboard" 
              className={`hover:text-red-600 transition-colors ${isActive('/contact') ? 'text-red-600 font-semibold' : ''}`}
            >
              Admin
            </Link>
          </li>
        </ul>
        

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* Search Bar */}
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleKeyDown} 
            />
          </div>

          {/* Auth-based Navigation */}
          {user ? (
            <>
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-200 rounded-full transition"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {/* Cart counter can be added here */}
              </Link>
              <Link 
                href="/profile" 
                className="p-2 hover:bg-gray-200 rounded-full transition"
                aria-label="User Profile"
              >
                <UserIcon size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                aria-label="Logout"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/register">
                <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 hover:bg-gray-200 rounded-md transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 animate-slide-down">
          <ul className="flex flex-col gap-3">
            <li>
              <Link 
                href="/shop" 
                className={`block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors ${isActive('/shop') ? 'text-red-600 font-semibold' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className={`block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors ${isActive('/about') ? 'text-red-600 font-semibold' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className={`block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors ${isActive('/contact') ? 'text-red-600 font-semibold' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            
            <hr className="my-2" />
            
            {user ? (
              <>
                <li>
                  <Link 
                    href="/profile" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cart" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Cart
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/register" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/login" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
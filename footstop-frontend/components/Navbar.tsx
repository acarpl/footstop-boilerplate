"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import {
  Menu,
  X,
  LogOut,
  Search,
  ShoppingCart,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

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

  return (
    <nav className="sticky top-0 z-50 w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md border border-white/20 rounded-b-3xl px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
          Footstop
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 ml-8">
          {["/shop", "/sale", "/new", "/brands"].map((path, idx) => (
            <li key={idx}>
              <Link
                href={path}
                className={`hover:text-red-600 transition-colors ${
                  isActive(path) ? "text-red-600 font-semibold" : ""
                }`}
              >
                {path === "/shop" ? "Shop" :
                 path === "/sale" ? "BestSeller" :
                 path === "/new" ? "NewArrivals" : "Brands"}
              </Link>
            </li>
          ))}
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
            />
          </div>

          {/* Auth */}
          {user ? (
            <>
              <Link href="/cart" className="relative p-2 hover:bg-gray-200 rounded-full transition" aria-label="Cart">
                <ShoppingCart size={20} />
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 hover:bg-gray-200 rounded-full transition">
                  <UserIcon size={20} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <div className="flex items-center p-4 border-b">
                      <Image
                        src="/profile.jpg"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex flex-col ml-3">
                        <div className="font-medium">Admin</div>
                        <div className="text-sm text-gray-600">Rp 0</div>
                      </div>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Account Profile</Link>
                      </li>
                      <li>
                        <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                      </li>
                      <li>
                        <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">Order List</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                          <div className="flex items-center gap-2">
                            <LogOut className="w-5 h-5" />
                            Logout
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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
            {["/shop", "/about", "/contact"].map((path, idx) => (
              <li key={idx}>
                <Link
                  href={path}
                  className={`block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors ${isActive(path) ? "text-red-600 font-semibold" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {path === "/shop" ? "Shop" :
                   path === "/about" ? "About" : "Contact"}
                </Link>
              </li>
            ))}

            <hr className="my-2" />

            {user ? (
              <>
                <li>
                  <Link
                    href="/account"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
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

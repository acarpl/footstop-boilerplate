// components/Navbar.tsx

"use client"; // Pastikan ini ada di baris paling atas

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import { Menu, X, Search, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path jika perlu
import { TokenUtil } from '#/utils/token';
TokenUtil.loadToken();

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Memberikan tipe pada ref

  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Efek untuk menutup dropdown saat mengklik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false); // Tutup dropdown setelah logout
    setIsOpen(false); // Tutup menu mobile juga
    // Navigasi ke home sudah di-handle oleh context
  };

  const isActive = (path: string) => pathname === path;

  // Tampilkan skeleton loading jika status otentikasi belum siap
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

  // Fungsi untuk menutup menu mobile/dropdown setelah navigasi
  const handleNavClick = () => {
    setShowDropdown(false);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full max-w-7xl mx-auto bg-white/30 backdrop-blur-md border border-white/20 rounded-b-3xl px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
          Footstop
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 ml-10">
          {[{ href: "/shop", label: "Shop" }, { href: "/sale", label: "Best Seller" }, { href: "/new", label: "New Arrivals" }, { href: "/brands", label: "Brands" }].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`hover:text-red-600 transition-colors ${isActive(item.href) ? "text-red-600 font-semibold" : ""}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* Search Bar */}
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Auth-based Navigation */}
          {user ? (
            <>
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition" aria-label="Cart">
                <ShoppingCart size={20} />
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 hover:bg-gray-100 rounded-full transition" aria-label="User Menu">
                  {/* Ganti dengan gambar profil user jika ada, jika tidak, gunakan ikon */}
                  <UserIcon size={20} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-xl z-50 animate-fade-in-down">
                    <div className="flex items-center p-4 border-b">
                      <Image src="/profile.jpg" alt={user.username} width={40} height={40} className="rounded-full" />
                      <div className="ml-3">
                        <div className="font-semibold capitalize">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link href="/profile" onClick={handleNavClick} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                          <UserIcon size={16} /> Account Profile
                        </Link>
                      </li>
                      <li>
                        <Link href="/orders" onClick={handleNavClick} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                          <ShoppingCart size={16} /> Order List
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600">
                          <LogOut size={16} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Jika user belum login
            <>
              <Link href="/register">
                <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          {/* ... (logika menu mobile Anda sudah cukup baik) ... */}
        </div>
      )}
    </nav>
  );
}
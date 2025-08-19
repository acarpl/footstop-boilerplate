//components/Navbar.tsx

"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TokenUtil } from '#/utils/token';
TokenUtil.loadToken();

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
  return () => { document.body.style.overflow = ''; };
}, [isOpen]);


  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

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
<nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled 
  ? 'bg-white/30 backdrop-blur-md text-black shadow-md border-b border-white/10' 
  : 'bg-white/50 backdrop-blur-md text-black'}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <div className="bg-gray-300 h-10 w-28 rounded-full animate-pulse"></div>
          <div className="hidden md:flex bg-gray-300 h-6 w-64 rounded-md animate-pulse"></div>
          <div className="hidden md:flex bg-gray-300 h-10 w-48 rounded-md animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
<nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled 
  ? 'bg-white/30 backdrop-blur-md text-black shadow-md border-b border-white/10' 
  : 'bg-white/50 backdrop-blur-md text-black'}`}>
<div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
  
        {/* LEFT: Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group relative">
            <img src="/icons/logo-shoe.svg" alt="Footstop Logo"
              className={`h-8 w-8 transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`} />
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Footstop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6">
            {['/shop', '/new', '/sale', '/about', '/admin/dashboard'].map((path) => (
              <li key={path} className="relative group">
                <Link
                  href={path}
                  className={`hover:text-red-600 transition-colors ${isActive(path) ? 'text-red-600 font-semibold' : ''}`}
                >
                  {path.includes('admin') ? 'Admin' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                  <span className="rounded-md absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 h-1 bg-red-800 w-0 group-hover:w-full transition-all duration-300 ease-in-out" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER: Searchbar */}
        <div className="hidden md:flex items-center group bg-white border border-gray-300 rounded-full overflow-hidden transition-all duration-300 ease-in-out">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 pl-4 text-sm text-black focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all duration-300 ease-in-out bg-black text-white px-3 py-2 rounded-r-full"
          >
            <Search size={16} />
          </button>
        </div>

        {/* RIGHT: Auth & Cart */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/cart" className="p-2 hover:bg-gray-200 rounded-full">
                <ShoppingCart size={20} />
              </Link>
              <Link href="/profile" className="p-2 hover:bg-gray-200 rounded-full">
                <UserIcon size={20} />
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/register">
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 hover:shadow-red-200 hover:shadow-sm transition">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 hover:shadow-red-300 hover:shadow-md transition">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-gray-200 rounded-md">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (

        <div className="md:hidden mt-2 px-4 animate-slide-down">
          <div className="mb-4">
            {/* Revisi searchbar mobile */}
            <div className="group flex items-center bg-white border border-gray-300 rounded-full overflow-hidden transition-all duration-300 ease-in-out">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 text-sm text-black focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all duration-300 ease-in-out bg-black text-white px-3 py-2"
              >
                <Search size={16} />
              </button>
            </div>
          </div>


          <ul className="flex flex-col gap-3">
            {['/shop', '/about', '/contact'].map((path) => (
              <li key={path}>
                <Link
                  href={path}
                  className={`block py-2 px-3 rounded-md hover:bg-gray-100 transition-colors ${isActive(path) ? 'text-red-600 font-semibold' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              </li>
            ))}

            <hr className="my-2" />

            {user ? (
              <>
                <li>
                  <Link href="/profile" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    My Cart
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-100">
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/register" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>
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

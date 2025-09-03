"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ShoppingCart, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TokenUtil } from "#/utils/token";

TokenUtil.loadToken();

// Constants
const mainMenu = [
  { path: "/shop", label: "Shop" },
  { path: "/new", label: "New" },
  { path: "/sale", label: "Sale" },
  { path: "/about", label: "About" },
];

// Custom Hook for Scroll Detection
const useScrolled = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
};

// Main Component
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading, cartItems } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isScrolled = useScrolled();

  // Handle mobile menu body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Event Handlers
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return (
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/30 backdrop-blur-md text-black shadow-md border-b border-white/10"
            : "bg-white/50 backdrop-blur-md text-black"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <div className="bg-gray-300 h-10 w-28 rounded-full animate-pulse"></div>
          <div className="hidden md:flex bg-gray-300 h-6 w-64 rounded-md animate-pulse"></div>
          <div className="hidden md:flex bg-gray-300 h-10 w-48 rounded-md animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/30 backdrop-blur-md text-black shadow-md border-b border-white/10"
          : "bg-white/50 backdrop-blur-md text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Row: Logo, Search, Cart, Profile, Hamburger */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <img
              src="/icons/logo-shoe.svg"
              alt="Footstop Logo"
              className={`h-8 w-8 transition-all duration-300 ${
                isScrolled ? "scale-95" : "scale-100"
              }`}
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Footstop
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8">
            {mainMenu.map((item) => (
              <li key={item.path} className="relative group">
                <Link
                  href={item.path}
                  className={`text-gray-700 font-medium transition-colors hover:text-red-600 ${
                    isActive(item.path) ? "text-red-600" : ""
                  }`}
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-0.5 bg-red-600 w-0 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Search, Cart, Profile, Hamburger */}
          <div className="flex items-center gap-2">
            {/* Search Icon for Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-200 rounded-md"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-200 rounded-full relative"
            >
              <ShoppingCart size={20} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile/Login */}
            {user ? (
              <Link
                href="/profile"
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <UserIcon size={20} />
              </Link>
            ) : (
              <Link href="/login">
                <button className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition hidden md:block">
                  Log In
                </button>
              </Link>
            )}

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-200 rounded-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar (Desktop always visible, Mobile visible when isOpen) */}
        <form
          onSubmit={handleSearch}
          className={`mt-2 md:flex md:items-center md:w-96 md:mx-auto relative ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
            size={18}
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm text-gray-700 placeholder-gray-400 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            aria-label="Search"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* Mobile Menu (Only Navigation and Auth) */}
      {isOpen && (
        <div className="md:hidden px-4 py-4 bg-white/95 backdrop-blur-md animate-slide-down">
          <ul className="flex flex-col gap-2">
            {mainMenu.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block py-2 px-3 rounded-md hover:bg-gray-100 font-medium ${
                    isActive(item.path) ? "text-red-600" : "text-gray-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <hr className="my-2" />
            {user ? (
              <>
                {user.id_user === 1 && (
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className="block py-2 px-3 rounded-md hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/register"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
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

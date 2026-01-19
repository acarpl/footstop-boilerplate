"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TokenUtil } from "#/utils/token";

TokenUtil.loadToken();

// Constants
const mainMenu = [
  { path: "/shop", label: "Shop" },
  { path: "/new", label: "New" },
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

// Custom Hook for Click Outside
const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);

  return ref;
};

// Main Component
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, loading, cartItems } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useClickOutside(() => setIsProfileOpen(false));
  const isScrolled = useScrolled();

  // Handle mobile menu body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Add global styles for body padding
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      main, #__next { position: relative; z-index: 1; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
      setIsProfileOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return (
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <div className="bg-gray-200 h-10 w-28 rounded-full animate-pulse"></div>
          <div className="hidden md:flex bg-gray-200 h-8 w-80 rounded-md animate-pulse"></div>
          <div className="hidden md:flex bg-gray-200 h-10 w-48 rounded-md animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        {/* Main Navbar Content */}
        <div className="flex items-center justify-between">
          {/* Left: Logo + Desktop Menu */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group relative">
              <img
                src="/icons/logo-shoe.svg"
                alt="Footstop Logo"
                className={`h-8 w-8 transition-all duration-300 ${
                  isScrolled ? "scale-95" : "scale-100"
                }`}
              />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Footstop
              </span>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-6">
              {mainMenu.map((item) => (
                <li key={item.path} className="relative group">
                  <Link
                    href={item.path}
                    className={`text-gray-700 font-medium text-sm transition-colors hover:text-red-600 ${
                      isActive(item.path) ? "text-red-600" : ""
                    }`}
                  >
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-0.5 bg-red-600 w-0 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Search, Cart, Profile/Login, Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Bar (Desktop: Always visible, Mobile: Toggled) */}
            <form
              onSubmit={handleSearch}
              className={`relative ${
                isOpen ? "flex w-64 md:w-80" : "hidden md:flex md:w-80"
              }`}
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm text-gray-700 placeholder-gray-400 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                aria-label="Search"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart size={20} className="text-gray-700" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile/Login (Desktop: Dropdown, Mobile: Direct Link) */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hidden md:flex items-center gap-1 p-2 hover:bg-gray-100 rounded-full"
                >
                  <UserIcon size={20} className="text-gray-700" />
                  <ChevronDown
                    size={16}
                    className={`text-gray-700 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <Link
                  href="/profile"
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                  <UserIcon size={20} className="text-gray-700" />
                </Link>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden md:block">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Orders History
                    </Link>
                    {user.id_role === 1 && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/register" className="hidden md:block">
                  <button className="px-3 py-1.5 border border-red-600 text-red-600 text-sm rounded-full hover:bg-red-50 transition-colors">
                    Register
                  </button>
                </Link>
                <Link href="/login" className="hidden md:block">
                  <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors">
                    Log In
                  </button>
                </Link>
                <Link
                  href="/login"
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                  <UserIcon size={20} className="text-gray-700" />
                </Link>
              </>
            )}

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              {isOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Only Navigation and Auth) */}
      {isOpen && (
        <div className="md:hidden px-4 py-6 bg-white/95 backdrop-blur-md border-t border-gray-100 animate-slide-down">
          <ul className="flex flex-col gap-1">
            {mainMenu.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user && user.id_user === 1 && (
              <li>
                <Link
                  href="/admin/dashboard"
                  className="block py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/register"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
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

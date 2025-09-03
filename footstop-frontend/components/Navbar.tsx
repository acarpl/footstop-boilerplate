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

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logout, loading, cartItems } = useAuth();

  console.log(user, TokenUtil.accessToken);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      router.push(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
      setIsOpen(false);
      // Optional: Clear search after successful search
      // setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchIconClick = () => {
    handleSearch();
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

  const mainMenu = [
    { path: "/shop", label: "Shop" },
    { path: "/new", label: "New" },
    { path: "/sale", label: "Sale" },
    { path: "/about", label: "About" },
  ];

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* LEFT: Logo + Desktop Menu */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group relative">
            <img
              src="/icons/logo-shoe.svg"
              alt="Footstop Logo"
              className={`h-8 w-8 transition-all duration-300 ${
                isScrolled ? "scale-95" : "scale-100"
              }`}
            />
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        </div>

        {/* CENTER: Modern Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center w-96 relative"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
            size={18}
            onClick={handleSearchIconClick}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm text-gray-700 placeholder-gray-400 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            aria-label="Search"
          >
            <Search size={14} />
          </button>
        </form>

        {/* RIGHT: Auth & Cart */}
        <div className="hidden md:flex items-center gap-4 relative">
          {user ? (
            <div className="flex items-center gap-2 relative" ref={profileRef}>
              {/* Cart with badge */}
              <Link
                href="/cart"
                className="p-2 hover:bg-gray-200 rounded-full relative"
              >
                <ShoppingCart size={20} />
                {cartItems && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 p-2 hover:bg-gray-200 rounded-full"
              >
                <UserIcon size={20} />
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-32 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fade-in">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {user.id_user === 1 && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/register">
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-gray-200 rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 px-4 animate-slide-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
              size={18}
              onClick={handleSearchIconClick}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm text-gray-700 placeholder-gray-400 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* Mobile Search Button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              aria-label="Search"
            >
              <Search size={14} />
            </button>
          </form>

          {/* Mobile Menu Links */}
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
                <li>
                  <Link
                    href="/profile"
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                {user.role_id === 1 && (
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
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-100"
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

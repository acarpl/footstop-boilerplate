"use client";
import React from "react";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
        {/* Logo & Social Media */}
        <div className="space-y-3 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Image
              src="/icons/Footstop.png"
              alt="FootStop Logo"
              width={70}
              height={70}
            />
            <div className="text-black font-semibold leading-tight">
              <p>Your First</p>
              <p>Step to</p>
              <p>Stand Out</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-start space-x-4 text-black mt-2">
            <Facebook
              size={20}
              className="hover:text-blue-600 cursor-pointer"
            />
            <Twitter size={20} className="hover:text-sky-500 cursor-pointer" />
            <Instagram
              size={20}
              className="hover:text-pink-500 cursor-pointer"
            />
            <Github size={20} className="hover:text-gray-800 cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold text-black mb-2 tracking-wide">
            COMPANY
          </h4>
          <ul className="space-y-1">
            <li>
              <Link href="/info/about" className="hover:text-gray-800">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold text-black mb-2 tracking-wide">HELP</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/info/support" className="hover:text-gray-800">
                Customer Support
              </Link>
            </li>
            <li>
              <Link href="/info/delivery" className="hover:text-gray-800">
                Delivery Details
              </Link>
            </li>
            <li>
              <Link href="/info/terms" className="hover:text-gray-800">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/info/privacy-policy" className="hover:text-gray-800">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold text-black mb-2 tracking-wide">FAQ</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/info/account" className="hover:text-gray-800">
                Account
              </Link>
            </li>
            <li>
              <Link
                href="/info/manage-deliveries"
                className="hover:text-gray-800"
              >
                Manage Deliveries
              </Link>
            </li>
            <li>
              <Link href="/info/orders" className="hover:text-gray-800">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/info/payment" className="hover:text-gray-800">
                Payment
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 pt-4 pb-6 px-4 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className="text-xs">foot.stop © 2025, All Rights Reserved</p>

        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3 md:mt-0">
          {[
            { src: "/icons/visa.svg", alt: "Visa" },
            { src: "/icons/Bank-BCA.svg", alt: "Bank BCA" },
            { src: "/icons/Dana.svg", alt: "Dana" },
            { src: "/icons/QRIS.svg", alt: "QRIS" },
          ].map((icon, index) => (
            <div
              key={index}
              className="p-1.5 bg-white rounded-md border border-gray-300 shadow-sm"
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

"use client";
import React from "react";
// Niatnya mau pake react-icons tapi daripada kebanyakan dependencies mending pake yang ada aja
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Tagline */}
        <div className="flex items-start space-x-6">
          <Image
            src="/icons/Footstop.png"
            alt="FootStop Logo"
            width={50}
            height={50}
          />
          <div className="text-black font-semibold space-y-1">
            <p>Your First</p>
            <p>Step to</p>
            <p>Stand Out</p>
          </div>
          <div className="flex space-x-3 mt-4 text-black">
            <Facebook size={20} />
            <Twitter size={20} />
            <Instagram size={20} />
            <Github size={20} />
          </div>
        </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-black mb-2 tracking-wide">COMPANY</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/info/about" className="text-gray-600 hover:text-gray-800 no-underline">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-black mb-2 tracking-wide">HELP</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/info/support" className="text-gray-600 hover:text-gray-800 no-underline">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/info/delivery" className="text-gray-600 hover:text-gray-800 no-underline">
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link href="/info/terms" className="text-gray-600 hover:text-gray-800 no-underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/info/privacy-policy" className="text-gray-600 hover:text-gray-800 no-underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="font-semibold text-black mb-2 tracking-wide">FAQ</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/info/account" className="text-gray-600 hover:text-gray-800 no-underline">
                  Account
                </Link>
              </li>
              <li>
                <Link href="/info/manage-deliveries" className="text-gray-600 hover:text-gray-800 no-underline">
                  Manage Deliveries
                </Link>
              </li>
              <li>
                <Link href="/info/orders" className="text-gray-600 hover:text-gray-800 no-underline">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/info/payment" className="text-gray-600 hover:text-gray-800 no-underline">
                  Payment
                </Link>
              </li>
            </ul>
          </div>

</div>
      {/* Bottom section */}
      <div className="border-t border-gray-300 pt-4 pb-6 px-4 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
  <p className="text-xs">foot.stop © 2025, All Rights Reserved</p>
  
  <div className="flex space-x-2 mt-2 md:mt-0">
    {[
      { src: "/icons/visa.svg", alt: "Visa" },
      { src: "/icons/mastercard.svg", alt: "MasterCard" },
      { src: "/icons/Bank-BCA.svg", alt: "Bank BCA" },
      { src: "/icons/Dana.svg", alt: "Dana" },
      { src: "/icons/QRIS.svg", alt: "QRIS" },
    ].map((icon, index) => (
      <div
        key={index}
        className="p-1.5 bg-white rounded-md border border-gray-300 shadow-sm"
      >
        <Image src={icon.src} alt={icon.alt} width={50} height={50} style={{ objectFit: 'contain' }} />
      </div>
    ))}
  </div>
</div>
    </footer>
  );
}

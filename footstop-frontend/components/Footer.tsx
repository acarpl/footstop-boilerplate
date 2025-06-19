// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold text-black mb-2">Foot.Stop</h4>
          <p>&copy; 2025 All rights reserved</p>
          <div className="flex space-x-3 mt-2">
            <img src="/icons/fb.svg" alt="Facebook" className="w-5 h-5" />
            <img src="/icons/ig.svg" alt="Instagram" className="w-5 h-5" />
            <img src="/icons/tw.svg" alt="Twitter" className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-black mb-2">Company</h4>
          <ul className="space-y-1">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-black mb-2">Help</h4>
          <ul className="space-y-1">
            <li>Support</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-black mb-2">Resources</h4>
          <ul className="space-y-1">
            <li>Newsletter</li>
            <li>App Download</li>
            <li>Affiliates</li>
          </ul>
          <div className="flex space-x-2 mt-2">
            <img src="/icons/visa.svg" alt="Visa" className="w-8" />
            <img src="/icons/mastercard.svg" alt="MasterCard" className="w-8" />
            <img src="/icons/paypal.svg" alt="PayPal" className="w-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}

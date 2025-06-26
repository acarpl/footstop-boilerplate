"use client";

import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";

import {
  CreditCard,
  Briefcase,
  Banknote,
  Package,
  Lock,
  FileText,
} from "lucide-react";

export default function InfoPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <section className="flex-grow px-6 py-20 text-center max-w-3xl mx-auto">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-8">
          PAYMENTS
        </h1>

        <div className="text-left space-y-6 text-gray-700 leading-relaxed">
          <p className="font-semibold text-lg mb-2">Payment Methods</p>

          <p>
            Untuk kenyamanan Anda, Footstop menyediakan berbagai metode pembayaran
            yang fleksibel dan aman. Pilih cara yang paling sesuai dengan Anda:
          </p>

          <div className="flex items-start space-x-3">
            <CreditCard className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="font-semibold">Kartu Kredit / Debit</p>
              <ul className="list-disc list-inside ml-2">
                <li>Visa</li>
                <li>MasterCard</li>
                <li>American Express</li>
                <li>Visa Electron</li>
                <li>Maestro</li>
              </ul>
              <p className="mt-1 text-sm text-gray-600">
                Pembayaran dengan kartu diproses melalui gateway yang terenkripsi dan
                aman.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Briefcase className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="font-semibold">Dompet Digital</p>
              <ul className="list-disc list-inside ml-2">
                <li>Google Pay*</li>
                <li>PayPal</li>
                <li>GoPay</li>
                <li>Dana</li>
                <li>Qirs</li>
              </ul>
              <p className="mt-1 text-sm text-gray-600">
                *Google Pay hanya tersedia untuk pengguna tertentu tergantung pada
                perangkat dan wilayah.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Banknote className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="font-semibold">Transfer Bank</p>
              <ul className="list-disc list-inside ml-2">
                <li>Bank Central Asia (BCA)</li>
                <li>Bank Mandiri (coming soon)</li>
              </ul>
              <p className="mt-1 text-sm text-gray-600">
                Virtual Account tersedia atas permintaan.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Package className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <p className="font-semibold">COD (Cash on Delivery)</p>
              <p className="ml-2">
                Hanya tersedia untuk area tertentu dan tergantung pada ketersediaan kurir.
              </p>
            </div>
          </div>

          <div className="mt-8 text-gray-800 space-y-3">
            <p>
              <strong>Catatan Penting:</strong>
            </p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>
                Semua pembayaran akan dikonfirmasi melalui email secara otomatis.
              </li>
              <li>Jika Anda mengalami kendala, silakan hubungi tim support kami.</li>
            </ul>
          </div>

          <div className="flex items-center space-x-3 mt-8">
            <Lock className="w-6 h-6 text-gray-600" />
            <p className="text-gray-700 font-semibold">
              100% Aman & Terpercaya — Pembayaran di Footstop menggunakan sistem
              terenkripsi dan mitra pembayaran yang terpercaya. Kami tidak menyimpan
              data kartu Anda di server kami.
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-6">
            <FileText className="w-6 h-6 text-gray-600" />
            <p className="text-gray-700">
              Butuh bantuan saat membayar? Hubungi kami melalui{" "}
              <a href="#" className="text-blue-600 underline">
                Live Chat
              </a>{" "}
              atau{" "}
              <a href="#" className="text-blue-600 underline">
                Email Support
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

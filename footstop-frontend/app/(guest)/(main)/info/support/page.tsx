"use client";

import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";

export default function InfoPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <section className="flex-grow px-6 py-20 text-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Customer Support
        </h1>
        <hr></hr>
        <h4>Customer Support</h4>
        Operating hours: Monday to Friday, 10 AM to 7 PM (Excluding Weekend and Public Holidays)
        Hotline: +818081829310
        Email: Footstop@gmail.com
      </section>

      <Footer />
    </main>
  );
}

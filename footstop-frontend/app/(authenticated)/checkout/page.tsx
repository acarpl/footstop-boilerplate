'use client';

import Link from 'next/link';
import Navbar from '#/components/Navbar';
import Footer from '#/components/Footer';
import PersonalInfoForm from '#/components/checkout/PersonalInfoForm';
import ShippingAddress from '#/components/checkout/ShippingAddress';
import PaymentMethod from '#/components/checkout/PaymentMethod';
import OrderSummary from '#/components/checkout/OrderSummary';
import Voucher from '#/components/checkout/Voucher';

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600 mb-8">LET’S DONE YOUR ORDER</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <PersonalInfoForm />
            <ShippingAddress />
            <Voucher />
            <PaymentMethod />
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

"use client";

import Navbar from '#/components/Navbar';
import { TokenUtil } from '#/utils/token';
import React from 'react';
TokenUtil.loadToken();
export default function CartPage() {
  return (
    Navbar(),
    <div>
      <h1>My Cart</h1>
      {/* ...isi halaman keranjang... */}
    </div>
  );
}
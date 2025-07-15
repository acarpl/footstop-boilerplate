"use client";

import { TokenUtil } from '#/utils/token';
import React from 'react';
TokenUtil.loadToken();
export default function CartPage() {
  return (
    <div>
      <h1>My Cart</h1>
      {/* ...isi halaman keranjang... */}
    </div>
  );
}
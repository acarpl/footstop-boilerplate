// app/layout.tsx
"use client"; // File ini wajib menjadi Client Component karena menggunakan provider

import "./globals.css";
import "antd/dist/reset.css";

import React from "react";
import { App } from "antd"; // 1. Import komponen App
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
// ... import lain jika ada

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 2. BUNGKUS SEMUANYA DENGAN <App> */}
        {/* Ini akan menyediakan konteks untuk message, modal, dll. */}
        <App>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            {/* <Footer /> */}
          </AuthProvider>
        </App>
      </body>
    </html>
  );
}

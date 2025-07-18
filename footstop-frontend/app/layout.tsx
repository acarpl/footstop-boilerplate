import './globals.css';
import 'antd/dist/reset.css';
import {Provider} from "./provider";
import Script from 'next/script';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '#/components/Navbar';
import { App } from 'antd';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    {/* ugh */}
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <Script src="/api/env" strategy={"beforeInteractive"}></Script>
        <App> {/* Bungkus dengan <App> jika Anda menggunakan message.success/error */}
          <AuthProvider> {/* <-- AuthProvider sekarang menjadi pembungkus terluar */}
            
            {/* Navbar sekarang berada DI DALAM AuthProvider */}
            <Navbar /> 
            
            {/* Halaman konten (children) juga berada di dalam */}
            <main>{children}</main>
            
            {/* Anda bisa menambahkan Footer di sini juga */}

          </AuthProvider>
        </App>
      </body>
    </html>
  )
}

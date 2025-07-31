import 'antd/dist/reset.css';
import Script from 'next/script';
// import { Provider } from './provider';
import { AuthProvider } from '../../../context/AuthContext';
import Navbar from '#/components/Navbar';
import { App } from 'antd';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {/* Memastikan script environment dipasang paling awal */}
        <Script src="/api/env" strategy="beforeInteractive" />

        {/* Ant Design App harus membungkus semua komponen yang ingin pakai message, modal, dsb */}
        <App>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </App>
      </body>
    </html>
  );
}

// app/layout.tsx
import '#/app/globals.css';
import 'antd/dist/reset.css'; // Untuk versi Antd 5 terbaru

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

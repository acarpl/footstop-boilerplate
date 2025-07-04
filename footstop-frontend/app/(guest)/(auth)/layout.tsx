
import '#/app/globals.css';
import 'antd/dist/reset.css';
import { AuthProvider } from '../../../context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  );
}

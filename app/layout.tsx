import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/navigation/Navbar';
import { Toast } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Healthcare Tracker',
  description: 'Track your health metrics and get insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="ml-64">
            <Toast />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

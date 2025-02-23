'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-white shadow-md mt-auto">
          <div className="container mx-auto px-4 py-4 text-center text-gray-600">
            &copy; {new Date().getFullYear()} HealthCare Tracker. All rights
            reserved.
          </div>
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#DC2626',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function VerifyEmail() {
  const [resending, setResending] = useState(false);
  const { showToast } = useToast();

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const email = localStorage.getItem('confirmEmail');
      if (!email) {
        showToast('No email found. Please try signing up again.', 'error');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      showToast('Verification email resent successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error resending verification email', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
            <EnvelopeIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent you a verification email. Click the link in the email to verify your account.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Resending...' : "Didn't receive the email? Click to resend"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

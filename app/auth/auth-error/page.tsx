'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was a problem with the authentication process.
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The link you clicked might be expired or invalid. Please try to:
                </p>
                <ul className="mt-2 list-disc list-inside text-sm text-yellow-700">
                  <li>Check if you copied the entire link from your email</li>
                  <li>Request a new verification email if the link is expired</li>
                  <li>Contact support if you continue having issues</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

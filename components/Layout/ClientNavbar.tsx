'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  BeakerIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Medical Profile', href: '/medical-profile', icon: UserCircleIcon },
  { 
    name: 'Surgical Assessment', 
    href: '/surgical-assessment', 
    icon: HeartIcon,
    description: 'Evaluate surgical readiness and track health markers'
  },
  { name: 'Doctor Visits', href: '/doctor-visits', icon: CalendarIcon },
  { name: 'Health Missions', href: '/health-missions', icon: ClipboardDocumentListIcon },
  { name: 'Lab Reports', href: '/lab-reports', icon: BeakerIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
]

export default function ClientNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link
              href="/dashboard"
              className="flex flex-shrink-0 items-center font-semibold text-indigo-600"
            >
              HealthCare Tracker
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900 border-b-2'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-1" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Sign out
            </motion.button>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="sm:hidden overflow-hidden"
      >
        <div className="space-y-1 pb-3 pt-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 pl-3 pr-4 text-base font-medium ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </div>
              </Link>
            )
          })}
          <div className="border-t border-gray-200 pt-4 pb-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                signOut()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              Sign out
            </motion.button>
          </div>
        </div>
      </motion.div>
    </nav>
  )
}

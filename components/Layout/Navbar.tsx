"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/doctor-visits", label: "Doctor Visits" },
    { path: "/reports", label: "Reports" },
    { path: "/timeline", label: "Timeline" },
    { path: "/ai-doctor", label: "AI Doctor" },
    { path: "/settings", label: "Settings" },
    { path: "/surgical-assessment", label: "Surgical Assessment" },
  ];

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-primary-600"
              >
                HealthCare Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(path)
                      ? "border-primary-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/medical-profile"
                className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/medical-profile" ? "bg-gray-900" : ""
                }`}
              >
                Medical Profile
              </Link>
              <Link
                href="/surgical-assessment"
                className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/surgical-assessment" ? "bg-gray-900" : ""
                }`}
              >
                Surgical Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

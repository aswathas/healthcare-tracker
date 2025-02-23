"use client";

import Link from "next/link";
import { IconType } from "react-icons";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon?: IconType;
  status?: string;
}

export default function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
  status,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
    >
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-blue-500" />
          </div>
        )}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h2 className="mb-2 text-xl font-bold text-gray-900">{title}</h2>
            {status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {status}
              </span>
            )}
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

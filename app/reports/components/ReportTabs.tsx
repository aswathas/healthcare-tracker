'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Microscope, Heart, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportTabsProps {
  activeTab: string;
}

export default function ReportTabs({ activeTab }: ReportTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    {
      id: 'hematology',
      name: 'Hematology',
      href: '/reports/hematology',
      icon: Microscope,
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      hoverBg: 'hover:bg-red-50',
      description: 'Blood test results and analysis'
    },
    {
      id: 'cardiac',
      name: 'Cardiac',
      href: '/reports/cardiac',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500',
      hoverBg: 'hover:bg-pink-50',
      description: 'Heart health and ECG reports'
    },
    {
      id: 'imaging',
      name: 'Imaging',
      href: '/reports/imaging',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      hoverBg: 'hover:bg-blue-50',
      description: 'X-rays, MRI and scan results'
    },
    {
      id: 'biochemistry',
      name: 'Biochemistry',
      href: '/reports/biochemistry',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      hoverBg: 'hover:bg-green-50',
      description: 'Metabolic and chemical analysis'
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="relative"
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <motion.div
                className={`
                  relative h-full rounded-xl p-4 transition-all duration-200
                  ${isActive ? `${tab.bgColor} bg-opacity-10 border-2 border-${tab.bgColor}` : 'bg-white border border-gray-200'}
                  ${!isActive && tab.hoverBg}
                  cursor-pointer group
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    p-2 rounded-lg
                    ${isActive ? `${tab.bgColor} bg-opacity-20` : 'bg-gray-100 group-hover:bg-opacity-70'}
                  `}>
                    <Icon className={`h-6 w-6 ${tab.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isActive ? tab.color : 'text-gray-900'}`}>
                      {tab.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {tab.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 ${tab.bgColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {isHovered && !isActive && (
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 ${tab.bgColor} bg-opacity-50`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  BellIcon,
  UserIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import ProfileForm from "@/components/Profile/ProfileForm";

type Tab = "profile" | "notifications" | "connections";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <Cog6ToothIcon className="h-8 w-8 text-gray-400" />
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Settings">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 inline-flex items-center border-b-2 ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Profile
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`py-4 px-1 inline-flex items-center border-b-2 ${
                  activeTab === "notifications"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BellIcon className="h-5 w-5 mr-2" />
                Notifications
              </button>

              <button
                onClick={() => setActiveTab("connections")}
                className={`py-4 px-1 inline-flex items-center border-b-2 ${
                  activeTab === "connections"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <LinkIcon className="h-5 w-5 mr-2" />
                Connections
              </button>
            </nav>
          </div>

          <div className="p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {activeTab === "profile" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-semibold mb-6">
                    Profile Settings
                  </h2>
                  <ProfileForm />
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-semibold mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive updates via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Test Result Alerts</h3>
                        <p className="text-sm text-gray-500">
                          Get notified about new test results
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "connections" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-semibold mb-6">
                    Connected Services
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8">
                          <Image
                            src="/google-fit-icon.svg"
                            alt="Google Fit"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Google Fit</h3>
                          <p className="text-sm text-gray-500">
                            Connect your fitness data
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Connect
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8">
                          <Image
                            src="/apple-health-icon.svg"
                            alt="Apple Health"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Apple Health</h3>
                          <p className="text-sm text-gray-500">
                            Sync your health data
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Connect
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import { motion } from "framer-motion"
import { UserIcon, BriefcaseIcon, BookmarkIcon } from "lucide-react"
import { ProfileTabsProps } from "../types"

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="max-w-5xl mx-auto w-full -mt-6 px-4 sm:px-6 lg:px-8 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-t-xl shadow-md flex overflow-x-auto"
      >
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === "profile" 
              ? "text-[#00214D] border-b-2 border-[#00214D]" 
              : "text-gray-600 "
          }`}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === "applications" 
              ? "text-[#00214D] border-b-2 border-[#00214D]" 
              : "text-gray-600"
          }`}
        >
          <BriefcaseIcon className="h-4 w-4 mr-2" />
          Job Applications
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
            activeTab === "saved" 
              ? "text-[#00214D] border-b-2 border-[#00214D]" 
              : "text-gray-600 "
          }`}
        >
          <BookmarkIcon className="h-4 w-4 mr-2" />
          Saved Jobs
        </button>
      </motion.div>
    </div>
  )
} 
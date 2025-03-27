"use client"

import { motion } from "framer-motion"
import { DownloadIcon, UploadIcon, Loader2Icon } from "lucide-react"
import { ResumeSectionProps } from "../types"

export default function ResumeSection({ user, handleResumeUpload, isLoading }: ResumeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-xl shadow-md p-6 transition-colors duration-300"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume</h2>
      {user.resume ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <DownloadIcon className="h-6 w-6 mr-3" />
            <span className="text-gray-700">{user.resume.split('/').pop()}</span>
          </div>
          <div className="flex space-x-2">
            <label className=" px-3 py-1 rounded-xl border  text-sm transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </span>
              ) : (
                'Replace'
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
                disabled={isLoading}
              />
            </label>
            <button className="bg-yellow-600 hover:opacity-80 rounded-xl text-white px-3 py-1 text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Download
            </button>
          </div>
        </div>
      ) : (
        <label className="w-full bg-yellow-600  text-white px-4 py-3 rounded-xl transition-colors duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? (
            <>
              <Loader2Icon className="h-5 w-5 animate-spin mr-2" />
              Uploading Resume...
            </>
          ) : (
            <>
              <UploadIcon className="h-5 w-5 mr-2" />
              Upload Resume
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
            disabled={isLoading}
          />
        </label>
      )}
    </motion.div>
  )
} 
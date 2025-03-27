"use client"

import { motion } from "framer-motion"
import { PencilIcon, Loader2Icon } from "lucide-react"
import { ProfileInfoProps } from "../types"

export default function ProfileInfo({
  user,
  editMode,
  tempValues,
  handleEditToggle,
  handleInputChange,
  handleSave,
  handleCancel,
  isLoading
}: ProfileInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md p-6 transition-colors duration-300"
    >
      {/* About Me Section */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
        <button 
          onClick={() => handleEditToggle('bio')} 
          className="text-[#00214D] hover:text-[#00214D] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Bio Field - Edit Mode or Display Mode */}
      {editMode.bio ? (
        <div className="mb-4">
          <textarea
            value={tempValues.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-y min-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={4}
            disabled={isLoading}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button 
              onClick={() => handleCancel('bio')}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              onClick={() => handleSave('bio')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:opacity-80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">{user.bio}</p>
      )}

      {/* Profession Field - Edit Mode or Display Mode */}
      <div className="mt-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Profession</h2>
          <button 
            onClick={() => handleEditToggle('profession')} 
            className="text-[#00214D] hover:text-[#00214D] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>
        
        {editMode.profession ? (
          <div className="mb-4">
            <input
              type="text"
              value={tempValues.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={() => handleCancel('profession')}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSave('profession')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:opacity-80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">{user.profession}</p>
        )}
      </div>

      {/* Additional User Info */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>Email: {user.email}</p>
      </div>
    </motion.div>
  )
}
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { PencilIcon, XIcon } from "lucide-react"
import { ProfileHeroProps } from "../types"

const roleDisplayNames = {
  jobseeker: "Job Seeker",
  recruiter: "Recruiter",
  freelancer: "Freelancer",
  admin: "Administrator"
} as const

export default function ProfileHero({
  user,
  editMode,
  tempValues,
  handleEditToggle,
  handleInputChange,
  handleSave,
  handleCancel,
  handlePhotoChange
}: ProfileHeroProps) {
  return (
    <div className="relative h-80 w-full bg-[#00214D] overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      
      {/* Centered content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center text-white text-center px-4">
        {/* Profile picture with edit button */}
        <motion.div 
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profilePicture}`}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full border-4 border-white shadow-lg object-cover"
          />
          <label 
            htmlFor="photo-upload" 
            className="absolute bottom-0 right-0 bg-yellow-600 text-white p-2 rounded-full hover:bg-green-700 transition-all duration-300 shadow-md cursor-pointer hover:scale-110 hover:shadow-lg"
          >
            <PencilIcon className="h-4 w-4" />
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoChange}
            />
          </label>
        </motion.div>
        
        {/* Name field - edit mode or display mode */}
        <div className="w-full max-w-xs mb-4">
          {editMode.name ? (
            <EditableField
              value={tempValues.name}
              onChange={(value) => handleInputChange('name', value)}
              onSave={() => handleSave('name')}
              onCancel={() => handleCancel('name')}
              placeholder="Enter your name"
              className="text-2xl font-bold"
            />
          ) : (
            <DisplayField
              value={user.name}
              onEdit={() => handleEditToggle('name')}
              className="text-4xl font-bold"
            />
          )}
        </div>
        
        {/* Role badge */}
        <motion.span 
          className="px-4 py-1.5 bg-white text-[#00214D]  rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {roleDisplayNames[user.role] || user.role}
        </motion.span>
      </div>
    </div>
  )
}

// Helper component for editable fields
function EditableField({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
  className
}: {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  placeholder: string
  className?: string
}) {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 text-center w-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 pr-24 ${className}`}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave();
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        <button 
          onClick={onSave} 
          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-md"
        >
          Done
        </button>
        <button 
          onClick={onCancel} 
          className="text-white/70 hover:text-white transition-colors duration-300"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Helper component for display fields
function DisplayField({
  value,
  onEdit,
  className
}: {
  value: string
  onEdit: () => void
  className?: string
}) {
  return (
    <motion.div 
      className={`flex items-center justify-center group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {value}
      <button 
        onClick={onEdit} 
        className="ml-2 text-white/80 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
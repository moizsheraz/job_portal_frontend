"use client"

import { motion } from "framer-motion"
import { PlusIcon, XIcon, Loader2Icon } from "lucide-react"
import { SkillsSectionProps } from "../types"

export default function SkillsSection({
  user,
  newSkill,
  setNewSkill,
  showSkillInput,
  setShowSkillInput,
  handleAddSkill,
  handleRemoveSkill,
  isLoading
}: SkillsSectionProps) {
  // Handle key press to add skill on Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && newSkill.trim()) {
      handleAddSkill();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 transition-colors duration-300"
    >
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
        {!showSkillInput && (
          <button 
            onClick={() => setShowSkillInput(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label="Add Skill"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        )}
      </div>
      
      {/* Skill Input Form */}
      {showSkillInput && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4"
        >
          <div className="flex mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter new skill"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-label="New skill input"
              autoFocus
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-yellow-600 text-white rounded-r-lg hover:bg-yellow-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading || !newSkill.trim()}
              aria-label="Add skill button"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add</span>
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowSkillInput(false);
                setNewSkill('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Skills List */}
      {user.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, index) => (
            <motion.div
              key={`skill-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-yellow-600 text-white px-3 py-1 rounded-xl text-sm font-medium group flex items-center hover:bg-yellow-600 transition-colors duration-300"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-label={`Remove ${skill}`}
              >
                {isLoading ? (
                  <Loader2Icon className="h-3 w-3 animate-spin" />
                ) : (
                  <XIcon className="h-3 w-3" />
                )}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center italic py-2">
          No skills added yet. Click "Add Skill" to get started.
        </p>
      )}
    </motion.div>
  )
}
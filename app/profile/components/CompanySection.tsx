"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { CompanySectionProps } from "../types"

export default function CompanySection({ company }: CompanySectionProps) {
  if (!company) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white rounded-xl shadow-md p-6 transition-colors duration-300"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Associated Company</h2>
      <Link
        href={`/company/${company._id}`}
        className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-300"
      >
        <Image
          src={company.logo || "/placeholder.svg"}
          alt={company.name}
          width={48}
          height={48}
          className="rounded-xl mr-4 object-cover"
        />
        <div>
          <span className="text-lg font-medium text-gray-800">{company.name}</span>
          <p className="text-sm text-gray-500">View company profile</p>
        </div>
      </Link>
    </motion.div>
  )
} 
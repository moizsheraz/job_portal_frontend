"use client"

import { Briefcase, Globe, Award, HeartHandshake, User, Star, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  const features = [
    {
      icon: Briefcase,
      title: "Diverse Job Types",
      description: "White-collar, vocational, professional jobs across all industries including IT, Healthcare, Engineering, and more."
    },
    {
      icon: User,
      title: "Freelancer Accounts",
      description: "Special accounts for freelancers to showcase portfolios and find project-based work."
    },
    {
      icon: Star,
      title: "Premium Job Postings",
      description: "Highlight your job listings with premium visibility to attract top talent."
    },
    {
      icon: CreditCard,
      title: "Flexible Subscriptions",
      description: "Affordable plans for job seekers and employers with premium features."
    },
  ]

  return (
 <>
 
 <Navbar/>
 <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About ALL JOBS</h1>
          <p className="text-xl font-bold text-yellow-300 max-w-3xl mx-auto">
            Product of Brightway Group of Companies Global
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-20">
          <h2 className="text-3xl font-bold text-[#00214D] mb-6 text-center">Our Story</h2>
          <div className="flex items-center">
            <div>
              <p className="text-gray-700 mb-4">
                ALL JOBS, a product of Brightway Group of Companies Global, was founded with a vision to revolutionize 
                the job market by creating a unified platform for all types of employment opportunities.
              </p>
              <p className="text-gray-700 mb-4">
                Unlike traditional job platforms that focus on specific sectors, we bridge the gap between white-collar 
                professionals, vocational workers, and freelancers, providing equal opportunities for all.
              </p>
              <p className="text-gray-700 mb-6">
                As part of the Brightway Group, we leverage global expertise to deliver innovative hiring solutions 
                that benefit both job seekers and employers worldwide.
              </p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-6 text-lg rounded-full">
                Learn More About Brightway
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-[#00214D] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
  
      </div>
    </div>
 <Footer/>
 </>
  )
}
"use client"

import {
  Briefcase,
  User,
  Star,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">About ALL JOBS</h1>
            <p className="text-xl font-semibold text-yellow-300 max-w-2xl mx-auto">
              Product of Brightway Group of Companies Global
            </p>
          </section>

          {/* Our Story */}
          <section className="bg-white rounded-2xl shadow-2xl p-10 space-y-6">
            <h2 className="text-3xl font-bold text-[#00214D] text-center">Our Story</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Founded to transform the job market in Ghana and Africa, ALLJOBSGH provides a unique all-in-one platform for various employment opportunities. Unlike conventional job platforms that cater to specific sectors, ALLJOBSGH connects professionals, vocational workers, and freelancers, ensuring equal access for everyone.
              <br /><br />
              The platform utilizes advanced AI tools to streamline job postings, simplify applications, and enable secure communication between employers, job seekers, freelancers, and clients. It also features a resume builder with various templates to help candidates stand out.
              <br /><br />
              Furthermore, ALLJOBSGH delivers recruiting and staffing services to assist major companies and organizations in their hiring efforts across Ghana and Africa. As part of the Brightway Group, we leverage global expertise to deliver innovative hiring solutions.
            </p>
            <div className="text-center">
              <Button
                onClick={() => window.open("http://www.brightwaygroup.org", "_blank")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg rounded-full"
              >
                Learn More About Brightway
              </Button>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-3xl font-bold text-white text-center mb-10">Our Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#00214D] mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

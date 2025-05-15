"use client"

import {
  Briefcase,
  User,
  Star,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from 'next/image';
import BrightWayLogo from "../../public/brightwaylogo.png"

const FEATURES = [
  {
    icon: Briefcase,
    title: "Diverse Job Types",
    description:
      "White-collar, vocational, and professional jobs across industries including IT, Healthcare, Engineering, and more.",
  },
  {
    icon: User,
    title: "Freelancer Accounts",
    description:
      "Special accounts for freelancers to showcase portfolios and find project-based work.",
  },
  {
    icon: Star,
    title: "Premium Job Postings",
    description:
      "Highlight your job listings with premium visibility to attract top talent.",
  },
  {
    icon: CreditCard,
    title: "Flexible Subscriptions",
    description:
      "Affordable plans for job seekers and employers with premium features.",
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#00214D] to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">

          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              About ALLJOBSGH
            </h1>
            <p className="text-xl font-semibold text-yellow-300 max-w-2xl mx-auto">
              Product of Brightway Group of Companies Global
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href="https://brightwaygroup.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={BrightWayLogo}
                  alt="Brightway Group Logo"
                  width={200}
                  height={80}
                  priority
                  loading="eager"
                  className="object-contain"
                />
              </a>
            </div>
          </section>

          {/* Our Story */}
          <section className="bg-white rounded-2xl shadow-2xl p-10 space-y-6">
            <h2 className="text-3xl font-bold text-[#00214D] text-center">Our Story</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Founded to transform the job market in Ghana and Africa, <strong>ALLJOBSGH</strong> provides a unique all-in-one platform for employment opportunities across all sectors. 
              Unlike conventional job boards that focus on specific niches, ALLJOBSGH bridges professionals, vocational workers, and freelancers—ensuring equal access for all.
              <br /><br />
              The platform utilizes AI-powered tools to streamline job postings, simplify applications, and enable secure communication between employers, job seekers, and clients. A powerful resume builder with modern templates helps candidates stand out in competitive markets.
              <br /><br />
              ALLJOBSGH also offers staffing and recruitment services to assist companies and organizations across Ghana and Africa. As part of the Brightway Group, we draw upon global expertise to provide innovative hiring solutions that benefit everyone involved.
            </p>

            <div className="text-center">
              <Button
                onClick={() => window.open("https://brightwaygroup.org", "_blank")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg rounded-full"
              >
                Learn More About The Brightway Group
              </Button>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-3xl font-bold text-white text-center mb-10">Our Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#00214D] mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

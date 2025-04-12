"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

interface Freelancer {
  _id: string
  name: string
  email: string
  profilePicture: string
  profession: string
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-all-freelancers`)
        const data = await res.json()
        setFreelancers(data)
      } catch (err) {
        console.error("Failed to fetch freelancers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFreelancers()
  }, [])

  const handleCardClick = (id: string) => {
    router.push(`/users/${id}`)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white py-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-white">
          <h1 className="text-4xl font-bold text-center mb-12">Our Freelancers</h1>

          {loading ? (
            <p className="text-center text-yellow-300 text-lg">Loading freelancers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {freelancers.map((freelancer) => (
                <div
                  key={freelancer._id}
                  onClick={() => handleCardClick(freelancer._id)}
                  className="cursor-pointer bg-white text-[#00214D] rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-300"
                >
                  <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4 border-4 border-yellow-400">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${freelancer.profilePicture}`}
                      alt={freelancer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{freelancer.name}</h2>
                  <p className="text-gray-600">{freelancer.email}</p>
                  <p className="border-2 rounded-xl p-1 font-bold border-[#00214D]">{freelancer.profession}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

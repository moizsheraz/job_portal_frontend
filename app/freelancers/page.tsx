"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import { Search } from "lucide-react"

interface Freelancer {
  _id: string
  name: string
  email: string
  profilePicture: string
  profession: string
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-all-freelancers`)
        const data = await res.json()
        setFreelancers(data)
        setFilteredFreelancers(data)
      } catch (err) {
        console.error("Failed to fetch freelancers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFreelancers()
  }, [])

  useEffect(() => {
    const results = freelancers.filter(freelancer =>
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.profession.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredFreelancers(results)
  }, [searchTerm, freelancers])

  const handleCardClick = (id: string) => {
    router.push(`/users/${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#00214D] to-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-300">
                Our Freelancers
              </span>
            </h1>
            <p className="text-yellow-100 max-w-2xl mx-auto">
              Find the perfect talent for your next project
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden">
              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by name or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
            </div>
          ) : (
            <>
              {filteredFreelancers.length === 0 ? (
                <div className="text-center text-white py-16">
                  <p className="text-xl">No freelancers found matching "{searchTerm}"</p>
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-6 py-2 bg-yellow-400 text-[#00214D] rounded-full font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFreelancers.map((freelancer) => (
                    <div
                      key={freelancer._id}
                      onClick={() => handleCardClick(freelancer._id)}
                      className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px]"
                    >
                      <div className="bg-[#00214D] h-20"></div>
                      <div className="px-6 pt-0 pb-6 flex flex-col items-center text-center relative">
                        <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4 border-4 border-white mt-[-48px] shadow-md">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${freelancer.profilePicture}`}
                            alt={freelancer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h2 className="text-xl font-bold text-[#00214D] mb-1">{freelancer.name}</h2>
                        <p className="text-gray-500 text-sm mb-3">{freelancer.email}</p>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">
                          {freelancer.profession}
                        </span>
                        <div className="mt-4 w-full">
                          <button className="w-full rounded-xl py-2 bg-yellow-600 text-[#00214D] rounded-lg font-medium group-hover:bg-yellow-300 transition-colors">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
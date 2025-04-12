"use client"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Search, Briefcase, MessageSquare, Shield, ChevronRight, MapPin, TrendingUp, Zap, Users, MessageCircle, PaperclipIcon, Newspaper, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react"

interface StatsData {
  totalJobSeekers: number;
  totalFreelancers: number;
  totalJobsPosted: number;
  totalCompanies: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats-home`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    router.push("/search")
  }

  const handleJobClick = () => {
    router.push("/search");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with improved gradient background */}
        <section className="bg-[#00214D] py-16 md:py-24 relative overflow-hidden">
          {/* Abstract shapes with reduced opacity for better contrast */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {/* Improved badge visibility with darker text */}
                <div className="inline-flex text-white items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-600 font-bold text-red-500">
                  <Zap size={16} className="mr-1" /> 1,000+ Jobs Available Now
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Your Career <span className="text-yellow-400">Evolution</span> Starts Here
                </h1>
                <p className="text-xl text-white">
                  Connecting talented professionals with innovative companies to create the perfect match.
                </p>

                {/* Added Resume Builder Link */}
                <div className="flex items-center gap-4">
                  <Link 
                    href="/build-resume"
                    className="inline-flex gap-2 text-white text-xl  items-center px-6 py-3 bg-yellow-600 font-semibold rounded-xl  hover:opacity-80"
                  >
                    Build Resume <Newspaper/>
                  </Link>
                </div>

                {/* Enhanced Search Bar with improved icon contrast */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-5xl mx-auto">
  <div className="flex flex-col gap-4">
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Your Perfect Job</h3>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
        {/* Job title icon */}
        <div className="flex items-center gap-2 text-gray-700">
          <Briefcase size={18} className="text-yellow-800" />
          <span>Filter by job title</span>
        </div>
        
        {/* Location icon */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={18} className="text-yellow-800" />
          <span>Choose your region</span>
        </div>
        
        {/* Salary icon */}
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-bold text-xl text-yellow-800">₵</span>
          <span>Set salary range</span>
        </div>
      </div>
      
      {/* CTA Button */}
      <a 
        href="/search"
        className="inline-block mt-4 rounded-xl py-3 px-8 bg-yellow-600 hover:bg-yellow-900 transition-colors duration-200 text-white font-medium rounded-md flex items-center justify-center mx-auto"
      >
        <Search size={18} className="mr-2" />
        <span>Explore All Jobs</span>
      </a>
    </div>
  </div>
</div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="text-white font-medium">Trending:</span>
                  {["Remote", "Full-time", "Tech", "Healthcare", "Marketing"].map((tag, index) => (
                    <Link 
                      key={index} 
                      href="#" 
                      className="px-3 py-1 bg-yellow-600 text-white rounded-full border border-yellow-800 hover:bg-yellow-900 hover:border-yellow-900 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Interactive Elements with better contrast */}
              <div className="lg:block relative rounded-lg">
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 relative">
                  {/* Active Job Seekers Card */}
                  <div className="absolute -top-6 -left-6 bg-blue-900 rounded-2xl text-white p-4 shadow-lg flex items-center gap-3 animate-pulse">
                    <Users size={24} />
                    <div>
                      <p className="text-sm font-medium">2,547</p>
                      <p className="text-xs">active now</p>
                    </div>
                  </div>
                  
                  {/* Featured Job Cards */}
                  <div className="space-y-4 mt-6">
                    {[
                      { role: "Senior Developer", company: "TechCorp", salary: "₵120K-₵150K", location: "Remote", new: true },
                      { role: "Marketing Manager", company: "GrowthCo", salary: "₵90K-₵110K", location: "New York, NY", new: false },
                      { role: "UX Designer", company: "CreativeLabs", salary: "₵85K-₵105K", location: "San Francisco, CA", new: true }
                    ].map((job, index) => (
                      <div 
                        key={index} 
                        onClick={handleJobClick}
                        className={`bg-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer border-l-4 border-[#00214D] relative transform hover:-translate-y-1 ${index === 0 ? 'z-30' : index === 1 ? 'z-20 -mt-2 ml-2' : 'z-10 -mt-2 ml-4'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{job.role}</h3>
                              {job.new && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#00214D]">{job.salary}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin size={12} className="mr-1" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Success Metrics */}
                  <div className="mt-8 bg-blue-50 p-4 rounded-xl">
                    <div className="text-center mb-2">
                      <p className="text-sm font-medium text-gray-700">Job Success Rate</p>
                    </div>
                    <div className="flex h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-[#00214D] w-3/4 rounded-l-full"></div>
                      <div className="bg-yellow-600 w-1/6"></div>
                      <div className="bg-orange-400 w-1/12 rounded-r-full"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Hired (75%)</span>
                      <span>Interview (17%)</span>
                      <span>Pending (8%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              {[
                { count: stats?.totalJobSeekers || "2", label: "Job Seekers", icon: Users },
                { count: stats?.totalCompanies || "3", label: "Companies", icon: Briefcase },
                { count: stats?.totalJobsPosted || "3", label: "Jobs Posted", icon: TrendingUp },
                { count: stats?.totalFreelancers || "3", label: "Freelancers", icon: UserCheck }
              
              ].map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-90 p-4 rounded-xl shadow-md">
                  <stat.icon className="mx-auto h-8 w-8 text-[#00214D] mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 mb-4">
                Why choose us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#00214D] mb-4">Redefining How You Find Your Dream Career</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                More than just a job board, we provide tools and resources to help you thrive in your career journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Job Matching",
                  description: "Our AI-powered algorithm matches your skills and preferences with the perfect opportunities.",
                  icon: <Briefcase className="text-[#00214D]" size={32} />,
                  highlight: "93% match accuracy"
                },
                {
                  title: "Secure Communication",
                  description: "Connect directly with employers through our encrypted messaging system for seamless interactions.",
                  icon: <MessageSquare className="text-[#00214D]" size={32} />,
                  highlight: "Fast response time"
                },
                {
                  title: "Protected Payments",
                  description: "Our escrow system ensures freelancers get paid and employers receive quality work as promised.",
                  icon: <Shield className="text-[#00214D]" size={32} />,
                  highlight: "100% money-back guarantee"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00214D] hover:opacity-80 h-full flex flex-col">
                  <div className="w-16 h-16 bg-[#00214D] bg-opacity-10 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <div className="space-y-3 flex-grow">
                    <h3 className="text-xl font-bold text-blue-900">{feature.title}</h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center text-sm font-medium text-blue-700">
                    <span className="px-2 py-1 bg-blue-100 rounded-full text-xs mr-2">{feature.highlight}</span>
                    <Link href="/about" className="flex items-center hover:underline hover:opacity-80">
                      Learn more <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 mb-4">
                Endless Opportunities
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#00214D] mb-4">Explore Jobs by Category</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover your perfect role across industries and specializations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "White-Collar Jobs", icon: "💻", color: "bg-[#00214D] bg-opacity-10 text-[#00214D]", jobs: "5,234" },
                { name: "Vocational Jobs", icon: "📊", color: "bg-purple-100 text-purple-600", jobs: "3,187" },
                { name: "Education", icon: "🎓", color: "bg-indigo-100 text-indigo-600", jobs: "2,318" },
                { name: "Engineering", icon: "⚙️", color: "bg-gray-100 text-gray-600", jobs: "3,547" },
              ].map((category, index) => (
                <Link
                  href="#"
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group border border-gray-100 hover:border-[#00214D] hover:opacity-80 flex flex-col h-full"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg text-[#00214D] group-hover:text-[#00214D] group-hover:opacity-80 transition-colors">{category.name}</h3>
                  <div className="mt-auto pt-4">
                    <Link href="/search" className="text-[#00214D] text-sm font-medium group-hover:underline group-hover:opacity-80 inline-flex items-center">
                      Browse Jobs <ChevronRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 mb-4">
                Success Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#00214D] mb-4">From Our Satisfied Users</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands who have already transformed their careers with ALL JOBS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Senior Developer at TechCorp",
                  image: "/placeholder.svg?height=80&width=80",
                  quote: "I found my dream job at a tech startup within just two weeks of using ALL JOBS. The platform is intuitive and the job matching algorithm is spot on!",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Head of Marketing at GrowthCo",
                  image: "/placeholder.svg?height=80&width=80",
                  quote: "As an employer, I've been able to find qualified candidates quickly. The filtering options and direct messaging feature have saved us so much time in our hiring process.",
                  rating: 5
                },
                {
                  name: "Jessica Williams",
                  role: "Freelance UX Designer",
                  image: "/placeholder.svg?height=80&width=80",
                  quote: "The freelance section of ALL JOBS has transformed my career. I've connected with amazing clients and the secure payment system gives me peace of mind.",
                  rating: 4
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00214D] hover:opacity-80 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex text-yellow-600 mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i}>{i < testimonial.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-6">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center mt-auto pt-4 border-t border-gray-200">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name} Avatar`}
                      width={60}
                      height={60}
                      className="rounded-full border-4 border-white shadow"
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-lg text-[#00214D]">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-[#00214D] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-400 opacity-10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-white border-opacity-20">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                  Ready to Accelerate Your Career?
                </h2>
                <p className="text-xl text-white text-opacity-90 mb-8">
                  Join over 10 million professionals who have already found their dream jobs through our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/search"
                    className="px-8 py-4 bg-yellow-600 text-white font-bold rounded-xl transition duration-200 ease-in-out shadow-lg hover:shadow-xl hover:bg-yellow-900 text-lg"
                  >
                    Browse Jobs
                  </Link>
                </div>
                <p className="text-white text-opacity-80 mt-6 text-sm">
                  Free to join • No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky WhatsApp Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="https://wa.me/1234567890"
          target="_blank"
          className="bg-white p-2 rounded-full shadow-lg  transition-colors duration-200 flex items-center justify-center"
        >
         <img src="./icons8-whatsapp.gif" alt="WhatsApp" width={40} height={40} className="text-white" />
        </Link>
      </div>

      <Footer />
    </div>
  )
}
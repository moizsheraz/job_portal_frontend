"use client"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Search, Briefcase, MessageSquare, Shield, ChevronRight, MapPin, TrendingUp, Zap, Users, MessageCircle, PaperclipIcon, Newspaper, UserCheck, Wrench } from "lucide-react"
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
  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };
  function getDisplayJobsCount(count: number) {
    if (count === 0) return "0";
    const multiplier = 10; // ya 10 bhi kar sakte ho
    const rounded = Math.floor((count + (multiplier - 1)) / multiplier) * multiplier;
    return `${rounded}+`;
  }
  const [featuredJobs, setfeaturedJobs] = useState<any[]>([]);
  useEffect(() => {
    fetchFeaturedJobs();
  }, []);
  const fetchFeaturedJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/get-all-trend`, {
      });
      
      if (response.ok) {
        const data = await response.json();
        setfeaturedJobs(data);
      } else {
        throw new Error('Failed to fetch trending jobs');
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  };

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
                  <Zap size={16} className="mr-1" /> {getDisplayJobsCount(stats?.totalJobsPosted ?? 0)} Jobs Available Now
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
                  {["full-time", "part-time", "Freelance", "internship"].map((tag, index) => (
                    <Link 
                      key={index} 
                      href={`/search?employmentType=${tag}`} 
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
                    {(stats?.totalFreelancers || 0) + (stats?.totalJobSeekers || 0)}
                      <p className="text-xs">active users</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-6">
  {featuredJobs.map((job, index) => (
    <div
      key={job._id}
      onClick={handleJobClick}
      className={`bg-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer border-l-4 border-[#00214D] relative transform hover:-translate-y-1 ${
        index === 0
          ? 'z-30'
          : index === 1
          ? 'z-20 -mt-2 ml-2'
          : 'z-10 -mt-2 ml-4'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{job.title}</h3>
            {/* If you have a "new" property */}
            {job.new && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-[#00214D]">
          ₵{job.salaryMin} - ₵{job.salaryMax}
          </p>
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

        <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#00214D] mb-4">Explore Job Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find opportunities that match your professional background
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* White-Collar Jobs */}
          <div 
            onClick={() => handleCategoryClick("White-Collar Jobs")}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 cursor-pointer"
          >
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#00214D] mb-2">White-Collar Jobs</h3>
                <p className="text-gray-600 mb-4">
                  Professional, administrative, and managerial positions requiring formal education.
                </p>
                <div className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center">
                  View openings
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Vocational Jobs */}
          <div 
            onClick={() => handleCategoryClick("Vocational Jobs")}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-yellow-200 cursor-pointer"
          >
            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <Wrench className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#00214D] mb-2">Vocational Jobs</h3>
                <p className="text-gray-600 mb-4">
                  Skilled trade positions requiring technical training and hands-on expertise.
                </p>
                <div className="text-yellow-600 text-sm font-medium hover:underline inline-flex items-center">
                  View openings
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
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

      <Footer />
    </div>
  )
}


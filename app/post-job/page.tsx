"use client"

import { useState, KeyboardEvent, ChangeEvent, FormEvent, useEffect } from "react"
import { X } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import {createJob } from '@/app/services/JobService'
import { userService } from "../services/userService"
import axios from 'axios'
import { UserData } from "../profile/types"
import PaymentOptionsModal from "@/components/PaymentOptions"

// Type definitions
type JobType = "Onsite" | "Remote" | "Hybrid"
type Category = "White-Collar Jobs" | "Vocational Jobs"
type EmploymentType = "full-time" | "part-time" | "Freelance" | "internship"
type ExperienceLevel = "Entry-level" | "Mid-level" | "Senior"
type Status = "Active" | "Closed"
type SalaryPeriod = "Year" | "Month" | "Week"
type Region = "Ashanti" | "Greater Accra" | "Northern" | "Volta" | "Central" | "Western" | 
              "Upper-West" | "Upper-East" | "Oti" | "Savannah" | "Bono East" | "Western North" | 
              "Brong Ahafo" | "North East" | "Ahafo" | "Eastern"

interface CompanyData {
  name: string
  industry: string
  location: string
  logo?: string
  website: string
  description: string
}
interface SubscriptionPlan {
  _id: string;
  planType: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  name?: string;
  description?: string;
  features?: string[];
  duration?: string;
}

interface FormData {
  jobTitle: string
  region: Region
  city: string
  location?: string // Optional computed property
  salary: string
  salaryType: SalaryPeriod
  isNegotiable: boolean
  jobTypes: JobType[]
  description: string
  tags: string[]
  skills: string[]
  category: Category
  employmentType: EmploymentType
  experience: ExperienceLevel
  company: string
  status: Status
}

// Constants
const JOB_TYPES: JobType[] = ["Onsite", "Remote", "Hybrid"]
const CATEGORIES: Category[] = ["White-Collar Jobs", "Vocational Jobs"]
const EMPLOYMENT_TYPES: EmploymentType[] = ["full-time", "part-time", "Freelance", "internship"]
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry-level", "Mid-level", "Senior"]
const STATUS_OPTIONS: Status[] = ["Active", "Closed"]
const REGIONS: Region[] = [
  "Ashanti", "Greater Accra", "Northern", "Volta", "Central", "Western",
  "Upper-West", "Upper-East", "Oti", "Savannah", "Bono East", "Western North",
  "Brong Ahafo", "North East", "Ahafo", "Eastern"
]

// Props types
interface TagInputProps {
  label: string
  id: keyof Pick<FormData, 'tags' | 'skills'>
  items: string[]
  itemClass: string
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  placeholder: string
}

interface ToggleSwitchProps {
  id: string
  label: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [hasExistingCompany, setHasExistingCompany] = useState(false);
  const [existingCompanyData, setExistingCompanyData] = useState<CompanyData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [currentInput, setCurrentInput] = useState({
    tags: '',
    skills: ''
  });
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
  } | null>(null);

  // Company form state
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    industry: "",
    location: "",
    logo: "https://unsplash-assets.imgix.net/marketing/press-header.jpg?auto=format&fit=crop&q=60",
    website: "",
    description: ""
  });

  // Initial form state
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    region: "Ashanti",
    city: "",
    salary: "",
    salaryType: "Year",
    isNegotiable: false,
    jobTypes: [],
    description: "",
    tags: [],
    skills: [],
    category: "White-Collar Jobs",
    employmentType: "full-time",
    experience: "Mid-level",
    company: "",
    status: "Active"
  })

  // Add useEffect to check for existing company
  useEffect(() => {
    const checkExistingCompany = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-user-company`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          setHasExistingCompany(true);
          setExistingCompanyData(response.data);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setHasExistingCompany(false);
          setExistingCompanyData(null);
        } else {
          console.error('Error fetching company:', error);
          toast.error('Failed to check company status');
          setHasExistingCompany(false);
          setExistingCompanyData(null);
        }
      }
    };

    checkExistingCompany();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        console.log(userData);
        setUser(userData);
    
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, []);

  // Generic handler for text inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // Toggle job types selection
  const handleJobTypeToggle = (type: JobType) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter(t => t !== type)
        : [...prev.jobTypes, type]
    }))
  }
  

  // Handle tag-like inputs
  const handleTagInput = (field: keyof Pick<FormData, 'tags' | 'skills'>, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = currentInput[field].trim();
      
      if (value) {
        setFormData(prev => ({
          ...prev,
          [field]: [...new Set([...prev[field], value])]
        }));
        setCurrentInput(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
  };

  // Handle input change for tags and skills
  const handleInputChange = (field: keyof Pick<FormData, 'tags' | 'skills'>, value: string) => {
    setCurrentInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Remove a tag or skill
  const handleRemoveItem = (field: keyof Pick<FormData, 'tags' | 'skills'>, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }))
  }
 

  // Form submission
 

  // Handle company form changes
  const handleCompanyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    const newValue = name === "logo" 
      ? value.trim() === "" 
        ? "https://unsplash-assets.imgix.net/marketing/press-header.jpg?auto=format&fit=crop&q=60"
        : value
      : value;
  
    setCompanyData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-all-sub`)
        const data = await response.json()
        
        if (data.success) {
          const mappedPlans = data.data.map((plan: SubscriptionPlan) => ({
            ...plan,
            name: getPlanName(plan.planType),
            description: getPlanDescription(plan.planType),
            features: getPlanFeatures(plan.planType),
            duration: getPlanDuration(plan.planType)
          }))
          setSubscriptionPlans(mappedPlans)
        } else {
          throw new Error('Failed to fetch subscription plans')
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error)
        // Fallback to default plans if API fails
        setSubscriptionPlans([
          {
            _id: 'default-monthly',
            planType: 'monthly',
            price: 150,
            name: 'Monthly Subscription',
            description: 'Post unlimited jobs for a month',
            features: ['Unlimited job postings', 'Premium job visibility', 'Candidate management'],
            duration: '30 days',
            createdAt: "",
            updatedAt: "",
            __v: 0
          },
          {
            _id: 'default-quarterly',
            planType: 'quarterly',
            price: 400,
            name: 'Quarterly Subscription',
            description: 'Post unlimited jobs for 3 months',
            features: ['Unlimited job postings', 'Premium job visibility', 'Candidate management', 'Analytics dashboard'],
            duration: '90 days',
            createdAt: "",
            updatedAt: "",
            __v: 0
          },
          {
            _id: 'default-yearly',
            planType: 'yearly',
            price: 1200,
            name: 'Yearly Subscription',
            description: 'Post unlimited jobs for a year',
            features: ['Unlimited job postings', 'Premium job visibility', 'Candidate management', 'Analytics dashboard', 'Priority support'],
            duration: '365 days',
            createdAt: "",
            updatedAt: "",
            __v: 0
          }
        ])
      }
    }
  
    fetchSubscriptionPlans()
  }, [])
  const getPlanName = (planType: string): string => {
    switch (planType) {
      case 'monthly': return 'Monthly Subscription'
      case 'quarterly': return 'Quarterly Subscription'
      case 'yearly': return 'Yearly Subscription'
      default: return 'Subscription Plan'
    }
  }
  
  const getPlanDescription = (planType: string): string => {
    switch (planType) {
      case 'monthly': return 'Post unlimited jobs for a month'
      case 'quarterly': return 'Post unlimited jobs for 3 months'
      case 'yearly': return 'Post unlimited jobs for a year'
      default: return 'Premium subscription plan'
    }
  }
  
  const getPlanFeatures = (planType: string): string[] => {
    const baseFeatures = ['Unlimited job postings', 'Candidate management']
    switch (planType) {
      case 'monthly': return [...baseFeatures, 'Basic analytics']
      case 'quarterly': return [...baseFeatures, 'Advanced analytics', 'Priority support']
      case 'yearly': return [...baseFeatures, 'Advanced analytics', 'Priority support', 'Featured job slots']
      default: return baseFeatures
    }
  }
  
  const getPlanDuration = (planType: string): string => {
    switch (planType) {
      case 'monthly': return '30 days'
      case 'quarterly': return '90 days'
      case 'yearly': return '365 days'
      default: return '30 days'
    }
  }
  
  const handleOneTimePayment = () => {
    setShowPaymentOptions(false)
    // Proceed with one-time payment logic
    localStorage.setItem('formData', JSON.stringify(formData))
    localStorage.setItem('companyData', JSON.stringify(companyData))
    localStorage.setItem('hasExistingCompany', JSON.stringify(hasExistingCompany))
    localStorage.setItem('amount', '50')
    router.push('/payment-redirect?purpose=job-post')
  }
  
  const handleSubscriptionSelected = (plan: SubscriptionPlan) => {
    setShowPaymentOptions(false)
    // Redirect to subscription payment
    localStorage.setItem('planId', plan._id)
    router.push(`/payment-redirect?purpose=BuySubscriptionAndPostJob`)
  }
  
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    if (!user) {
      toast.error('Please log in to post a job')
      return
    }
    
    const hasActiveSubscription = user?.subscription && 
                                user?.subscription.startDate && 
                                user?.subscription.endDate && 
                                new Date(user?.subscription.endDate) > new Date()

    if (hasActiveSubscription) {
      const jobData = {
        ...formData,
        title: formData.jobTitle,
        location: `${formData.region}, ${formData.city}`
      }
      await createJob(jobData, hasExistingCompany ? undefined : companyData)
      toast.success('Job posted successfully! Redirecting to homepage...')
      router.push('/')
    } else {
      // No subscription - show payment options
      setShowPaymentOptions(true)
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to process job posting')
  } finally {
    setIsLoading(false)
  }
}
  

  const handleCompanyTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  // Toggle switch component
  const ToggleSwitch = ({ id, label, checked, onChange }: ToggleSwitchProps) => (
    <div className="flex items-center my-4">
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input 
            type="checkbox" 
            id={id} 
            name={id}
            className="sr-only" 
            checked={checked}
            onChange={onChange}
          />
          <div className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-300 ${
            checked ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          } top-0.5`}></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
      </label>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#00214D]">
      <Navbar />
      
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10 text-center font-sans">
            Post a New Job
          </h1>
         
            <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-100">
              <div className="space-y-8">
                {/* Company Details Section */}
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-yellow-600 text-white text-sm font-medium mr-2 px-3 py-1 rounded-full">1</span>
                    Company Details
                  </h2>
                  {hasExistingCompany ? (
                    <div className="bg-gray-50 font-bold p-4 rounded-lg">
                      <p className="text-gray-700">Posting job for: <span className="font-semibold">{existingCompanyData?.name}</span></p>
                      <p className="text-gray-600 text-sm mt-1">{existingCompanyData?.industry} • {existingCompanyData?.location}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      {/* Company form fields */}
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="name"
                          value={companyData.name}
                          onChange={handleCompanyInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all shadow-sm"
                          placeholder="Enter company name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                          Industry
                        </label>
                        <input
                          type="text"
                          id="industry"
                          name="industry"
                          value={companyData.industry}
                          onChange={handleCompanyInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all shadow-sm"
                          placeholder="e.g. Technology, Healthcare"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Location
                        </label>
                        <input
                          type="text"
                          id="companyLocation"
                          name="location"
                          value={companyData.location}
                          onChange={handleCompanyInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all shadow-sm"
                          placeholder="e.g. Bono East, Ghana"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Logo URL (optional)
                        </label>
                        <input
                          type="url"
                          id="logo"
                          name="logo"
                          value={companyData.logo === "https://unsplash-assets.imgix.net/marketing/press-header.jpg?auto=format&fit=crop&q=60" ? "" : companyData.logo}
                          onChange={handleCompanyInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all shadow-sm"
                          placeholder="Leave empty for default placeholder"
                        />
                        {/* Hidden input to store the actual value */}
                        <input
                          type="hidden"
                          name="actualLogo"
                          value={companyData.logo}
                        />
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Website {"(optional)"}
                        </label>
                          <input
                          type="url"
                          id="website"
                          name="website"
                          value={companyData.website}
                          onChange={handleCompanyInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all shadow-sm"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={companyData.description}
                          onChange={handleCompanyTextAreaChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all shadow-sm"
                          placeholder="Brief description of your company"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Details Section */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-yellow-600 text-white text-sm font-medium mr-2 px-3 py-1 rounded-full">
                      {hasExistingCompany ? "1" : "2"}
                    </span>
                    Job Details
                  </h2>
                  
                  {/* Job Title */}
                  <div className="mb-6">
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="e.g. Senior Software Engineer"
                      required
                    />
                  </div>

                  {/* Location and Salary in a responsive grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                          Region
                        </label>
                        <select
                          id="region"
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                        >
                          {REGIONS.map(region => (
                            <option key={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                          placeholder="Enter city"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                        Salary
                      </label>
                      <div className="flex shadow-sm rounded-xl overflow-hidden">
                        <input
                          type="number"
                          id="salary"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          className="w-2/3 px-4 py-3 border border-r-0 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-l-xl"
                          placeholder="e.g. 75000"
                          required
                        />
                        <select
                          id="salaryType"
                          name="salaryType"
                          value={formData.salaryType}
                          onChange={handleChange}
                          className="w-1/3 px-4 py-3 border border-l-0 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 rounded-r-xl"
                        >
                          <option>Year</option>
                          <option>Month</option>
                          <option>Week</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Negotiable Toggle */}
                  <ToggleSwitch 
                    id="isNegotiable" 
                    label="Salary Negotiable" 
                    checked={formData.isNegotiable} 
                    onChange={handleChange} 
                  />

                  {/* Job Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <div className="flex flex-wrap gap-3">
                      {JOB_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleJobTypeToggle(type)}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                            formData.jobTypes.includes(type)
                              ? "bg-yellow-600 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="Describe the job role, responsibilities, qualifications, and benefits..."
                      required
                    ></textarea>
                  </div>

                  {/* Tags and Skills in a responsive grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('tags', tag)}
                              className="ml-1 hover:text-red-700 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={currentInput.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        onKeyDown={(e) => handleTagInput('tags', e)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all text-sm"
                        placeholder="Add tags and press Enter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills Required
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                        {formData.skills.map((skill) => (
                          <span key={skill} className="bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('skills', skill)}
                              className="ml-1 hover:text-red-700 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={currentInput.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        onKeyDown={(e) => handleTagInput('skills', e)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-900 focus:border-transparent transition-all text-sm"
                        placeholder="Add skills and press Enter"
                      />
                    </div>
                  </div>

                  {/* Job Categorization */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
                    <h3 className="text-base font-medium text-gray-800 mb-4">Job Categorization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm"
                        >
                          {CATEGORIES.map(category => (
                            <option key={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
                          Employment Type
                        </label>
                        <select
                          id="employmentType"
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm"
                        >
                          {EMPLOYMENT_TYPES.map(type => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                          Experience Level
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm"
                        >
                          {EXPERIENCE_LEVELS.map(level => (
                            <option key={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                          Job Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm"
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Company field - removed as it's redundant with the company section above */}
                  <div className="hidden">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
  type="submit"
  disabled={isLoading || !user}
  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-yellow-600 text-white font-medium hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
>
  {isLoading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Posting...
    </>
  ) : (
    'Post Job'
  )}
</button>
              </div>
            </form>
          
        </div>
      </main>
      <PaymentOptionsModal
  isOpen={showPaymentOptions}
  onClose={() => setShowPaymentOptions(false)}
  onOneTimePayment={handleOneTimePayment}
  onSubscriptionSelected={handleSubscriptionSelected}
  subscriptionPlans={subscriptionPlans}
/>
      <Footer />
    </div>
  )
}
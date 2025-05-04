"use client"
import React, { useState, useEffect,Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Search, MapPin, Filter, Briefcase, Calendar, DollarSign, Award, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Define TypeScript interfaces
interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  region: string;
  city: string;
  salary: string;
  salaryType: string;
  negotiable: boolean;
  employmentType: string;
  tags?: string[];
  applicants?: { length: number };
  company?: {
    name: string;
    logo?: string;
  };
  skillsRequired: string[];
  category: string;
  experience: string;
  postedBy: string;
  status: "active" | "closed";
  shortlistedCandidates?: string[];
  createdAt: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  count: number;
} 

interface FilterState {
  search: string;
  location: string;
  category: string;
  employmentType: string;
  experience: string;
  salaryMin: string;
  salaryMax: string;
  sort: string;
  region: string;
  city: string;
}

interface JobsApiResponse {
  success: boolean;
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  count: number;
  message?: string;
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobPageContent />
    </Suspense>
  );
}

function JobPageContent(){
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>({
      currentPage: 1,
      totalPages: 1,
      totalJobs: 0,
      count: 0,
    });
    const [filters, setFilters] = useState<FilterState>({
      search: "",
      location: "",
      category: "",
      employmentType: "",
      experience: "",
      salaryMin: "",
      salaryMax: "",
      sort: "-createdAt",
      region: "",
      city: "",
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
  
    // Job categories
    const categories: string[] = [
      "White-Collar Jobs",
      "Vocational Jobs"
    ];
  
    // Job types
    const jobTypes: string[] = ["full-time", "part-time", "Freelance", "internship"];
  
    const searchParams = useSearchParams();
    const router = useRouter();
  
    const experienceLevels: string[] = ["Entry Level", "Mid Level", "Senior Level", "Executive", "Internship"];
  
  useEffect(() => {
    const queryParams = new URLSearchParams(searchParams.toString());
    
    const updatedFilters = {
      search: queryParams.get("search") || "",
      location: queryParams.get("location") || "",
      category: queryParams.get("category") || "",
      employmentType: queryParams.get("employmentType") || "",
      experience: queryParams.get("experience") || "",
      salaryMin: queryParams.get("salaryMin") || "",
      salaryMax: queryParams.get("salaryMax") || "",
      sort: queryParams.get("sort") || "-createdAt",
      region: queryParams.get("region") || "",
      city: queryParams.get("city") || "",
    };
  
    setFilters(updatedFilters);
   
    fetchJobs(updatedFilters);
  }, [searchParams]);
  
  const fetchJobs = async (customFilters?: FilterState): Promise<void> => {
    setLoading(true);
    try {
      // Use custom filters if provided, otherwise use component state filters
      const activeFilters = customFilters || filters;
      
      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      queryParams.append("page", pagination.currentPage.toString());
      queryParams.append("sort", activeFilters.sort);
      
      // Add filters to query parameters if they exist
      if (activeFilters.search) queryParams.append("search", activeFilters.search);
      if (activeFilters.location) queryParams.append("location", activeFilters.location);
      if (activeFilters.category) queryParams.append("category", activeFilters.category);
      if (activeFilters.employmentType) queryParams.append("employmentType", activeFilters.employmentType);
      if (activeFilters.experience) queryParams.append("experience", activeFilters.experience);
      if (activeFilters.salaryMin) queryParams.append("salaryMin", activeFilters.salaryMin);
      if (activeFilters.salaryMax) queryParams.append("salaryMax", activeFilters.salaryMax);
      if (activeFilters.region) queryParams.append("region", activeFilters.region);
      if (activeFilters.city) queryParams.append("city", activeFilters.city);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs?${queryParams.toString()}`, {
        credentials: 'include'
      });
      const data: JobsApiResponse = await response.json();
  
      if (data.success) {
        setJobs(data.jobs);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalJobs: data.totalJobs,
          count: data.count,
        });
      } else {
        console.error("Failed to fetch jobs:", data.message);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Update URL with current filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });
    
    router.push(`?${queryParams.toString()}`);
    
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchJobs();
  };
  
  const clearFilters = (): void => {
    const newFilters = {
      search: "",
      location: "",
      category: "",
      employmentType: "",
      experience: "",
      salaryMin: "",
      salaryMax: "",
      sort: "-createdAt",
      region: "",
      city: "",
    };
    
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    
    // Update URL
    router.push(`?sort=-createdAt`);
    
    // Fetch jobs
    fetchJobs(newFilters);
  };
  
    const changePage = (newPage: number): void => {
      if (newPage > 0 && newPage <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <section className="bg-[#00214D] py-16 md:py-24 rounded-b-[3rem] relative overflow-hidden">
    <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
          Find Your Dream Job
        </h1>
        <p className="text-white text-opacity-90 text-xl md:text-2xl font-light">
          Browse through <span className="font-bold">{pagination.totalJobs.toLocaleString()}</span> open positions
        </p>
      </div>
  
      <form onSubmit={handleFilterSubmit} className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Job Title Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Job title, keywords, or company"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800"
        />
      </div>
  
      {/* City Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="City"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800"
        />
      </div>
  
      {/* Region Input */}
      <div className="relative">
    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    <select
      name="region"
      value={filters.region}
      onChange={handleFilterChange}
      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800 appearance-none"
    >
      <option value="" disabled>Select a Region</option>
      <option value="Ashanti">Ashanti</option>
      <option value="Greater Accra">Greater Accra</option>
      <option value="Northern">Northern</option>
      <option value="Volta">Volta</option>
      <option value="Central">Central</option>
      <option value="Western">Western</option>
      <option value="Upper-West">Upper-West</option>
      <option value="Upper-East">Upper-East</option>
      <option value="Oti">Oti</option>
      <option value="Savannah">Savannah</option>
      <option value="Bono East">Bono East</option>
      <option value="Western North">Western North</option>
      <option value="Brong Ahafo">Brong Ahafo</option>
      <option value="North East">North East</option>
      <option value="Ahafo">Ahafo</option>
      <option value="Eastern">Eastern</option>
    </select>
  </div>
  
  
      {/* Buttons */}
      <div className="flex space-x-2">
      <button
    type="submit"
    className="bg-yellow-600 hover:bg-yellow-900 text-white font-medium rounded-lg px-5 py-3 transition duration-200 flex-grow flex items-center justify-center gap-2"
  >
    <Search size={18} className="mr-1" />
    <span>Search Jobs</span>
  </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-100 hover:bg-gray-200 text-yellow-800 font-medium rounded-lg p-3 transition duration-200 flex items-center justify-center border border-yellow-800/20"
          aria-label="Toggle filters"
        >
          <Filter size={18} />
        </button>
      </div>
    </div>
  
    {/* Advanced Filters */}
    {showFilters && (
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <div className="relative">
              <select
                name="employmentType"
                value={filters.employmentType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800 appearance-none"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <div className="relative">
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800 appearance-none"
              >
                <option value="">Any Experience</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="relative">
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800 appearance-none"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-salary">Highest Salary</option>
                <option value="salary">Lowest Salary</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
  
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  name="salaryMin"
                  value={filters.salaryMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full pl-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  name="salaryMax"
                  value={filters.salaryMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full pl-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-800 focus:border-yellow-800"
                />
              </div>
            </div>
          </div>
  
          <div className="md:col-span-2 flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-yellow-800 hover:text-yellow-900 font-medium flex items-center px-3 py-2 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
            >
              <X size={16} className="mr-1" /> Clear Filters
            </button>
          </div>
        </div>
      </div>
    )}
  </form>
    </div>
  </section>
  
          {/* Job Listings Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Results header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {loading ? "Searching Jobs..." : `${pagination.count} Jobs Found`}
                  </h2>
                  <p className="text-gray-600">
                    {pagination.totalJobs > 0
                      ? `Showing ${(pagination.currentPage - 1) * 10 + 1}-${
                          Math.min(pagination.currentPage * 10, pagination.totalJobs)
                        } of ${pagination.totalJobs} jobs`
                      : "No jobs found matching your criteria"}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">Active Filters:</span>
                  {Object.entries(filters).map(
                    ([key, value]) =>
                      value && key !== "sort" && (
                        <span
                          key={key}
                          className="bg-yellow-600 text-white font-bold text-xs rounded-full px-3 py-1 flex items-center"
                        >
                          {key === "salaryMin"
                            ? `Min $${value}`
                            : key === "salaryMax"
                            ? `Max $${value}`
                            : value}
                       <X
  size={14}
  className="ml-1 cursor-pointer"
  onClick={() => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue) queryParams.set(filterKey, filterValue);
    });
    router.push(`?${queryParams.toString()}`);
    
    fetchJobs(newFilters);
  }}
/>
                        </span>
                      )
                  )}
                </div>
              </div>
  
              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              )}
  
              {/* Jobs list */}
              {!loading && jobs.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Jobs Found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any jobs matching your search criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:opacity-70"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
  
              {!loading && jobs.length > 0 && (
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center">
                          {/* Company logo */}
                          <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden relative">
                              {job.company?.logo ? (
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${job.company.logo}`}
                                  alt={job.company.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              ) : (
                                <Briefcase
                                  className="text-gray-400 w-full h-full p-3"
                                  size={64}
                                />
                              )}
                            </div>
                          </div>
  
                          {/* Job details */}
                          <div className="flex-grow ">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2">
                                  <span className="flex items-center mr-4">
                                    <Briefcase size={14} className="mr-1" />
                                    {job.company?.name || "Company"}
                                  </span>
                                  <span className="flex items-center mr-4">
                                    <MapPin size={14} className="mr-1" />
                                    {job.location || "Location not specified"}
                                  </span>
                                  <span className="flex items-center mr-4">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                          
                            </div>
  
                            {/* Additional details */}
                            <div className="mt-3 flex flex-wrap gap-y-2">
                              {job.salary && (
                                <div className="mr-4 flex items-center text-sm">
                                  <DollarSign size={14} className="mr-1 text-gray-500" />
                                  <span className="font-medium text-gray-900">
                                    {job.negotiable ? "Negotiable" : `$${job.salary}/${job.salaryType}`}
                                  </span>
                                </div>
                              )}
                              {job.experience && (
                                <div className="mr-4 flex items-center text-sm">
                                  <Award size={14} className="mr-1 text-gray-500" />
                                  <span>{job.experience}</span>
                                </div>
                              )}
                              {job.applicants && (
                                <div className="mr-4 flex items-center text-sm text-gray-600">
                                  <span>{job.applicants.length} applicants</span>
                                </div>
                              )}
                              {job.status === "closed" && (
                                <div className="mr-4 flex items-center text-sm text-red-600">
                                  <span>Position Closed</span>
                                </div>
                              )}
                            </div>
  
                            {/* Skills Required */}
                            {job.skillsRequired && job.skillsRequired.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {job.skillsRequired.slice(0, 5).map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.skillsRequired.length > 5 && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    +{job.skillsRequired.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
  
                          {/* Apply button */}
                          <div className="mt-4 md:mt-0 md:ml-4 flex justify-end">
                            <Link
                              href={`/jobs/${job._id}`}
                              className="inline-flex bg-yellow-600 items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-900 hover:opacity-80 focus:outline-none"
                            >
                              View Details
                              <ChevronRight size={16} className="ml-1" />
                            </Link>
                          </div>
                        </div>
  
                        {/* Short description */}
                        {job.description && (
                          <div className="mt-4 text-gray-600 text-sm line-clamp-2">
                            {job.description.substring(0, 200)}
                            {job.description.length > 200 ? "..." : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
  
              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="mt-10 flex justify-between items-center">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      pagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>
  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                      )
                      .map((page, i, arr) => (
                        <React.Fragment key={`page-${page}`}>
                          {i > 0 && arr[i - 1] !== page - 1 && (
                            <span key={`ellipsis-${i}`} className="px-3 py-2">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => changePage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-md ${
                              pagination.currentPage === page
                                ? "bg-blue-900 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>
  
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
  
        <Footer />
      </div>
  )
}
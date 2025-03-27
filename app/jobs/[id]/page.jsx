'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Briefcase, Calendar, Tag, Building, 
  DollarSign, Users, Star, Share2, Bookmark, Send, X, Check
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { getJob } from '@/app/services/JobService';
import { toast ,Toaster} from 'react-hot-toast';
import { userService } from '@/app/services/userService';
import axios from 'axios';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    }
  })
};

export default function JobDetails({ params }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        console.log(userData);
        setUser(userData);
        // Check if job is saved
        if (userData?.savedJobs?.includes(params.id)) {
          setBookmarked(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, [params.id]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await getJob(params.id);
        setJobData(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [params.id]);

  const canApply = (job) => {
    if (!user) return false;
    if (job.status === "closed") return false;
    
    // Check if already applied
    if (user.appliedJobs?.includes(job._id)) return false;
    
    // Check role-based restrictions
    if (user.role === "freelancer" && job.category === "White-Collar Jobs") return false;
    if (user.role === "jobseeker" && job.employmentType === "Freelance") return false;
    
    return true;
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      return;
    }
  
    setApplyLoading(true);
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${params.id}/apply`, 
        null, 
        { withCredentials: true }
      );
  
      // Accept both 200 and 201 status codes
      if (response.status >= 200 && response.status < 300) {
        // Update job data to reflect new applicant
        setJobData(prev => ({
          ...prev,
          applicants: { length: (prev.applicants?.length || 0) + 1 }
        }));
  
        toast.success('Successfully applied for the job!');
      } else {
        throw new Error(response.data.message || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to apply for job');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }

    setSaveLoading(true);
    try {
      const endpoint = bookmarked ? 'unsave-job' : 'save-job';
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${endpoint}/${params.id}`,
        null,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBookmarked(!bookmarked);
        toast.success(bookmarked ? 'Job removed from saved jobs' : 'Job saved successfully');
      }
    } catch (error) {
      console.error('Save job error:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
       
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-700"></div>
        </div>
      </>
    );
  }

  if (error || !jobData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Job</h2>
          <p className="text-gray-300 mb-4">{error || 'Failed to load job details'}</p>
          <Link href="/jobs" className="text-yellow-500 hover:text-yellow-400">
            Return to Jobs
          </Link>
        </div>
      </>
    );
  }

  const formattedDate = new Date(jobData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
    <Navbar/>
    <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            borderRadius: '10px',
          },
          success: {
            style: {
              background: 'white',
              color: 'black',
            },
          },
          error: {
            style: {
              background: 'white',
              color: 'black',
            },
          },
        }}
      />
    <div className="min-h-screen ">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-yellow-600/10 blur-3xl rounded-full -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 blur-3xl rounded-full translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back button */}
        <Link href="/jobs" className="inline-flex items-center text-white hover:text-yellow-300 mb-8 transition-colors group">
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Jobs</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeIn}
              className="bg-[#00214D] text-white rounded-xl p-8 shadow-xl border border-[#0047ab]/20"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <div className="bg-yellow-600 inline-block px-3 py-1 rounded-full text-xs font-medium mb-4">
                    {jobData.category}
                  </div>
                  <h1 className="text-3xl font-bold mb-4 leading-tight">{jobData.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-yellow-500" />
                      {jobData.company?.name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
                      {jobData.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-yellow-500" />
                      {jobData.employmentType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveJob}
                    disabled={saveLoading}
                    className={`p-3 rounded-full transition-colors ${
                      bookmarked ? 'bg-yellow-600 text-white' : 'bg-[#003b8a] text-gray-300 hover:bg-[#004db3]'
                    }`}
                  >
                    {saveLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center rounded-xl px-4 py-2 bg-[#003b8a]/50">
                  <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-300">Salary</p>
                    <p className="font-medium">{jobData.salary} {jobData.salaryType && `/ ${jobData.salaryType.toLowerCase()}`}</p>
                  </div>
                </div>
                <div className="flex items-center rounded-xl px-4 py-2 bg-[#003b8a]/50">
                  <Briefcase className="h-5 w-5 mr-2 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-300">Experience</p>
                    <p className="font-medium">{jobData.experience}</p>
                  </div>
                </div>
                <div className="flex items-center rounded-xl px-4 py-2 bg-[#003b8a]/50">
                  <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-300">Posted</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeIn}
              className="bg-[#00214D] text-white rounded-xl p-8 shadow-xl border border-[#0047ab]/20"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-yellow-500" />
                Job Description
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="mb-6 text-gray-300">{jobData.description || "No description provided."}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.skillsRequired?.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-[#003b8a]/60 rounded-xl text-sm font-medium hover:bg-[#004db3]/60 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Application section */}
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeIn}
              className="bg-[#00214D] text-white rounded-xl p-8 shadow-xl border border-[#0047ab]/20"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Send className="h-5 w-5 mr-2 text-yellow-500" />
                Apply for this position
              </h2>
              
              {applyError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  {applyError}
                </div>
              )}
              
              {!showApplyForm ? (
                <>
                  <p className="mb-6 text-gray-300">
                    Ready to take the next step in your career? Submit your application now to join {jobData.company?.name} as a {jobData.title}.
                  </p>
                  {canApply(jobData) ? (
                    <button 
                      onClick={handleApply}
                      disabled={applyLoading}
                      className="px-6 py-3 bg-yellow-600 rounded-xl text-white font-medium hover:opacity-80 transition-colors flex items-center"
                    >
                      {applyLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Applying...
                        </>
                      ) : (
                        <>
                          Apply Now
                          <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <button 
                        disabled
                        className="w-full px-6 py-3 bg-gray-700 rounded-xl text-gray-300 font-medium cursor-not-allowed flex items-center justify-center relative group"
                      >
                        <div className="absolute inset-0 bg-yellow-600/20 rounded-xl"></div>
                        <span className="relative z-10 flex items-center">
                          {!user ? (
                            <>
                              <Users className="mr-2 h-5 w-5" />
                              Login to Apply
                            </>
                          ) : jobData.status === "closed" ? (
                            <>
                              <X className="mr-2 h-5 w-5" />
                              Position Closed
                            </>
                          ) : user.appliedJobs?.includes(jobData._id) ? (
                            <>
                              <Check className="mr-2 h-5 w-5" />
                              Already Applied
                            </>
                          ) : user.role === "freelancer" ? (
                            <>
                              <Briefcase className="mr-2 h-5 w-5" />
                              Freelancers Cannot Apply to White-Collar Jobs
                            </>
                          ) : user.role === "jobseeker" ? (
                            <>
                              <Briefcase className="mr-2 h-5 w-5" />
                              Job Seekers Cannot Apply to Freelance Jobs
                            </>
                          ) : (
                            <>
                              <X className="mr-2 h-5 w-5" />
                              Not Eligible to Apply
                            </>
                          )}
                        </span>
                      </button>
                      <p className="text-sm text-gray-400 text-center">
                        {!user ? "Please sign in to apply for this position" :
                         jobData.status === "closed" ? "This position is no longer accepting applications" :
                         user.appliedJobs?.includes(jobData._id) ? "You have already applied for this position" :
                         user.role === "freelancer" ? "Freelancers are restricted from applying to white-collar positions" :
                         user.role === "jobseeker" ? "Job seekers are restricted from applying to freelance positions" :
                         "You do not meet the requirements for this position"}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company info */}
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeIn}
              className="bg-[#00214D] text-white rounded-xl p-6 shadow-xl border border-[#0047ab]/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Company</h2>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-[#003b8a] rounded-lg flex items-center justify-center text-2xl font-bold mr-4">
                  {jobData.company?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{jobData.company?.name}</h3>
                  <p className="text-gray-300 text-sm">{jobData.company?.industry}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Location</span>
                  <span className="font-medium">{jobData.company?.location}</span>
                </div>
                {jobData.company?.website && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Website</span>
                    <a href={jobData.company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-yellow-500 hover:text-yellow-400">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            
            </motion.div>

            {/* Job Insights */}
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeIn}
              className="bg-[#00214D] text-white rounded-xl p-6 shadow-xl border border-[#0047ab]/20"
            >
              <h2 className="text-xl font-bold mb-4">Job Insights</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Application Activity</span>
                    <span className="text-xs font-medium bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded">
                      {jobData.applicants?.length > 10 ? 'High' : jobData.applicants?.length > 5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="w-full bg-[#001530] rounded-full h-2.5">
                    <div 
                      className="bg-yellow-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min((jobData.applicants?.length || 0) * 10, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="text-sm text-gray-300">Total applicants</span>
                  </div>
                  <span className="font-medium">{jobData.applicants?.length || 0}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
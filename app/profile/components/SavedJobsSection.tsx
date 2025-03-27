"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { SavedJobsSectionProps } from "../types"
import { Loader2Icon } from "lucide-react"
import { getJob } from "@/app/services/JobService"
import { useEffect, useState } from "react"
import { Job } from "@/app/services/JobService"

export default function SavedJobsSection({ user, handleRemoveSavedJob, isLoading }: SavedJobsSectionProps) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const jobs = await Promise.all(
          user.savedJobs.map(async (jobId) => { // Changed from job to jobId
            try {
              return await getJob(jobId); // Changed from job._id to jobId
            } catch (error) {
              console.error(`Error fetching job ${jobId}:`, error);
              return null;
            }
          })
        );
        setSavedJobs(jobs.filter((job): job is Job => job !== null));
      } catch (error) {
        setError('Failed to fetch saved jobs');
      } finally {
        setLoading(false);
      }
    };

    if (user.savedJobs?.length) {
      fetchSavedJobs();
    } else {
      setLoading(false);
    }
  }, [user.savedJobs]);

  // Rest of the component remains the same...
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Loader2Icon className="h-5 w-5 animate-spin text-yellow-500" />
          <span className="text-gray-600">Loading saved jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6"
    >
      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">{job.title}</h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleRemoveSavedJob(job._id)}
                    className="text-red-500 hover:text-red-600 text-sm disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      'Remove'
                    )}
                  </button>
                  <Link
                    href={`/jobs/${job._id}`}
                    className="text-yellow-600 hover:text-yellow-700 text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any saved jobs.</p>
          <Link 
            href="/jobs" 
            className="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </motion.div>
  );
}
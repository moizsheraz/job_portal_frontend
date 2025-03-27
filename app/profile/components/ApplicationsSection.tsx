"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Check, Loader2Icon } from 'lucide-react';
import { UserData } from '../types';
import { getJob } from '@/app/services/JobService';
import { Job } from '@/app/services/JobService';

interface ApplicationsSectionProps {
  user: UserData;
}

export default function ApplicationsSection({ user }: ApplicationsSectionProps) {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const jobs = await Promise.all(
          user.appliedJobs.map(async (jobId: string) => {
            try {
              return await getJob(jobId);
            } catch (error) {
              console.error(`Error fetching job ${jobId}:`, error);
              return null;
            }
          })
        );
        setAppliedJobs(jobs.filter((job): job is Job => job !== null));
      } catch (error) {
        setError('Failed to fetch applied jobs');
      } finally {
        setLoading(false);
      }
    };

    if (user.appliedJobs?.length) {
      fetchAppliedJobs();
    } else {
      setLoading(false);
    }
  }, [user.appliedJobs]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Loader2Icon className="h-5 w-5 animate-spin text-yellow-500" />
          <span className="text-gray-600">Loading applied jobs...</span>
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

  if (!appliedJobs.length) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-gray-500">No job applications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appliedJobs.map((job) => (
        <div key={job._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium text-gray-800">{job.title}</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Applied
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <Link
                href={`/jobs/${job._id}`}
                className="text-yellow-600 hover:text-yellow-700 text-sm ml-4"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
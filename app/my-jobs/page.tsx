'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Building, MapPin, Calendar, DollarSign, 
  Users, ArrowRight, Search, Filter, Trash2, Edit2, X
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  region: string;
  city: string;
  salary: string;
  salaryType: string;
  negotiable: boolean;
  jobType: string[];
  description: string;
  tags: string[];
  applicants: any[];
  skillsRequired: string[];
  category: string;
  employmentType: string;
  experience: string;
  postedBy: string;
  status: string;
  shortlistedCandidates: any[];
  createdAt: string;
}

interface EditModalProps {
  job: Job;
  onClose: () => void;
  onSave: (jobId: string, updatedData: Partial<Job>) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: job.title,
    location: job.location,
    region: job.region,
    city: job.city,
    salary: job.salary,
    salaryType: job.salaryType,
    description: job.description,
    category: job.category,
    employmentType: job.employmentType,
    experience: job.experience,
    skillsRequired: job.skillsRequired.join(', '),
    tags: job.tags.join(', ')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim())
      };
      await onSave(job._id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#00214D] rounded-2xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Edit Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-[#003b8a] transition-colors">
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm md:text-base">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm md:text-base">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm md:text-base">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm md:text-base">Salary</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm md:text-base">Salary Type</label>
              <select
                value={formData.salaryType}
                onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
              >
                <option value="Year">Year</option>
                <option value="Month">Month</option>
                <option value="Week">Week</option>
                <option value="Hour">Hour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm md:text-base">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm md:text-base">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm md:text-base">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm md:text-base">Experience Level</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
            >
              <option value="Entry-level">Entry Level</option>
              <option value="Mid-level">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm md:text-base">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skillsRequired}
              onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
              className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm md:text-base">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors text-sm md:text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    }
  })
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchUserPostedJobs();
  }, []);

  const fetchUserPostedJobs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs/mine`,
        { withCredentials: true }
      );
      setJobs(response.data.jobs);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.message || 'Failed to fetch jobs');
      toast.error('Failed to fetch your posted jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/job/${jobId}`,
        { withCredentials: true }
      );
      toast.success('Job deleted successfully');
      fetchUserPostedJobs();
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/job/${jobId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success('Job status updated successfully');
      fetchUserPostedJobs();
    } catch (error: any) {
      console.error('Error updating job status:', error);
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleUpdateJob = async (jobId: string, updatedData: Partial<Job>) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/job/${jobId}`,
        updatedData,
        { withCredentials: true }
      );
      toast.success('Job updated successfully');
      fetchUserPostedJobs();
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <>
      <Navbar />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            borderRadius: '999px',
          }
        }}
      />
      <div className="min-h-screen bg-[#001530]">
        <div className="absolute top-0 left-0 w-full h-64 bg-yellow-600/10 blur-3xl rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 blur-3xl rounded-full translate-y-1/2"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4">My Posted Jobs</h1>
            <p className="text-gray-300 text-sm md:text-base">Manage and track all your posted jobs</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
            className="bg-[#00214D] rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-[#0047ab]/20"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-sm md:text-base"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white focus:outline-none focus:border-yellow-500 text-sm md:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial="hidden"
                animate="visible"
                custom={index}
                variants={fadeIn}
                className="bg-[#00214D] rounded-2xl p-4 md:p-6 border border-[#0047ab]/20 hover:border-yellow-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        job.status === 'closed' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      <select
                        value={job.status}
                        onChange={(e) => handleUpdateJobStatus(job._id, e.target.value)}
                        className="bg-[#003b8a] border border-[#0047ab]/30 rounded-full text-white text-xs px-3 py-1 focus:outline-none focus:border-yellow-500"
                      >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex items-center text-gray-300 text-xs md:text-sm">
                      <Building className="h-4 w-4 mr-2 text-yellow-500" />
                      {job.category}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingJob(job)}
                      className="p-1.5 rounded-full hover:bg-[#003b8a] transition-colors"
                    >
                      <Edit2 className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 hover:text-yellow-400" />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-1.5 rounded-full hover:bg-[#003b8a] transition-colors"
                    >
                      <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-red-500 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-yellow-500" />
                    {job.salary} / {job.salaryType}
                  </div>
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-500" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skillsRequired.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-[#003b8a] rounded-full text-xs text-white">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#0047ab]/20">
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <Users className="h-4 w-4 mr-2 text-yellow-500" />
                    {job.applicants.length} Applicants
                  </div>
                  <Link 
                    href={`/jobs/${job._id}/applications`}
                    className="text-xs md:text-sm text-yellow-500 hover:text-yellow-400 px-3 py-1 rounded-full hover:bg-[#003b8a] transition-colors"
                  >
                    View Applications →
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredJobs.length === 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeIn}
              className="text-center py-8 md:py-12"
            >
              <Briefcase className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Jobs Found</h3>
              <p className="text-gray-300 text-sm md:text-base">No jobs match your search criteria.</p>
            </motion.div>
          )}
        </div>
      </div>

      {editingJob && (
        <EditModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleUpdateJob}
        />
      )}

      <Footer />
    </>
  );
}

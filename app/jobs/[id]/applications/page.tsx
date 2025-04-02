'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, Star, Briefcase,
  Mail, Phone, MapPin, Building, MessageSquare
} from 'lucide-react';
import { io } from 'socket.io-client';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Applicant {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  location?: string;
  profession?: string;
  skills?: string[];
  experience?: string;
  bio?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  applicants: Applicant[];
  shortlistedCandidates: string[];
}

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

export default function ApplicationsPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    path: '/socket.io',
    extraHeaders: {
      'Access-Control-Allow-Credentials': 'true'
    }
  });

  useEffect(() => {
    fetchJobApplicants();
  }, [params.id]);

  const fetchJobApplicants = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/job/${params.id}/applicants`,
        { withCredentials: true }
      );
      setJob(response.data.job);
    } catch (error: any) {
      console.error('Error fetching applicants:', error);
      setError(error.response?.data?.message || 'Failed to fetch applicants');
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (candidateId: string, action: 'add' | 'remove') => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/job/${params.id}/shortlist/${candidateId}`,
        { action },
        { withCredentials: true }
      );
  
      if (action === 'add' && socket) {
        const applicant = job?.applicants.find(app => app._id === candidateId);
        
        if (applicant) {
          socket.emit('send-notification', {
            recipientId: candidateId,
            type: 'shortlisted',  
            message: `You've been shortlisted for ${job?.title}`,
          });
        }
      }
  
      toast.success(action === 'add' 
        ? 'Candidate shortlisted successfully' 
        : 'Candidate removed from shortlist');
      
      fetchJobApplicants();
    } catch (error: any) {
      console.error('Error updating shortlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update shortlist');
    }
  };

  const handleStartChat = async (applicantId: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/create-chat`,
        { otherUserId: applicantId },
        { withCredentials: true }
      );
      
      // Navigate to the chat page with the new chat ID
      window.location.href = `/indox`;
    } catch (error: any) {
      console.error('Error creating chat:', error);
      toast.error(error.response?.data?.message || 'Failed to start chat');
    }
  };

  const filteredApplicants = job?.applicants.filter(applicant => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const isShortlisted = job.shortlistedCandidates.includes(applicant._id);
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'shortlisted' && isShortlisted) ||
      (filterStatus === 'pending' && !isShortlisted);
    
    return matchesSearch && matchesFilter;
  }) || [];

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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4">
              Applications for {job?.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              {filteredApplicants.length} Applicants
            </p>
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
                  placeholder="Search applicants..."
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
                  <option value="all">All Applicants</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="pending">Pending</option>
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
            {filteredApplicants.map((applicant, index) => {
              const isShortlisted = job?.shortlistedCandidates.includes(applicant._id);
              return (
                <motion.div
                  key={applicant._id}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={fadeIn}
                  className="bg-[#00214D] rounded-2xl p-4 md:p-6 border border-[#0047ab]/20 hover:border-yellow-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Link href={`/users/${applicant._id}`} className="relative group">
                        <img
                          src={applicant.profilePicture || '/default-avatar.png'}
                          alt={applicant.name}
                          className="w-12 h-12 rounded-full object-cover group-hover:ring-2 group-hover:ring-yellow-600/50 transition-all"
                        />
                        {isShortlisted && (
                          <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </Link>
                      <div>
                        <Link 
                          href={`/users/${applicant._id}`}
                          className="text-lg font-bold text-white hover:text-yellow-500 transition-colors"
                        >
                          {applicant.name}
                        </Link>
                        <p className="text-gray-300 text-sm">{applicant.profession || 'Professional'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartChat(applicant._id)}
                        className="p-2 rounded-xl bg-[#003b8a] text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Start Chat"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShortlist(applicant._id, isShortlisted ? 'remove' : 'add')}
                        className={`p-2 rounded-xl transition-colors ${
                          isShortlisted
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-[#003b8a] text-gray-400 hover:text-yellow-600'
                        }`}
                      >
                        <Star className={`h-5 w-5 ${isShortlisted ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="h-4 w-4 mr-2 text-yellow-500" />
                      {applicant.email}
                    </div>
                    {applicant.phone && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <Phone className="h-4 w-4 mr-2 text-yellow-500" />
                        {applicant.phone}
                      </div>
                    )}
                    {applicant.location && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
                        {applicant.location}
                      </div>
                    )}
                  </div>

                  {applicant.skills && applicant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-600 text-white rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {applicant.bio && (
                    <p className="text-gray-300 text-sm line-clamp-3">{applicant.bio}</p>
                  )}

                  <Link 
                    href={`/users/${applicant._id}`}
                    className="text-xs md:text-sm text-yellow-600 hover:text-yellow-700 px-3 py-1 rounded-xl hover:bg-[#003b8a] transition-colors"
                  >
                    View Applications →
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredApplicants.length === 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeIn}
              className="text-center py-8 md:py-12"
            >
              <Users className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Applicants Found</h3>
              <p className="text-gray-300 text-sm md:text-base">
                {searchTerm || filterStatus !== 'all'
                  ? 'No applicants match your search criteria.'
                  : 'This job has no applicants yet.'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
} 
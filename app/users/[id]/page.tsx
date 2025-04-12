'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  Calendar, GraduationCap, Award, FileText,
  Download, Edit2, Star, Building
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  location?: string;
  profession?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  certifications?: string[];
  resume?: string;
  isFreelancer?: boolean;
  freelancerStatus?: {
    startDate: string;
    endDate: string;
  };
  role?: string;
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

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(user?.profilePicture);

  useEffect(() => {
    fetchUserProfile();
  }, [params.id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-public/${params.id}`,
        { withCredentials: true }
      );
      console.log('User data received:', response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError(error.response?.data?.message || 'Failed to fetch user profile');
      toast.error('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
 
    try {
      console.log('Starting resume download...');
      console.log('User ID:', params.id);
      console.log('Resume URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${params.id}/resume`);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${params.id}/resume`,
        { 
          responseType: 'blob',
          withCredentials: true 
        }
      );
      
      console.log('Response received:', {
        status: response.status,
        headers: response.headers,
        dataType: typeof response.data,
        dataSize: response.data.size
      });
      
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty response received');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${user?.name}-resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error: any) {
      console.error('Error downloading resume:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to download resume');
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

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">User Not Found</h3>
            <p className="text-gray-300">The user you're looking for doesn't exist.</p>
          </div>
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
      <div className="min-h-screen bg-white">
        <div className="absolute top-0 left-0 w-full h-64 bg-yellow-600/5 blur-3xl rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 blur-3xl rounded-full translate-y-1/2"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
            className="bg-white rounded-2xl p-6 md:p-8 mb-6 border border-gray-200 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${user.profilePicture}`}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-yellow-600/20"
                />
                {user.isFreelancer && (
                  <div className="mt-4 flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-xl">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Freelancer</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                    <p className="text-gray-600 text-lg">{user.profession || 'Professional'}</p>
                  </div>
                    <button
                      onClick={handleDownloadResume}
                      className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Download Resume</span>
                    </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 text-yellow-600" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3 text-yellow-600" />
                      {user.phone}
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-yellow-600" />
                      {user.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeIn}
              className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 mb-6">{user.bio || 'No bio available.'}</p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-600/10 text-yellow-600 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 
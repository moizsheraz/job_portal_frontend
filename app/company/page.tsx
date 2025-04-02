'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import axios from 'axios';

// Define interfaces for the data structures
interface CompanyData {
  _id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  description: string;
}

interface FormDataType {
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  description: string;
}

export default function CompanyProfile(): JSX.Element {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Company data state
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  
  // Form data state
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    logo: '',
    industry: '',
    location: '',
    website: '',
    description: ''
  });

  // Fetch company data on page load
  useEffect(() => {
    fetchCompanyData();
  }, []);

  // Fetch company data from API
  const fetchCompanyData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/get-user-company`, {
        withCredentials: true
      });
      
      const data: CompanyData = response.data;
      setCompany(data);
      setFormData({
        name: data.name || '',
        logo: data.logo || '',
        industry: data.industry || '',
        location: data.location || '',
        website: data.website || '',
        description: data.description || ''
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCompany(null);
      } else {
        toast.error('Error fetching company data: ' + (error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle logo upload
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // First show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        logo: reader.result as string
      }));
    };
    reader.readAsDataURL(file);

    // Then upload to server if company exists
    if (company?._id) {
      try {
        const formData = new FormData();
        formData.append('logo', file);

        const response = await axios.patch(
          `${API_BASE_URL}/api/v1/companies/${company._id}/logo`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setCompany(response.data.company);
        toast.success('Logo updated successfully!');
      } catch (error) {
        toast.error('Error uploading logo: ' + (error as Error).message);
      }
    }
  };

  // Create company function
  const createCompany = async (): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/create-company`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCompany(response.data.company);
      toast.success('Company created successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Error creating company: ' + (error as Error).message);
    }
  };

  // Update company function
  const updateCompany = async (): Promise<void> => {
    try {
      if (!company) return;
      
      // Create a new object without the logo field
      const { logo, ...updateData } = formData;
      
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/companies/${company._id}`,
        updateData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCompany(response.data.company);
      toast.success('Company updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Error updating company: ' + (error as Error).message);
    }
  };

  // Delete company function
  const deleteCompany = async (): Promise<void> => {
    if (!company) return;
    
    if (!confirm('Are you sure you want to delete your company profile? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/companies/${company._id}`, {
        withCredentials: true
      });
      
      setCompany(null);
      setFormData({
        name: '',
        logo: '',
        industry: '',
        location: '',
        website: '',
        description: ''
      });
      toast.success('Company deleted successfully!');
    } catch (error) {
      toast.error('Error deleting company: ' + (error as Error).message);
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (company) {
      updateCompany();
    } else {
      createCompany();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
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
      <Navbar/>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">Company Profile</span>
            {company && !editing && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
            )}
          </h1>
          
          {company && !editing && (
            <div className="flex space-x-3">
              <button 
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-yellow-600  text-white rounded-xl hover:opacity-80 transition-colors shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
              <button 
                onClick={deleteCompany}
                className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition-colors shadow-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
        
        {/* Company Profile View */}
        {company && !editing ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="relative h-48 bg-[#00214D]">
              <div className="absolute -bottom-16 left-8">
                <div className="w-36 h-36 rounded-xl bg-white p-2 shadow-lg">
                  {company.logo ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image 
                        src={`${API_BASE_URL}/api/v1/companies/${company._id}/logo`}
                        alt={company.name} 
                        fill
                        className="object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-3xl font-bold text-amber-700">
                      {company.name?.charAt(0) || 'C'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Header Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <defs>
                    <pattern id="header-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#header-pattern)" />
                </svg>
              </div>
            </div>
            
            <div className="pt-20 px-8 pb-8">
              <h2 className="text-3xl font-bold text-gray-800">{company.name}</h2>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 space-y-6">
                  <div className="bg-amber-50 rounded-xl p-5 transition-all hover:shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Company Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 text-amber-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Industry</span>
                          <span className="text-gray-800 font-medium">{company.industry}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 text-amber-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Location</span>
                          <span className="text-gray-800 font-medium">{company.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 text-amber-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">Website</span>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-800 font-medium hover:underline flex items-center"
                          >
                            <span>{company.website}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md h-full">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      About Us
                    </h3>
                    <div className="prose prose-amber max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Company Edit/Create Form */
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              {company ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Company Profile
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Company Profile
                </>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2h8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Industry</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2h8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="e.g. Technology, Healthcare, Education"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Company Logo</label>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden border-2 border-amber-200">
                        {formData.logo ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={company ? `${API_BASE_URL}/api/v1/companies/${company._id}/logo` : formData.logo}
                              alt="Company Logo" 
                              fill
                              className="object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-amber-300">
                            {formData.name?.charAt(0) || 'C'}
                          </div>
                        )}
                      </div>
                      <label className="px-4 py-3 bg-yellow-600 text-white rounded-xl hover:opacity-80 transition-colors shadow-md cursor-pointer flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm7-2h2.828a1 1 0 01.707.293l1.121 1.121A2 2 0 0017.172 5H18v12H2V7h1.828a2 2 0 001.414-.586l1.121-1.121A1 1 0 017.172 5h4.656a1 1 0 00.707-.293L12.536 3z" clipRule="evenodd" />
                          <path d="M8 7a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z" />
                        </svg>
                        Upload Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Company Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="Describe your company..."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                {company && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:opacity-80 transition-colors shadow-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {company ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
"use client"
import { useState, useEffect } from 'react';
import Layout from '../../../components/AdminLayout';
import { Eye, Pencil, Trash, X, Plus } from 'lucide-react';

type TrendingJob = {
  _id: string;
  title: string;
  company: string;
  salaryMin: number;
  salaryMax: number;
  location: 'Remote' | 'On-site' | 'Hybrid';
  createdAt: string;
};

export default function TrendingJobsManagement() {
  const [jobs, setJobs] = useState<TrendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Form data
  const [currentJob, setCurrentJob] = useState<TrendingJob>({
    _id: '',
    title: '',
    company: '',
    salaryMin: 0,
    salaryMax: 0,
    location: 'Remote',
    createdAt: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/get-all-trend`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        throw new Error('Failed to fetch trending jobs');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (job: TrendingJob) => {
    setCurrentJob(job);
    setShowViewModal(true);
  };

  const handleCreateClick = () => {
    setCurrentJob({
      _id: '',
      title: '',
      company: '',
      salaryMin: 0,
      salaryMax: 0,
      location: 'Remote',
      createdAt: ''
    });
    setShowCreateModal(true);
  };

  const handleEditClick = (job: TrendingJob) => {
    setCurrentJob({...job});
    setShowEditModal(true);
  };

  const handleDeleteClick = (job: TrendingJob) => {
    setCurrentJob(job);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'salaryMin' || name === 'salaryMax') {
      setCurrentJob(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setCurrentJob(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/create-trend-job`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: currentJob.title,
          company: currentJob.company,
          salaryMin: currentJob.salaryMin,
          salaryMax: currentJob.salaryMax,
          location: currentJob.location
        })
      });
      
      if (response.ok) {
        const newJob = await response.json();
        setJobs(prev => [...prev, newJob]);
        setShowCreateModal(false);
        setSuccess('Trending job created successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to create trending job');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create trending job');
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/edit-trend/${currentJob._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: currentJob.title,
          company: currentJob.company,
          salaryMin: currentJob.salaryMin,
          salaryMax: currentJob.salaryMax,
          location: currentJob.location
        })
      });
      
      if (response.ok) {
        const updatedJob = await response.json();
        setJobs(prev => prev.map(job => job._id === updatedJob._id ? updatedJob : job));
        setShowEditModal(false);
        setSuccess('Trending job updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to update trending job');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update trending job');
    }
  };

  const handleDeleteJob = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/delete-trend/${currentJob._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setJobs(prev => prev.filter(job => job._id !== currentJob._id));
        setShowDeleteModal(false);
        setSuccess('Trending job deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to delete trending job');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete trending job');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md flex items-center gap-2 hover:bg-yellow-700"
          >
            <Plus className="h-4 w-4" /> Add New Job
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
            <p>{error}</p>
            <button 
              className="text-red-700"
              onClick={() => setError('')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex justify-between items-center">
            <p>{success}</p>
            <button 
              className="text-green-700"
              onClick={() => setSuccess('')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#00214D]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Salary Range/month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      GH₵ {job.salaryMin.toLocaleString()} - GH₵ {job.salaryMax.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 flex gap-1 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="p-1 rounded-full"
                        title="View Job"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(job)}
                        className="p-1 rounded-full"
                        title="Edit Job"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job)}
                        className="hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        title="Delete Job"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No trending jobs found</p>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black font-medium">Create New Trending Job</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={currentJob.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={currentJob.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">Min Salary</label>
                    <input
                      type="number"
                      id="salaryMin"
                      name="salaryMin"
                      required
                      value={currentJob.salaryMin}
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700">Max Salary</label>
                    <input
                      type="number"
                      id="salaryMax"
                      name="salaryMax"
                      required
                      value={currentJob.salaryMax}
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    id="location"
                    name="location"
                    required
                    value={currentJob.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">Edit Trending Job</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateJob}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    required
                    value={currentJob.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="edit-company" className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    id="edit-company"
                    name="company"
                    required
                    value={currentJob.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-salaryMin" className="block text-sm font-medium text-gray-700">Min Salary</label>
                    <input
                      type="number"
                      id="edit-salaryMin"
                      name="salaryMin"
                      required
                      value={currentJob.salaryMin}
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-salaryMax" className="block text-sm font-medium text-gray-700">Max Salary</label>
                    <input
                      type="number"
                      id="edit-salaryMax"
                      name="salaryMax"
                      required
                      value={currentJob.salaryMax}
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    id="edit-location"
                    name="location"
                    required
                    value={currentJob.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Job Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Job Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Job Title</p>
                <p className="text-md text-gray-900">{currentJob.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Company</p>
                <p className="text-md text-gray-900">{currentJob.company}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Salary Range</p>
                <p className="text-md text-gray-900">₵{currentJob.salaryMin.toLocaleString()} - ₵{currentJob.salaryMax.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-md text-gray-900">{currentJob.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Job ID</p>
                <p className="text-md text-gray-900">{currentJob._id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-md text-gray-900">{new Date(currentJob.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-red-600">Delete Trending Job</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Are you sure you want to delete the job <span className="font-medium">{currentJob.title}</span> at <span className="font-medium">{currentJob.company}</span>?</p>
              <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteJob}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
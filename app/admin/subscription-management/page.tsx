"use client"
import { useState, useEffect } from 'react';
import Layout from '../../../components/AdminLayout';
import { Eye, Pencil, Trash, X } from 'lucide-react';

type Subscription = {
  _id: string;
  planType: string;
  price: number;
  createdAt: string;
};

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Form data
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({
    _id: '',
    planType: '',
    price: 0,
    createdAt: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-all-sub`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data);
      } else {
        throw new Error('Failed to fetch subscriptions');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubscription = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setShowViewModal(true);
  };

  const handleEditClick = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setShowEditModal(true);
  };

  const handleDeleteClick = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSubscription(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) : value 
    }));
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const updateData = {
        planType: currentSubscription.planType,
        price: currentSubscription.price
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/subscriptions/${currentSubscription._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedSubscription = await response.json();
        setSubscriptions(prev => prev.map(sub => sub._id === updatedSubscription._id ? updatedSubscription : sub));
        setShowEditModal(false);
        setSuccess('Subscription updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update subscription');
    }
  };

  const handleDeleteSubscription = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/subscriptions/${currentSubscription._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setSubscriptions(prev => prev.filter(sub => sub._id !== currentSubscription._id));
        setShowDeleteModal(false);
        setSuccess('Subscription deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to delete subscription');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete subscription');
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Plan Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {subscription.planType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₵{subscription.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 flex gap-1 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleViewSubscription(subscription)}
                        className="text-[#00214D] hover:text-yellow-600 p-1 rounded-full hover:bg-yellow-50"
                        title="View Subscription"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(subscription)}
                        className="text-[#00214D] hover:text-yellow-600 p-1 rounded-full hover:bg-yellow-50"
                        title="Edit Subscription"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(subscription)}
                        className="text-[#00214D] hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        title="Delete Subscription"
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

        {subscriptions.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No subscriptions found</p>
          </div>
        )}
      </div>

      {/* Create Subscription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#00214D]">Create New Subscription</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Form content would go here */}
          </div>
        </div>
      )}

      {/* Edit Subscription Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#00214D]">Edit Subscription</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateSubscription}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-planType" className="block text-sm font-medium text-gray-700">Plan Type</label>
                  <input
                    type="text"
                    id="edit-planType"
                    name="planType"
                    required
                    value={currentSubscription.planType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={currentSubscription.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
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

      {/* View Subscription Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#00214D]">Subscription Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Plan Type</p>
                <p className="text-md text-gray-900 capitalize">{currentSubscription.planType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-md text-gray-900">₵{currentSubscription.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subscription ID</p>
                <p className="text-md text-gray-900">{currentSubscription._id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-md text-gray-900">{new Date(currentSubscription.createdAt).toLocaleString()}</p>
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

      {/* Delete Subscription Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-red-600">Delete Subscription</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Are you sure you want to delete the <span className="font-medium capitalize">{currentSubscription.planType}</span> subscription plan?</p>
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
                onClick={handleDeleteSubscription}
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
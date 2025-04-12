"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Type definitions
type Subscription = {
  _id: string;
  planType: 'monthly' | 'quarterly' | 'yearly';
  price: number;
  createdAt?: string;
  updatedAt?: string;
};

type AdminData = {
  _id: string;
  username: string;
  token: string;
};

type FormData = {
  planType: 'monthly' | 'quarterly' | 'yearly';
  price: number;
};

type LoginData = {
  username: string;
  password: string;
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [formData, setFormData] = useState<FormData>({
    planType: 'monthly',
    price: 0
  });
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string>('');

  // Login state
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState<string>('');

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    
    if (token && admin) {
      try {
        const parsedAdmin = JSON.parse(admin);
        setAdminData(parsedAdmin);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  // Fetch subscriptions when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchSubscriptions();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data));
      setAdminData(data);
      setIsLoggedIn(true);
      setLoginData({ username: '', password: '' });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsLoggedIn(false);
    setAdminData(null);
    setMode('list');
    setError('');
  };

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-all-sub`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data);
        setError('');
      } else if (response.status === 401) {
        handleLogout();
      } else {
        throw new Error('Failed to fetch subscriptions');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/create-subs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSubscriptions();
        setMode('list');
        setFormData({
          planType: 'monthly',
          price: 0
        });
      } else if (response.status === 401) {
        handleLogout();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Failed to create subscription:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/update-sub/${currentSubscription?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSubscriptions();
        setMode('list');
      } else if (response.status === 401) {
        handleLogout();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update subscription');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Failed to update subscription:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setError('');
      
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/delete-sub/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchSubscriptions();
        } else if (response.status === 401) {
          handleLogout();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete subscription');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Failed to delete subscription:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {loginError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border rounded text-sm"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border rounded text-sm"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-sm text-gray-500">Welcome, {adminData?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {mode === 'list' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Subscription Plans</h2>
              <button
                onClick={() => {
                  setMode('create');
                  setFormData({
                    planType: 'monthly',
                    price: 0
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Create New Plan
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {subscriptions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No subscription plans found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.map((sub) => (
                      <tr key={sub._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {sub.planType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${sub.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setCurrentSubscription(sub);
                              setFormData({
                                planType: sub.planType,
                                price: sub.price
                              });
                              setMode('view');
                            }}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setCurrentSubscription(sub);
                              setFormData({
                                planType: sub.planType,
                                price: sub.price
                              });
                              setMode('edit');
                            }}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {(mode === 'create' || mode === 'edit' || mode === 'view') && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">
                {mode === 'create' ? 'Create New Subscription Plan' : 
                 mode === 'edit' ? 'Edit Subscription Plan' : 'Subscription Plan Details'}
              </h2>
              <button
                onClick={() => setMode('list')}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to list
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <form onSubmit={mode === 'create' ? handleCreate : handleUpdate}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="planType" className="block text-sm font-medium text-gray-700">
                      Plan Type
                    </label>
                    <select
                      id="planType"
                      name="planType"
                      value={formData.planType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled={mode === 'view'}
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={mode === 'view'}
                      required
                    />
                  </div>
                </div>

                {(mode === 'create' || mode === 'edit') && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setMode('list')}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {mode === 'create' ? 'Create Plan' : 'Update Plan'}
                    </button>
                  </div>
                )}
              </form>

              {mode === 'view' && currentSubscription && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Plan Details</h3>
                  <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Plan ID:</p>
                      <p className="text-sm font-medium">{currentSubscription._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At:</p>
                      <p className="text-sm font-medium">
                        {currentSubscription.createdAt ? new Date(currentSubscription.createdAt).toLocaleString() : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated:</p>
                      <p className="text-sm font-medium">
                        {currentSubscription.updatedAt ? new Date(currentSubscription.updatedAt).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
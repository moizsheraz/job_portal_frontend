"use client"
import { useState, useEffect } from 'react';
import Layout from '../../../components/AdminLayout';
import { Eye, Pencil, Trash, X, Lock, Unlock, ArrowUp, ArrowDown } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  isBlocked?: boolean;
};

type SortOption = 'name-asc' | 'name-desc' | 'email-asc' | 'email-desc' | 'date-asc' | 'date-desc' | 'status-asc' | 'status-desc';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Form data
  const [currentUser, setCurrentUser] = useState<User>({
    _id: '',
    name: '',
    email: '',
    password: '',
    createdAt: '',
    isBlocked: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply sorting and filtering whenever users, sortOption, or searchTerm changes
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'email-asc':
          return a.email.localeCompare(b.email);
        case 'email-desc':
          return b.email.localeCompare(a.email);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'status-asc':
          return (a.isBlocked ? 1 : 0) - (b.isBlocked ? 1 : 0);
        case 'status-desc':
          return (b.isBlocked ? 1 : 0) - (a.isBlocked ? 1 : 0);
        default:
          return 0;
      }
    });
    
    setFilteredUsers(result);
  }, [users, sortOption, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setShowViewModal(true);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user details');
    }
  };

  const handleEditClick = async (userId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser({...userData, password: ''});
        setShowEditModal(true);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user details');
    }
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const updateData: {username: string, email: string, password?: string, isBlocked?: boolean} = {
        username: currentUser.name,
        email: currentUser.email,
        isBlocked: currentUser.isBlocked
      };
      
      // Only include password if it's been provided
      if (currentUser.password) {
        updateData.password = currentUser.password;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(user => user._id === updatedUser._id ? updatedUser : user));
        setShowEditModal(false);
        setSuccess('User updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setUsers(prev => prev.filter(user => user._id !== currentUser._id));
        setShowDeleteModal(false);
        setSuccess('User deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const toggleBlockUser = async (userId: string, isCurrentlyBlocked: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isBlocked: !isCurrentlyBlocked })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(user => user._id === updatedUser._id ? updatedUser : user));
        setSuccess(`User ${isCurrentlyBlocked ? 'unblocked' : 'blocked'} successfully`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(`Failed to ${isCurrentlyBlocked ? 'unblock' : 'block'} user`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${isCurrentlyBlocked ? 'unblock' : 'block'} user`);
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortOption === option) {
      return <ArrowUp className="h-4 w-4 ml-1 inline" />;
    }
    if (sortOption === option.replace('asc', 'desc') || sortOption === option.replace('desc', 'asc')) {
      return <ArrowDown className="h-4 w-4 ml-1 inline" />;
    }
    return null;
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="w-full sm:w-auto text-black">
            <label htmlFor="sort" className="sr-only text-black">Sort by</label>
            <select
              id="sort"
              className="block w-full text-black pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="email-asc">Email (A-Z)</option>
              <option value="email-desc">Email (Z-A)</option>
              <option value="date-asc">Date (Oldest first)</option>
              <option value="date-desc">Date (Newest first)</option>
              <option value="status-asc">Status (Active first)</option>
              <option value="status-desc">Status (Blocked first)</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#00214D]">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortOption(sortOption === 'name-asc' ? 'name-desc' : 'name-asc')}
                  >
                    <div className="flex items-center">
                      Username
                      {getSortIcon('name-asc')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortOption(sortOption === 'email-asc' ? 'email-desc' : 'email-asc')}
                  >
                    <div className="flex items-center">
                      Email
                      {getSortIcon('email-asc')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortOption(sortOption === 'status-asc' ? 'status-desc' : 'status-asc')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status-asc')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortOption(sortOption === 'date-asc' ? 'date-desc' : 'date-asc')}
                  >
                    <div className="flex items-center">
                      Joined
                      {getSortIcon('date-asc')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 flex gap-1 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleViewUser(user._id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="View User"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(user._id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Edit User"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleBlockUser(user._id, !!user.isBlocked)}
                        className={`p-1 rounded-full ${user.isBlocked ? 'hover:bg-green-100 text-green-600' : 'hover:bg-red-100 text-red-600'}`}
                        title={user.isBlocked ? 'Unblock User' : 'Block User'}
                      >
                        {user.isBlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-600"
                        title="Delete User"
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

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit User</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="edit-username"
                    name="username"
                    required
                    value={currentUser.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    required
                    value={currentUser.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-gray-400 text-xs">(Leave blank to keep current password)</span>
                  </label>
                  <input
                    type="password"
                    id="edit-password"
                    name="password"
                    value={currentUser.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isBlocked"
                    name="isBlocked"
                    checked={currentUser.isBlocked || false}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, isBlocked: e.target.checked }))}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-isBlocked" className="ml-2 block text-sm text-gray-700">
                    Block this user
                  </label>
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

      {/* View User Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">User Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-md text-gray-900">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-md text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-md">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentUser.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {currentUser.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-md text-gray-900">{currentUser._id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-md text-gray-900">{new Date(currentUser.createdAt).toLocaleString()}</p>
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

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-red-600">Delete User</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Are you sure you want to delete the user <span className="font-medium">{currentUser.name}</span>?</p>
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
                onClick={handleDeleteUser}
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
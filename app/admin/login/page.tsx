"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

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
      router.push('/admin/user-management');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
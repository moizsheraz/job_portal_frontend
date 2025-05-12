"use client";
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  const [adminData, setAdminData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');

    if (!token || !admin) {
      router.push('/login');
      return;
    }

    try {
      setAdminData(JSON.parse(admin));
    } catch (error) {
      handleLogout();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/login');
  };

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#00214D]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-yellow-100">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00214D] text-yellow-100">
      <header className="bg-[#001737] shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h1>
            <p className="text-sm text-yellow-200">Welcome, {adminData.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-yellow-600 text-[#00214D] hover:bg-yellow-500 font-semibold text-sm px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex flex-wrap gap-3 mb-6">
          <NavLink href="/admin/subscription-management">Subscriptions</NavLink>
          <NavLink href="/admin/user-management">Users</NavLink>
          <NavLink href="/admin/advertisement-management">Advertisements</NavLink>
          <NavLink href="/admin/trend-job-management">Trending Jobs</NavLink>
        </nav>

        <main className="bg-[#001737] shadow-lg rounded-xl p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-semibold px-3 py-2 rounded transition
        ${isActive ? 'bg-yellow-600 text-white' : 'text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600'}`}
    >
      {children}
    </Link>
  );
}

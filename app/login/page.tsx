"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Define Auth status type
interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State for auth status
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is already authenticated
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/check-auth`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthStatus(data);
        
        // If user is authenticated, redirect to dashboard
        if (data.isAuthenticated) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  };

  // Handle Auth0 login redirect
  const handleAuth0Login = (provider?: string) => {
    setIsLoading(true);
    
    // Redirect to Auth0 login page (with optional provider parameter)
    const redirectUrl = provider 
      ? `/api/login?connection=${provider}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`;
      
    window.location.href = redirectUrl;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-3 text-lg text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg">
            <div className="space-y-6">
              {/* Social Signin Buttons */}
              <button
                type="button"
                onClick={() => handleAuth0Login('google-oauth2')}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                <Image
                  src="/google.png"
                  alt="Google logo"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span>Sign in with Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleAuth0Login()}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#34A853] hover:bg-[#2D9348] transition-all duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting...
                  </div>
                ) : (
                  <>
                    <span>Sign in with Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-base text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div> 
      </main>

      <Footer />
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/check-auth`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthStatus(data);
        
        if (data.isAuthenticated) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  };

  const handleAuth0Login = (provider?: string) => {
    if (!agreed) {
      setError("You must agree to the Privacy Policy and Terms.");
      return;
    }

    setError("");
    setIsLoading(true);

    const redirectUrl = provider 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login?connection=${provider}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`;

    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-3 text-lg text-gray-600">Join our community today</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg">
            <div className="space-y-6">

              {/* Checkbox for terms and privacy */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  I have read and agree to the{" "}
                  <Link href="https://www.alljobsgh.com/legal#privacy-policy" target="_blank" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="https://www.alljobsgh.com/legal#our-rules" className="text-blue-600 hover:text-blue-500 font-medium">
                    Our Rules
                  </Link>.
                </label>
              </div>

              {/* Show error if user hasn't agreed */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="button"
                onClick={() => handleAuth0Login('google-oauth2')}
                disabled={!agreed}
                className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 ease-in-out transform hover:-translate-y-0.5 ${!agreed && 'opacity-50 cursor-not-allowed'}`}
              >
                <Image
                  src="/google.png"
                  alt="Google logo"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleAuth0Login()}
                disabled={!agreed || isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#34A853] hover:bg-[#2D9348] transition-all duration-150 ease-in-out transform hover:-translate-y-0.5 ${(!agreed || isLoading) && 'opacity-50 cursor-not-allowed'}`}
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
                  <span>Sign up with Email</span>
                )}
              </button>
            </div>
          </div>

          <div className="text-center bg-white p-6 rounded-full shadow-sm border border-gray-200">
            <p className="text-base text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

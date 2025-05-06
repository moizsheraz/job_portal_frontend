'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { createJob } from '../services/JobService';
import { userService } from '../services/userService';

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<'form' | 'redirect'>('form');

  // Form state
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    currency: 'GHS',
    amount: '100.00'
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    const token = searchParams?.get('token');
    const isRedirect = searchParams?.get('redirect');
    
    if (token) {
      setMode('redirect');
      verifyToken(token);
    } else if (isRedirect) {
      setMode('redirect');
    }
  }, [searchParams]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Verify payment token
  const verifyToken = async (token: string) => {
    try {
      setLoading(true);
      setMessage('⏳ Verifying payment...');
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/express-pay-gh/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
  
      const result = await res.json();
      const purpose = searchParams?.get('purpose');
  
      if (result?.result === 1) {
        if (purpose?.startsWith('job-post')) {
          setMessage('⏳ Payment successful! Posting job...');
  
          const jobDataRaw = localStorage.getItem('jobData');
          const companyDataRaw = localStorage.getItem('companyData');
  
          if (jobDataRaw && companyDataRaw) {
            const jobData = JSON.parse(jobDataRaw);
            const companyData = JSON.parse(companyDataRaw);
  
            const jobPostResponse = await createJob(jobData, companyData);
            setMessage(jobPostResponse?.success
              ? '✅ Payment Successful & Job Posted!'
              : '⚠️ Payment Successful but Job Posting Failed.');
          } else {
            setMessage('⚠️ Payment succeeded but job/company data is missing.');
          }
  
        } else if (purpose === 'subscription') {
          setMessage('⏳ Payment successful! Activating subscription...');
  
          const planId = localStorage.getItem('planId');
          if (planId) {
            await userService.handleSubscriptionPaymentSuccess(planId);
            setMessage('✅ Subscription Activated!');
          } else {
            setMessage('⚠️ Payment succeeded but subscription plan ID is missing.');
          }
  
        }else if(purpose === 'freelance'){
          const response = await userService.handleFreelancerPaymentSuccess();
          if (response.success) {
            setMessage('✅ Payment Successful & Freelancer Status Activated!');
          }
        } else {
          setMessage('✅ Payment Verified!');
        }
      } else {
        setMessage('❌ Payment Failed or Cancelled');
      }
  
    } catch (err) {
      setMessage('⚠️ Unexpected error occurred while verifying payment.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment verification error:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const purpose = searchParams?.get('purpose');
    if (!purpose) {
        setMessage('⚠️ Invalid payment purpose.');
        return;
    }

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/express-pay-gh/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          orderId: `order_${Date.now()}`,
          redirectUrl: `https://www.alljobsgh.com/payment-redirect?purpose=${purpose}`,
        }),
      });

      const result = await response.json();
      if (!result.token) throw new Error('Failed to get payment token');

      window.location.href = `https://sandbox.expresspaygh.com/api/checkout.php?token=${result.token}`;
    } catch (err) {
      setMessage('⚠️ Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initiatePayment();
  };

  // Show loading state until mounted
  if (!isMounted) {
    return <LoadingSpinner />;
  }

  // Show redirect verification view
  if (mode === 'redirect') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white">
        <Navbar />
        <div className="flex items-center justify-center py-16 px-6 sm:px-8 lg:px-16">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl text-center p-8">
            {loading ? (
              <>
                <LoadingSpinner />
                <h2 className="text-xl font-semibold text-[#00214D] mt-4">Verifying payment...</h2>
              </>
            ) : (
              <>
                <div className={`text-4xl mb-3 ${
                  message.includes('✅') ? 'text-green-500' : 
                  message.includes('❌') ? 'text-red-500' : 
                  'text-yellow-600'
                }`}>
                  {message.includes('✅') ? '✓' : message.includes('❌') ? '✗' : '⚠️'}
                </div>
                <h2 className="text-2xl font-bold text-[#00214D] mb-4">
                  {message.split(' ').slice(1).join(' ')}
                </h2>
                <button
                  onClick={() => {
                    setMode('form');
                    router.replace('/');
                  }}
                  className="mt-6 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Back to Home
                </button>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show main payment form
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white py-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#00214D] p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Proceding to Payment</h2>
            <p className="mt-2 opacity-90">Secure payment processing</p>
          </div>

          <div className="p-6 md:p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('✅') ? 'bg-green-100 text-green-700' : 
                message.includes('❌') ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-[#00214D] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-[#00214D] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#00214D] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-[#00214D] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phonenumber"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-[#00214D] mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  >
                    <option value="GHS">GHS (Ghana Cedi)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-[#00214D] mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={localStorage.getItem('amount') || formData.amount}
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 px-6 py-4 text-lg font-medium text-white rounded-lg transition-colors ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Proceed to Checkout Page'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#00214D]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-600"></div>
    </div>
  );
}
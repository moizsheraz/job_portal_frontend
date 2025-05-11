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
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('0.00');

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    const token = searchParams?.get('token');
    const isRedirect = searchParams?.get('redirect');
    
    // Set amount from localStorage
    const storedPrice = localStorage.getItem('price');
    if (storedPrice) {
      setAmount(storedPrice);
    }

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
    
    const purpose = searchParams?.get('purpose');
    if (!purpose) {
      setMessage('⚠️ Payment purpose missing');
      setLoading(false);
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/express-pay-gh/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
  
      if (result?.result === 1) {
        if (purpose?.startsWith('job-post')) {
          setMessage('⏳ Payment successful! Posting job...');
  
          const jobDataRaw = localStorage.getItem('formData');
          const companyDataRaw = localStorage.getItem('companyData');
  
          if (jobDataRaw && companyDataRaw) {
            const jobData = JSON.parse(jobDataRaw);
            const companyData = JSON.parse(companyDataRaw);
  
            const jobPostResponse = await createJob(jobData, companyData);
            setMessage(jobPostResponse?.success
              ? '✅ Payment Successful & Job Posted!'
              : '⚠️ Payment Successful but Job Posting Failed.');
  
            // Clear storage
            localStorage.removeItem('formData');
            localStorage.removeItem('companyData');
          } else {
            setMessage('⚠️ Payment succeeded but job/company data is missing.');
          }
  
        } else if (purpose?.startsWith('subscription')) {
          setMessage('⏳ Payment successful! Activating subscription...');
  
          const planId = localStorage.getItem('planId');
          if (planId) {
            await userService.handleSubscriptionPaymentSuccess(planId);
            setMessage('✅ Subscription Activated!');
            localStorage.removeItem('planId');
          } else {
            setMessage('⚠️ Payment succeeded but subscription plan ID is missing.');
          }
  
        } else if (purpose?.startsWith('freelance')) {
          const response = await userService.handleFreelancerPaymentSuccess();
            setMessage('✅ Payment Successful & Freelancer Status Activated!');
  
        } else if (purpose?.startsWith('BuySubscriptionAndPostJob')) {
          const jobData = JSON.parse(localStorage.getItem('formData') || '{}');
          const companyData = JSON.parse(localStorage.getItem('companyData') || '{}');
          const planId = localStorage.getItem('planId'); 
  
          const subscriptionResponse = await userService.handleSubscriptionPaymentSuccess(planId);
          const jobPostResponse = await createJob(jobData, companyData);
          console.log('Subscription Response:', subscriptionResponse);
          console.log('Job Post Response:', jobPostResponse);
          setMessage('✅ Subscription Added & Job Posted!');
          // Clear all related data
          localStorage.removeItem('formData');
          localStorage.removeItem('companyData');
          localStorage.removeItem('planId');

        } else if (purpose?.startsWith('BuyDiscountedSubscription')) {
          const planId = localStorage.getItem('planId');
          if (planId) {
            await userService.handleSubscriptionPaymentSuccess(planId);
            setMessage('✅ Discounted Subscription Activated!');
            localStorage.removeItem('planId');
          } else {
            setMessage('⚠️ Payment succeeded but subscription plan ID is missing.');
          }

        }else if(purpose?.startsWith('downloadResume')){
          
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
          amount: amount,
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
                  className="mt-6 px-6 rounded-xl py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
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
            <h2 className="text-2xl font-bold">Complete Your Payment</h2>
            <p className="mt-2 opacity-90">Secure payment processing powered by ExpressPay</p>
          </div>

          <div className="p-6 md:p-8">
            {/* Important Notice Box */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-semibold">⚠️ Important Notice:</p>
              <p className="mt-1 text-sm">
                After completing your payment, you <strong>MUST</strong> return to this page for your transaction to be processed. 
                If you don't return here, your payment may not be verified and your service won't be activated.
              </p>
            </div>

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
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phonenumber"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-lg font-semibold text-[#00214D]">
                      {formData.currency}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-lg font-semibold text-[#00214D]">
                      {amount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 px-6 py-4 text-lg font-medium text-white rounded-lg transition-all ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 shadow-md hover:shadow-lg'
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
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Proceed to Payment
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Your payment is securely processed by ExpressPay. We don't store your payment details.</p>
                <p className="mt-2 font-medium text-yellow-700">Remember to return to this page after payment!</p>
              </div>
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
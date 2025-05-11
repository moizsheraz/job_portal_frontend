"use client"
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Briefcase, Star, Check, X } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

interface SubscriptionPlan {
  _id: string;
  planType: string;
  price: number;
  specialPrice?: number;
  isAdvertised?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  name?: string;
  description?: string;
  features?: string[];
  duration?: string;
}

export default function SubscriptionAdvertisementPage() {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-all-sub`);
        const data = await response.json();
        
        if (data.success) {
          // Filter plans to only show advertised or special priced ones
          const advertisedPlans = data.data.filter((plan: SubscriptionPlan) => 
            plan.isAdvertised || (plan.specialPrice && plan.specialPrice > 0)
          );

          const mappedPlans = advertisedPlans.map((plan: SubscriptionPlan) => ({
            ...plan,
            name: getPlanName(plan.planType),
            description: getPlanDescription(plan.planType),
            features: getPlanFeatures(plan.planType),
            duration: getPlanDuration(plan.planType)
          }));
          
          setSubscriptionPlans(mappedPlans);
        } else {
          throw new Error('Failed to fetch subscription plans');
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        toast.error('Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  // Helper functions
  const getPlanName = (planType: string): string => {
    switch (planType) {
      case 'monthly':
        return 'Monthly Plan';
      case 'quarterly':
        return 'Quarterly Plan';
      case 'yearly':
        return 'Yearly Plan';
      default:
        return 'Premium Plan';
    }
  };

  const getPlanDescription = (planType: string): string => {
    switch (planType) {
      case 'monthly':
        return 'Perfect for short-term needs';
      case 'quarterly':
        return 'Great value for growing businesses';
      case 'yearly':
        return 'Best savings for long-term commitment';
      default:
        return 'Premium subscription plan';
    }
  };

  const getPlanFeatures = (planType: string): string[] => {
    const baseFeatures = [
      'Unlimited job postings',
      'Post job listings',
      'Access candidate database',
      'Basic candidate filtering',
      'Shortlist candidates',
      'Chat with candidates'
    ];
    
    switch (planType) {
      case 'monthly':
        return [...baseFeatures, '30-day access'];
      case 'quarterly':
        return [...baseFeatures, '90-day access'];
      case 'yearly':
        return [...baseFeatures, '365-day access'];
      default:
        return baseFeatures;
    }
  };

  const getPlanDuration = (planType: string): string => {
    switch (planType) {
      case 'monthly':
        return '1 Month';
      case 'quarterly':
        return '3 Months';
      case 'yearly':
        return '1 Year';
      default:
        return 'Custom Duration';
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    // Store the price in localStorage
    const priceToStore = plan.specialPrice || plan.price;
    localStorage.setItem('price', priceToStore.toString());
    localStorage.setItem('planId', plan._id);
    
    // Redirect to payment page
    window.location.href = `/payment-redirect?purpose=BuyDiscountedSubscription`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <section className="text-center py-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Premium Subscriptions</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-8 h-full animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2 mx-auto"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-3 bg-gray-100 rounded mb-3 w-full"></div>
                    ))}
                    <div className="h-12 bg-gray-200 rounded-lg mt-8"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#00214D] to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Premium Subscriptions</h1>
            <p className="text-xl text-yellow-300 max-w-2xl mx-auto">
              Unlock powerful features with our special offers
            </p>
          </section>

          {/* Featured Plans */}
          <section className="py-8">
            {subscriptionPlans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-[#00214D] mb-4">No Special Offers Available</h2>
                <p className="text-gray-600 mb-6">Check back later for our advertised subscription plans.</p>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => window.location.href = '/subscriptions'}
                >
                  View All Plans
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subscriptionPlans.map((plan) => (
                  <div 
                    key={plan._id} 
                    className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                      ${plan.isAdvertised ? 'border-2 border-yellow-400' : 'border border-gray-200'}`}
                  >
                    {plan.isAdvertised && (
                      <div className="bg-yellow-500 text-white text-center py-2 font-bold">
                        Featured Plan
                      </div>
                    )}
                    {plan.specialPrice && !plan.isAdvertised && (
                      <div className="bg-blue-500 text-white text-center py-2 font-bold">
                        Special Offer
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-center text-[#00214D] mb-2">{plan.name}</h3>
                      <p className="text-gray-500 text-center mb-6">{plan.description}</p>
                      
                      <div className="text-center mb-8">
                        {plan.specialPrice ? (
                          <>
                            <span className="text-4xl font-bold text-yellow-600">
                              ₵{plan.specialPrice.toFixed(2)}
                            </span>
                            <span className="ml-2 text-gray-400 line-through">
                              ₵{plan.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-4xl font-bold text-[#00214D]">
                            ₵{plan.price.toFixed(2)}
                          </span>
                        )}
                        <p className="text-gray-500 mt-1">per {plan.duration}</p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features?.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleSubscribe(plan)}
                        className={`w-full py-6 rounded-xl text-lg
                          ${plan.isAdvertised 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-[#00214D] hover:bg-[#003366] text-white'
                          }`}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Additional Features Section */}
          <section className="bg-white rounded-xl shadow-lg p-10 mt-12">
            <h2 className="text-3xl font-bold text-center text-[#00214D] mb-12">Why Choose Our Subscriptions?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Boost Your Visibility</h3>
                <p className="text-gray-600">
                  Get your job postings featured at the top of search results to attract more qualified candidates.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
                <p className="text-gray-600">
                  Access advanced recruitment tools and analytics to streamline your hiring process.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
                <p className="text-gray-600">
                  Priority customer service to help you make the most of your subscription.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />

      {/* Plan Details Modal */}
      {showDetailsModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#00214D]">{selectedPlan.name}</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                {selectedPlan.specialPrice ? (
                  <div className="text-center">
                    <span className="text-4xl font-bold text-yellow-600">
                      ₵{selectedPlan.specialPrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-gray-400 line-through">
                      ₵{selectedPlan.price.toFixed(2)}
                    </span>
                    <p className="text-gray-500 mt-1">for {selectedPlan.duration}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-4xl font-bold text-[#00214D]">
                      ₵{selectedPlan.price.toFixed(2)}
                    </span>
                    <p className="text-gray-500 mt-1">for {selectedPlan.duration}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Plan Features:</h4>
                <ul className="space-y-2">
                  {selectedPlan.features?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  variant="outline"
                  className="flex-1 py-3"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleSubscribe(selectedPlan)}
                  className={`flex-1 py-3
                    ${selectedPlan.isAdvertised 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-[#00214D] hover:bg-[#003366]'
                    }`}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
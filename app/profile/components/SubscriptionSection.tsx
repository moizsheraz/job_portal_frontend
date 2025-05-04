import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { UserData } from '../types';
import { userService } from '../../services/userService';

interface SubscriptionPlan {
  _id: string;
  planType: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  name?: string;
  description?: string;
  features?: string[];
  duration?: string;
}

interface SubscriptionSectionProps {
  user: UserData;
  isLoading: boolean;
  onSubscribe: () => Promise<void>;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionSection({ user, isLoading, onSubscribe }: SubscriptionSectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-all-sub`)
        const data = await response.json();
        
        if (data.success) {
          const mappedPlans = data.data.map((plan: SubscriptionPlan) => ({
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
        toast.error('Failed to load subscription plans. Using default plans.');
        setSubscriptionPlans(getDefaultRecruiterPlans());
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  // Helper functions
  const getPlanName = (planType: string): string => {
    switch (planType) {
      case 'monthly':
        return 'Recruiter Basic';
      case 'quarterly':
        return 'Recruiter Pro';
      case 'yearly':
        return 'Recruiter Enterprise';
      default:
        return 'Recruiter Plan';
    }
  };

  const getPlanDescription = (planType: string): string => {
    switch (planType) {
      case 'monthly':
        return 'Essential tools for occasional hiring needs';
      case 'quarterly':
        return 'Powerful features for growing teams';
      case 'yearly':
        return 'Complete solution for enterprise recruiting';
      default:
        return 'Premium recruiting subscription';
    }
  };

  const getPlanFeatures = (planType: string): string[] => {
    const baseFeatures = [
      'Post job listings',
      'Access candidate database',
      'Basic candidate filtering',
      'Shortlist candidates',
      'Chat with candidates',
    ];
    
    switch (planType) {
      case 'monthly':
        return [...baseFeatures, 'Unlimited job postings', ];
      case 'quarterly':
        return [...baseFeatures, 'Unlimited job postings',];
      case 'yearly':
        return [...baseFeatures, 'Unlimited job postings'];
      default:
        return baseFeatures;
    }
  };

  const getPlanDuration = (planType: string): string => {
    switch (planType) {
      case 'monthly':
        return '30 days';
      case 'quarterly':
        return '90 days';
      case 'yearly':
        return '365 days';
      default:
        return '30 days';
    }
  };

  const getDefaultRecruiterPlans = (): SubscriptionPlan[] => {
    return [
      {
        _id: 'default-monthly-recruiter',
        planType: 'monthly',
        price: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        name: 'Recruiter Basic',
        description: 'Essential tools for occasional hiring needs',
        features: [
          'Post job listings',
          'Access candidate database',
          'Basic candidate filtering',
          'Up to 5 active job postings',
          '100 candidate views/month'
        ],
        duration: '30 days'
      },
      {
        _id: 'default-quarterly-recruiter',
        planType: 'quarterly',
        price: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        name: 'Recruiter Pro',
        description: 'Powerful features for growing teams',
        features: [
          'Post job listings',
          'Access candidate database',
          'Basic candidate filtering',
          'Up to 15 active job postings',
          'Unlimited candidate views',
          'Advanced search filters'
        ],
        duration: '90 days'
      },
      {
        _id: 'default-yearly-recruiter',
        planType: 'yearly',
        price: 300,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        name: 'Recruiter Enterprise',
        description: 'Complete solution for enterprise recruiting',
        features: [
          'Post job listings',
          'Access candidate database',
          'Basic candidate filtering',
          'Unlimited job postings',
          'Priority listing placement',
          'AI candidate matching',
          'Dedicated account manager'
        ],
        duration: '365 days'
      }
    ];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubscribeClick = async (plan: SubscriptionPlan) => {
    try {
      toast.loading('Creating payment...', { id: 'payment' });
      const { paymentIntentId, clientSecret } = await userService.createPaymentIntent(plan.price);
      setClientSecret(clientSecret);
      setSelectedPlan(plan);
      setShowPaymentModal(true);
      toast.success('Payment created successfully!', { id: 'payment' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await onSubscribe();
      setShowPaymentModal(false);
      toast.success(`Congratulations! You've subscribed to the ${selectedPlan?.name} plan!`, {
        duration: 5000,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete subscription.');
    }
  };

  // Check if user has an active subscription
  const hasActiveSubscription = user.subscription && new Date(user.subscription.endDate) > new Date();

  // If user has an active subscription, show their subscription details
  if (hasActiveSubscription) {
    return (
      <div className="bg-white rounded-lg shadow p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Subscription</h2>
        
        <div className="bg-gradient-to-r from-yellow-50 to-blue-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{user.subscription.name}</h3>
              <p className="text-gray-600 mb-4 font-bold">Thank you for being a valued subscriber!</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-bold">Start Date</p>
                  <p className="font-medium">{formatDate(user.subscription.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold">End Date</p>
                  <p className="font-medium">{formatDate(user.subscription.endDate)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-yellow-100">
            <h4 className="font-bold text-gray-700 mb-3">Subscription Benefits</h4>
            <ul className="space-y-2">
              {getPlanFeatures(user.subscription.name || user.subscription.name).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loadingPlans) {
    return (
      <div className="bg-white rounded-lg shadow p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recruiter Subscriptions</h2>
        <p className="text-gray-600 mb-6">Loading subscription plans...</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 font-bold rounded-xl p-6 h-full animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-3 bg-gray-100 rounded mb-2"></div>
              ))}
              <div className="h-10 bg-gray-200 rounded mt-6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    user.isFreelancer !== true && (
      <div className="bg-white rounded-lg shadow p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recruiter Subscriptions</h2>
        <p className="text-gray-600 mb-6">
          Upgrade your recruiting capabilities with our premium subscription plans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan._id} className={`border rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg
              ${plan.planType === 'quarterly' ? 'border-yellow-500 shadow-md' : 'border-gray-200'}`}>
              <div className={`text-center mb-4 pb-4 border-b ${plan.planType === 'quarterly' ? 'border-blue-200' : 'border-gray-100'}`}>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-500 font-bold text-sm mb-2">{plan.description}</p>
                <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
                <p className="text-gray-500 font-bold text-sm">for {plan.duration}</p>
                {plan.planType === 'quarterly' && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    Recommended
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-2 mb-6">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex font-bold items-start">
                      <svg className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => handleSubscribeClick(plan)}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl text-white font-medium transition-colors duration-300
                  ${plan.planType === 'quarterly' 
                    ? 'bg-yellow-600 text-white hover:opacity-80' 
                    : 'bg-gray-700 hover:opacity-80'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        {showPaymentModal && clientSecret && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Subscription</h3>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm 
                  clientSecret={clientSecret} 
                  planName={selectedPlan.name || selectedPlan.planType}
                  price={selectedPlan.price * 100}
                  planId={selectedPlan._id}
                  onSuccess={handlePaymentSuccess} 
                  onClose={() => setShowPaymentModal(false)} 
                />
              </Elements>
            </div>
          </div>
        )}
      </div>
    )
  );
}

const PaymentForm = ({
  clientSecret,
  planName,
  price,
  planId,
  onSuccess,
  onClose,
}: {
  clientSecret: string;
  planName: string;
  price: number;
  planId: string;
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const formattedPrice = (price / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      toast.error('Stripe has not been initialized.');
      return;
    }
  
    setIsProcessing(true);
    toast.loading('Processing payment...', { id: 'payment' });
  
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message || 'Payment details are invalid.');
        return;
      }
  
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });
  
      if (error) {
        toast.error(error.message || 'Payment failed.');
        return;
      }
  
      if (paymentIntent.status === 'succeeded') {
        toast.success('Payment succeeded!');
        await userService.handleSubscriptionPaymentSuccess(paymentIntent.id, planId);
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
      toast.dismiss('payment');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto pr-2 max-h-[60vh]">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Subscription Summary</h3>
            <p className="text-yellow-600">Plan: <span className="font-bold">{planName}</span></p>
            <p className="text-yellow-600">Price: <span className="font-bold">${formattedPrice}</span></p>
          </div>
          
          <PaymentElement />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="px-5 py-2.5 bg-gradient-to-r bg-yellow-600 text-white rounded-xl hover:opacity-80 
                      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Pay $${formattedPrice}`}
          </button>
        </div>
      </form>
    </div>
  );
};
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { UserData } from '../types';
import { userService } from '../../services/userService';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  duration: string;
}

interface SubscriptionSectionProps {
  user: UserData;
  isLoading: boolean;
  onSubscribe: () => Promise<void>;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 1999,
    description: 'Perfect for beginners',
    features: [
      'Apply to 20 jobs per month',
      'Profile visibility to recruiters',
      'Basic job recommendations'
    ],
    duration: '30 days'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 3999,
    description: 'For serious job seekers',
    features: [
      'Apply to unlimited jobs',
      'Featured profile status',
      'Advanced job matching',
      'Resume review service'
    ],
    duration: '30 days'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 6999,
    description: 'For career accelerators',
    features: [
      'All Professional features',
      'Priority application status',
      'Interview preparation toolkit',
      'One-on-one career coaching session',
      'Direct recruiter messaging'
    ],
    duration: '30 days'
  }
];

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-xl font-medium text-yellow-500 mb-2">Subscription Summary</h3>
        <p className="text-yellow-500">Plan: <span className="font-bold">{planName}</span></p>
        <p className="text-yellow-500">Price: <span className="font-bold">${formattedPrice}</span></p>
      </div>
      
      <PaymentElement />
      <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
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
          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay $${formattedPrice}`}
        </button>
      </div>
    </form>
  );
};

export default function SubscriptionSection({ user, isLoading, onSubscribe }: SubscriptionSectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Don't show subscription section for freelancers
  if (user.isFreelancer) {
    return null;
  }

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

  return (
    <div className="bg-white rounded-lg shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Subscriptions</h2>
      <p className="text-gray-600 mb-6">
        Enhance your job search experience with our premium subscription plans.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className={`border rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg
            ${plan.id === 'pro' ? 'border-yellow-800 shadow-md' : 'border-gray-200'}`}>
            <div className={`text-center mb-4  pb-4 border-b ${plan.id === 'pro' ? 'border-green-200' : 'border-gray-100'}`}>
              <h3 className="text-xl  font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{plan.description}</p>
              <p className="text-3xl font-bold text-gray-900">${(plan.price / 100).toFixed(2)}</p>
              <p className="text-gray-500 text-sm">for {plan.duration}</p>
              {plan.id === 'pro' && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
              )}
            </div>
            
            <div className="flex-grow ">
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-[#00214D] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600 font-bold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={() => handleSubscribeClick(plan)}
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-medium transition-colors duration-300
                ${plan.id === 'pro' 
                  ? 'bg-yellow-600 hover:opacity-80' 
                  : 'bg-gray-700 hover:bg-gray-800'
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
                planName={selectedPlan.name}
                price={selectedPlan.price}
                planId={selectedPlan.id}
                onSuccess={handlePaymentSuccess} 
                onClose={() => setShowPaymentModal(false)} 
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
} 
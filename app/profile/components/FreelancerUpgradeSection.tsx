import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { UserData } from '../types';
import { userService } from '../../services/userService';

interface FreelancerUpgradeSectionProps {
  user: UserData;
  isLoading: boolean;
  onUpgrade: () => Promise<void>;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm = ({
  clientSecret,
  onSuccess,
  onClose,
}: {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

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
        await userService.handleFreelancerPaymentSuccess(paymentIntent.id);
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
          {isProcessing ? 'Processing...' : 'Pay $29.99'}
        </button>
      </div>
    </form>
  );
};

export default function FreelancerUpgradeSection({ user, isLoading, onUpgrade }: FreelancerUpgradeSectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleUpgradeClick = async () => {
    try {
      toast.loading('Creating payment...', { id: 'payment' });
      const { paymentIntentId, clientSecret } = await userService.createPaymentIntent(2999);
      setClientSecret(clientSecret);
      setShowPaymentModal(true);
      toast.success('Payment created successfully!', { id: 'payment' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await onUpgrade();
      setShowPaymentModal(false);
      toast.success('Congratulations! You are now a freelancer!', {
        duration: 5000,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upgrade status.');
    }
  };

  if (user.isFreelancer) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Freelancer Status</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-500">
            <span className="mr-2">●</span>
            Active
          </span>
          <p className="text-gray-600">You are currently an active freelancer on our platform.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Freelancer</h2>
      <div className="space-y-4">
        <p className="text-gray-600">
          Unlock freelancer features and start offering your services to clients worldwide.
        </p>

        <div className="bg-yellow-100 font-bold p-4 bg-yellow-200 text-red-800 rounded-lg">
          <h3 className="text-lg  mb-2">Benefits of becoming a freelancer:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Make your profile public and visible to all users</li>
            <li>Apply to jobs created for freelancers</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="mb-4 sm:mb-0">
            <p className="text-lg font-bold text-gray-900">Freelancer Membership</p>
            <p className="text-[#00214D] font-bold text-2xl">$29.99</p>
            <p className="text-gray-500 text-sm">For 60 Days - One-time payment</p>
          </div>
          <button
            onClick={handleUpgradeClick}
            disabled={isLoading}
            className="bg-yellow-600 hover:opacity-80 text-white px-4 py-2 rounded-xl transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>

      {showPaymentModal && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h3>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} onClose={() => setShowPaymentModal(false)} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
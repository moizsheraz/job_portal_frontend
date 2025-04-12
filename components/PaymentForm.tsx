import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  amount: number;
  jobData: any; // Replace with proper JobData type
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent = ({ amount, jobData, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error("Stripe has not been initialized");
      return;
    }
  
    try {
      setIsLoading(true);
      
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/',
        },
        redirect: 'if_required',
      });
  
      if (error) {
        throw new Error(error.message);
      }
  
      // If we get here, the payment was successful
      onSuccess();
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={20} />
      </button>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#00214D]">Complete Your Payment</h3>
        <p className="text-gray-600 mt-2">Please provide your payment details to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <PaymentElement />
        </div>

        <div className="bg-yellow-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Amount:</span>
              <span className="text-xl text-red-700 font-bold text-yellow-500">${amount}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isLoading}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:opacity-80 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const PaymentForm = ({ amount, jobData, onSuccess, onCancel }: PaymentFormProps) => {
  const [options, setOptions] = useState<{
    clientSecret: string;
    appearance: {
      theme: 'stripe' | 'night' | 'flat';
    };
  }>({
    clientSecret: '',
    appearance: {
      theme: 'stripe',
    },
  });

  useEffect(() => {
    // Get the client secret from localStorage
    const paymentData = localStorage.getItem('jobPaymentIntent');
    if (paymentData) {
      const { clientSecret } = JSON.parse(paymentData);
      setOptions(prev => ({
        ...prev,
        clientSecret
      }));
    }
  }, []);

  if (!options.clientSecret) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent amount={amount} jobData={jobData} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast,Toaster } from 'react-hot-toast';
import { X } from 'lucide-react';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  amount: number;
  jobData: any; 
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent = ({ amount, jobData, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleStripeSubmit = async (e: React.FormEvent) => {
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
          return_url: window.location.origin + '/dashboard',
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

  const handleMntSubmit = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/momo/create-payment', {
        amount,
        phoneNumber,
      });

      if (response.data.success) {
        toast.success('MNT Payment successful!');
      } else {
        toast.error('MNT Payment failed!');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="relative">
        <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            borderRadius: '10px',
          },
          success: {
            style: {
              background: 'white',
              color: 'black',
            },
          },
          error: {
            style: {
              background: 'white',
              color: 'black',
            },
          },
        }}
      />
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

      <form onSubmit={handleStripeSubmit} className="space-y-6">
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
            {isLoading ? 'Processing...' : 'Pay Now with Stripe'}
          </button>
        </div>
      </form>

      {/* MNT Payment Section */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter phone number (10 digits)"
          className="px-4 py-2 border rounded-lg"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          onClick={handleMntSubmit}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-80 transition-colors"
        >
          Pay with MNT
        </button>
      </div>
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

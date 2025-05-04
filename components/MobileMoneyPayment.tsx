// components/MobileMoneyPayment.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface MobileMoneyPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const MobileMoneyPayment = ({ amount, onSuccess, onError }: MobileMoneyPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const getAccessToken = async () => {
    try {
      const response = await axios.post('/api/mtn/token');
      setAccessToken(response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error('Token error:', error);
      toast.error('Failed to initialize payment');
      throw error;
    }
  };

  const initiatePayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      const token = accessToken || await getAccessToken();
      const externalId = `ext-${Date.now()}`;
      
      const response = await axios.post('/api/mtn/payment', {
        amount: amount.toString(),
        currency: 'USD',
        phoneNumber: phoneNumber,
        externalId: externalId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReferenceId(response.data.referenceId);
      toast.success('Payment initiated. Please approve on your phone.');
      checkPaymentStatus(response.data.referenceId, token);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Payment failed');
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (refId: string, token: string) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 3000; // 3 seconds

    const checkStatus = async () => {
      attempts++;
      try {
        const response = await axios.get(`/api/mtn/status/${refId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const status = response.data.status;
        setPaymentStatus(status);

        if (status === 'SUCCESSFUL') {
          toast.success('Payment completed successfully!');
          onSuccess();
          return;
        } else if (status === 'FAILED') {
          toast.error('Payment failed');
          onError('Payment failed');
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, interval);
        } else {
          toast.error('Payment status check timed out');
          onError('Payment status check timed out');
        }
      } catch (error) {
        console.error('Status check error:', error);
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, interval);
        } else {
          toast.error('Failed to verify payment status');
          onError('Failed to verify payment status');
        }
      }
    };

    checkStatus();
  };

  return (
    <div className="mobile-money-payment">
      <h3>Pay with Mobile Money</h3>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your MTN mobile number"
          disabled={isLoading || !!referenceId}
        />
      </div>

      <div className="amount-display">
        Amount: <strong>${amount.toFixed(2)}</strong>
      </div>

      {!referenceId ? (
        <button
          onClick={initiatePayment}
          disabled={isLoading}
          className="pay-button"
        >
          {isLoading ? 'Processing...' : 'Pay with Mobile Money'}
        </button>
      ) : (
        <div className="payment-status">
          <p>Payment Status: {paymentStatus || 'Pending approval'}</p>
          <p>Reference ID: {referenceId}</p>
        </div>
      )}

      <style jsx>{`
        .mobile-money-payment {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .amount-display {
          font-size: 18px;
          margin: 15px 0;
          text-align: center;
        }
        .pay-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          width: 100%;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .pay-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .payment-status {
          margin-top: 15px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default MobileMoneyPayment;
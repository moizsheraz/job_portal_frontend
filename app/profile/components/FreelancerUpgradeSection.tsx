import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UserData } from '../types';
import { userService } from '../../services/userService';
import { useRouter } from 'next/navigation';
interface FreelancerUpgradeSectionProps {
  user: UserData;
  isLoading: boolean;
  onUpgrade: () => Promise<void>;
}



export default function FreelancerUpgradeSection({ user, isLoading, onUpgrade }: FreelancerUpgradeSectionProps) {

  const hasActiveSubscription = user.subscription && new Date(user.subscription.endDate) > new Date();
const router = useRouter();
  const handleUpgradeClick = async () => {
    try {
    router.push('/payment-redirect?purpose=freelance');      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment.');
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

  // Don't show the upgrade section if user already has an active subscription
  if (hasActiveSubscription) {
    return null; // Return nothing if user has an active subscription
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
            <p className="text-[#00214D] font-bold text-2xl">₵29.99</p>
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
    
    </div>
  );
}
import axios from 'axios';
import { UserData } from '../profile/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  async getCurrentUser() {
    try {
      // Get the current user's Auth0 ID from the session
      const response = await axios.get(`${API_URL}/api/v1/check-auth`, {
        withCredentials: true
      });
      if (!response.data.isAuthenticated || !response.data.user) {
        throw new Error('User not authenticated');
      }
      const auth0Id = response.data.user.sub;
      
      // Use the Auth0 ID to get the user profile
      const userResponse = await axios.get(`${API_URL}/api/v1/user/${auth0Id}`, {
        withCredentials: true
      });
      return userResponse.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  },

  async editProfile(userId: string, updates: Partial<UserData>) {
    try {
      const response = await axios.put(`${API_URL}/api/v1/user/${userId}/edit`, updates, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async uploadProfilePicture(userId: string, file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.put(`${API_URL}/api/v1/user/${userId}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  },

  async uploadResume(userId: string, file: File): Promise<UserData> {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.put(`${API_URL}/api/v1/user/${userId}/resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload resume');
    }
  },

  // create payment intent
 async createPaymentIntent(amount: number) {
  try {
    const response = await axios.post(`${API_URL}/api/v1/user/create-payment-intent`, {
      amount
    }, {
      withCredentials: true
    });

    // Store the client secret in localStorage
    localStorage.setItem('freelancerPaymentIntent', JSON.stringify({
      clientSecret: response.data.clientSecret,
      paymentIntentId: response.data.paymentIntentId
    }));

    return {
      clientSecret: response.data.clientSecret,
      paymentIntentId: response.data.paymentIntentId
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create payment intent');
  }
  },

  // handle freelancer payment success
  async handleFreelancerPaymentSuccess(paymentIntentId: string) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/user/freelancer-payment-success`, {
        paymentIntentId
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to handle freelancer payment success');
    } 
  },
  
  // handle subscription payment success
  async handleSubscriptionPaymentSuccess(paymentIntentId: string, planId: string) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/user/buy-subscription`, {
        paymentIntentId,
        subscriptionId:planId
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to handle subscription payment success');
    } 
  },

  async getSavedJobs(userId: string) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/saved-jobs`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch saved jobs');
    }
  },

  async getAppliedJobs(userId: string) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/applied-jobs`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applied jobs');
    }
  },

  async saveJob(userId: string, jobId: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/save-job/${jobId}`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save job');
    }
  },

  async unsaveJob(userId: string, jobId: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/unsave-job/${jobId}`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unsave job');
    }
  }
};


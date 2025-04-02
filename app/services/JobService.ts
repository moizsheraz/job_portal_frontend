import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await axios.post(`${API_URL}/job/create-payment-intent`, {
      amount
    }, {
      withCredentials: true
    });

    // Store the client secret in localStorage
    localStorage.setItem('jobPaymentIntent', JSON.stringify({
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
};

export interface JobData {
  title: string;
  location: string;
  salary: string;
  salaryType: "Year" | "Month" | "Week";
  isNegotiable: boolean;
  jobTypes: string[];
  description: string;
  tags: string[];
  skills: string[];
  category: string;
  employmentType: string;
  experience: string;
  company: string;
  status: string;
}

export const handlePaymentSuccess = async (jobData: JobData, paymentIntentId: string, companyData?: any) => {
  try {
    const response = await axios.post(`${API_URL}/job/payment-success`, {
      jobData,
      paymentIntentId,
      companyData
    }, {
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to confirm job payment');
  }
};
export const createJob = async (jobData: JobData, companyData?: any) => {
  try {
    const response = await axios.post(`${API_URL}/job/`, {
      jobData,
      companyData
    }, {
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to confirm job payment');
  }
};


export interface JobResponse {
  success: boolean;
  totalJobs: number;
  count: number;
  totalPages: number;
  currentPage: number;
  jobs: Job[];
}

export interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    location: string;
  };
  location: string;
  salary: string;
  salaryType: string;
  jobType: string[];
  description: string;
  tags: string[];
  skillsRequired: string[];
  category: string;
  employmentType: string;
  experience: string;
  status: string;
  createdAt: string;
  premium: boolean;
}

export const getJob = async (id: string): Promise<Job> => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`,{withCredentials:true});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job details');
  }
};



// types.ts
export interface User {
    name: string;
    email: string;
    auth0Id: string;
    profession: string;
    bio: string;
    role: 'jobseeker' | 'recruiter' | 'freelancer' | 'admin';
    skills: string[];
    resume: string;
    profilePicture: string;
    company?: {
      _id: string;
      name: string;
      logo: string;
    };
    freelancerPlan?: {
      isActive: boolean;
      startDate: string;
      endDate: string;
      planName: string;
    };
    appliedJobs: Job[];
    savedJobs: Job[];
    createdAt: string;
  }
  
  export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
  }
  
  export interface EditModeState {
    name: boolean;
    profession: boolean;
    bio: boolean;
    photo: boolean;
  }
  
  export type TempValues = Pick<User, 'name' | 'profession' | 'bio'>;
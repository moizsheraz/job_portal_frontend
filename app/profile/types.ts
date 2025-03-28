export interface UserData {
  _id: string;
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
  appliedJobs: string[];
  savedJobs: string[];
  createdAt: string;
  isFreelancer: boolean;
  subscription: {
    startDate: string;
    endDate: string;
    name: string;
  };
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
}

export interface EditMode {
  name: boolean;
  profession: boolean;
  bio: boolean;
  photo: boolean;
}

export interface TempValues {
  name: string;
  profession: string;
  bio: string;
}

export interface ProfileHeroProps {
  user: UserData;
  editMode: EditMode;
  tempValues: TempValues;
  handleEditToggle: (field: keyof EditMode) => void;
  handleInputChange: (field: keyof TempValues, value: string) => void;
  handleSave: (field: keyof TempValues) => void;
  handleCancel: (field: keyof TempValues) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ProfileInfoProps {
  user: UserData;
  editMode: EditMode;
  tempValues: TempValues;
  handleEditToggle: (field: keyof EditMode) => void;
  handleInputChange: (field: keyof TempValues, value: string) => void;
  handleSave: (field: keyof TempValues) => void;
  handleCancel: (field: keyof TempValues) => void;
  isLoading: boolean;
}

export interface SkillsSectionProps {
  user: UserData;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  showSkillInput: boolean;
  setShowSkillInput: (show: boolean) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
  isLoading: boolean;
}

export interface ResumeSectionProps {
  user: UserData;
  handleResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export interface CompanySectionProps {
  company: UserData['company'];
}

export interface ApplicationsSectionProps {
  user: UserData;
}

export interface SavedJobsSectionProps {
  user: UserData;
  handleRemoveSavedJob: (jobId: string) => void;
  isLoading: boolean;
}

export interface SubscriptionSectionProps {
  user: UserData;
  isLoading: boolean;
  onSubscribe: () => Promise<void>;
} 
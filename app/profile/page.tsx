"use client"

import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProfileHero from "./components/ProfileHero"
import ProfileTabs from "./components/ProfileTabs"
import ProfileInfo from "./components/ProfileInfo"
import SkillsSection from "./components/SkillsSection"
import ResumeSection from "./components/ResumeSection"
import CompanySection from "./components/CompanySection"
import ApplicationsSection from "./components/ApplicationsSection"
import SavedJobsSection from "./components/SavedJobsSection"
import FreelancerUpgradeSection from "./components/FreelancerUpgradeSection"
import SubscriptionSection from "./components/SubscriptionSection"
import { UserData, EditMode, TempValues } from "./types"
import { userService } from "../services/userService"

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Edit state management
  const [editMode, setEditMode] = useState<EditMode>({
    name: false,
    profession: false,
    bio: false,
    photo: false
  })
  const [newSkill, setNewSkill] = useState("")
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [tempValues, setTempValues] = useState<TempValues>({
    name: "",
    profession: "",
    bio: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedResume, setSelectedResume] = useState<File | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const userData = await userService.getCurrentUser()
        setUser(userData)
        setTempValues({
          name: userData.name,
          profession: userData.profession,
          bio: userData.bio,
        })
      } catch (error: any) {
        setIsLoading(false)
        toast.error(error.message || 'Failed to fetch user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (!isClient || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }
  
  const handleEditToggle = (field: keyof EditMode) => {
    setEditMode((prev) => {
      const newState = { ...prev, [field]: !prev[field] };
  
      if (!prev[field] && field !== 'photo') {
        setTempValues((prevValues) => ({
          ...prevValues,
          [field]: user[field as keyof TempValues],
        }));
      }
  
      return newState;
    });
  };
  
  const handleInputChange = (field: keyof TempValues, value: string) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSave = async (field: keyof TempValues) => {
    try {
      setIsLoading(true);
      const updates = { [field]: tempValues[field] };
      const updatedUser = await userService.editProfile(user.auth0Id, updates);
      setUser(updatedUser);
      setEditMode((prev) => ({
        ...prev,
        [field]: false,
      }));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message);
      setTempValues((prev) => ({
        ...prev,
        [field]: user[field],
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = (field: keyof TempValues) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: user[field],
    }));
    setEditMode((prev) => ({
      ...prev,
      [field]: false,
    }));
  };
  
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
  
      try {
        setIsLoading(true);
        const updatedUser = await userService.uploadProfilePicture(user.auth0Id, file);
        setUser(updatedUser);
        toast.success('Profile picture updated successfully');
      } catch (error: any) {
        toast.error(error.message);
        setSelectedFile(null);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedResume(file);
  
      try {
        setIsLoading(true);
        const updatedUser = await userService.uploadResume(user.auth0Id, file);
        setUser(updatedUser);
        toast.success('Resume updated successfully');
      } catch (error: any) {
        toast.error(error.message);
        setSelectedResume(null);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      try {
        setIsLoading(true);
        const updatedUser = await userService.editProfile(user.auth0Id, {
          skills: [...user.skills, newSkill.trim()],
        });
        setUser(updatedUser);
        setNewSkill("");
        setShowSkillInput(false);
        toast.success('Skill added successfully');
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleRemoveSkill = async (skillToRemove: string) => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.editProfile(user.auth0Id, {
        skills: user.skills.filter((skill) => skill !== skillToRemove),
      });
      setUser(updatedUser);
      toast.success('Skill removed successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveSavedJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      await userService.unsaveJob(user.auth0Id, jobId);
      const updatedUser = await userService.getCurrentUser();
      setUser(updatedUser);
      toast.success('Job removed from saved jobs');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToFreelancer = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.getCurrentUser();
      setUser(updatedUser);
      toast.success('Successfully upgraded to freelancer status');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.getCurrentUser();
      setUser(updatedUser);
      toast.success('Subscription activated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Toaster position="top-center" />
      <Navbar />
      
      <ProfileHero
        user={user}
        editMode={editMode}
        tempValues={tempValues}
        handleEditToggle={handleEditToggle}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handlePhotoChange={handlePhotoChange}
        isLoading={isLoading}
      />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-5xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <ProfileInfo
              user={user}
              editMode={editMode}
              tempValues={tempValues}
              handleEditToggle={handleEditToggle}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
              isLoading={isLoading}
            />

            <FreelancerUpgradeSection
              user={user}
              isLoading={isLoading}
              onUpgrade={handleUpgradeToFreelancer}
            />

            <SubscriptionSection
              user={user}
              isLoading={isLoading}
              onSubscribe={handleSubscribe}
            />

            <SkillsSection
              user={user}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              showSkillInput={showSkillInput}
              setShowSkillInput={setShowSkillInput}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
              isLoading={isLoading}
            />

            <ResumeSection
              user={user}
              handleResumeUpload={handleResumeUpload}
              isLoading={isLoading}
            />

            <CompanySection company={user.company} />
          </div>
        )}

        {activeTab === "applications" && (
          <ApplicationsSection user={user} />
        )}

        {activeTab === "saved" && (
          <SavedJobsSection
            user={user}
            handleRemoveSavedJob={handleRemoveSavedJob}
            isLoading={isLoading}
          />
        )}
      </div>
      
      <Footer />
    </div>
  )
}
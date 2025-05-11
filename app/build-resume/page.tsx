"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Check, CreditCard, Download, Router } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { userService } from "@/app/services/userService"
import { UserData } from "@/app/profile/types"

// Import types
import type { ResumeData, Education, Experience, TemplateType } from "../../app/types/resume"

// Import components
import { PersonalInfoForm } from "../../components/resume/personalinfo-form"
import { EducationForm } from "../../components/resume/education-form"
import { ExperienceForm } from "../../components/resume/experience-form"
import { SkillsForm } from "../../components/resume/skill-form"
import { TemplateSelector } from "../../components/resume/template-sector"
import { ResumePreview } from "../../components/resume/resume-preview"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ResumeBuilder() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await userService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a resume",
          variant: "destructive"
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  // User data state
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    education: [{ institution: "", degree: "", year: "" }],
    experience: [{ company: "", position: "", duration: "", description: "" }],
    skills: [],
    selectedTemplate: "professional",
  })

  const [newSkill, setNewSkill] = useState("")
  const resumeRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResumeData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (
    field: "education" | "experience",
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    const updatedArray = [...resumeData[field]]
    updatedArray[index] = { ...updatedArray[index], [name]: value } as any
    setResumeData((prev) => ({ ...prev, [field]: updatedArray }))
  }

  // Add new education/experience entry
  const addEntry = (field: "education" | "experience") => {
    const template =
      field === "education"
        ? ({ institution: "", degree: "", year: "" } as Education)
        : ({ company: "", position: "", duration: "", description: "" } as Experience)

    setResumeData((prev) => ({
      ...prev,
      [field]: [...prev[field], template],
    }))
  }

  // Remove education/experience entry
  const removeEntry = (field: "education" | "experience", index: number) => {
    const updatedArray = resumeData[field].filter((_, i) => i !== index)
    setResumeData((prev) => ({ ...prev, [field]: updatedArray }))
  }

  // Handle skills
  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index)
    setResumeData((prev) => ({ ...prev, skills: updatedSkills }))
  }

const generateAndUploadResume = async () => {
  if (!resumeRef.current) {
    toast({ variant: "destructive", title: "Error", description: "Resume content not found" });
    return;
  }

  try {
    setIsGenerating(true);
    toast({ title: "Generating PDF...", description: "Please wait while we create your resume" });

    // 1. Generate PDF
    const canvas = await html2canvas(resumeRef.current, {
      scale: 1, // Reduced from 2 to decrease size
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG for smaller size

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true // Enable PDF compression
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    // 2. Create FormData with proper file handling
    const pdfBlob = pdf.output("blob");
    const formData = new FormData();
    
    // Create a new File from the Blob
    const file = new File([pdfBlob], `${resumeData.name.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`, {
      type: "application/pdf",
    });

    formData.append("resume", file);

    // 3. Debug: Check actual file size
    console.log("PDF size:", file.size, "bytes");

    if (!user) throw new Error("User not found");

    // 4. Upload with explicit headers
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${user.auth0Id}/premium-resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    localStorage.setItem("price", "4.99");
    router.push("/payment-redirect?purpose=resume");
    toast({ title: "Success!", description: "Resume uploaded successfully" });

  } catch (error:any) {
    console.error("Upload error:", error);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: error.message || "Failed to upload resume",
    });
  } finally {
    setIsGenerating(false);
  }
};



  // Template selection
  const selectTemplate = (template: TemplateType) => {
    setResumeData((prev) => ({ ...prev, selectedTemplate: template }))
  }

  // Load sample data
  const loadSampleData = () => {
    setResumeData({
      name: "Alex Johnson",
      title: "Senior Software Engineer",
      email: "alex.johnson@example.com",
      phone: "(123) 456-7890",
      address: "San Francisco, CA",
      summary: "Experienced software engineer with 8+ years of expertise in full-stack development.",
      education: [
        {
          institution: "Stanford University",
          degree: "Master of Science in Computer Science",
          year: "2015-2017",
        },
      ],
      experience: [
        {
          company: "Tech Innovations Inc.",
          position: "Senior Software Engineer",
          duration: "Jan 2020 - Present",
          description: "Lead a team of 5 developers in building cloud-native applications.",
        },
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js"],
      selectedTemplate: resumeData.selectedTemplate,
    })
  }

  // Clear all data
  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setResumeData({
        name: "",
        title: "",
        email: "",
        phone: "",
        address: "",
        summary: "",
        education: [{ institution: "", degree: "", year: "" }],
        experience: [{ company: "", position: "", duration: "", description: "" }],
        skills: [],
        selectedTemplate: resumeData.selectedTemplate,
      })
    }
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  // Don't render the form if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xl font-bold text-yellow-600 text-gray-600 max-w-3xl mx-auto">
              Create a professional resume in minutes with our easy-to-use builder. Build your future today!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-lg border-0">
                <CardContent className="p-6">
                  <Tabs defaultValue="editor" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-semibold">Resume Editor</h2>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={loadSampleData} className="text-xs">
                              Load Sample
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearAllData}
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              Clear All
                            </Button>
                          </div>
                        </div>

                        <Accordion type="single" collapsible defaultValue="personal">
                          <AccordionItem value="personal">
                            <AccordionTrigger className="text-base font-medium">Personal Information</AccordionTrigger>
                            <AccordionContent>
                              <PersonalInfoForm resumeData={resumeData} onChange={handleChange} />
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="education">
                            <AccordionTrigger className="text-base font-medium">Education</AccordionTrigger>
                            <AccordionContent>
                              <EducationForm
                                education={resumeData.education}
                                onAdd={() => addEntry("education")}
                                onRemove={(index) => removeEntry("education", index)}
                                onChange={(index, e) => handleArrayChange("education", index, e)}
                              />
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="experience">
                            <AccordionTrigger className="text-base font-medium">Experience</AccordionTrigger>
                            <AccordionContent>
                              <ExperienceForm
                                experience={resumeData.experience}
                                onAdd={() => addEntry("experience")}
                                onRemove={(index) => removeEntry("experience", index)}
                                onChange={(index, e) => handleArrayChange("experience", index, e)}
                              />
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="skills">
                            <AccordionTrigger className="text-base font-medium">Skills</AccordionTrigger>
                            <AccordionContent>
                              <SkillsForm
                                skills={resumeData.skills}
                                newSkill={newSkill}
                                onNewSkillChange={(e) => setNewSkill(e.target.value)}
                                onAddSkill={addSkill}
                                onRemoveSkill={removeSkill}
                                onKeyDown={(e) => e.key === "Enter" && e.preventDefault() && addSkill()}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </TabsContent>

                    <TabsContent value="templates">
                      <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
                      <TemplateSelector
                        selectedTemplate={resumeData.selectedTemplate}
                        onSelectTemplate={selectTemplate}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6">
                    <Button onClick={generateAndUploadResume} className="w-full" disabled={isGenerating}>
                      {isGenerating ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating PDF...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          {"Purchase & Download (₵4.99)"}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <ResumePreview ref={resumeRef} resumeData={resumeData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

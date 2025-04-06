"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Check, CreditCard, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Import types
import type { ResumeData, Education, Experience, TemplateType, PaymentStatusType } from "../../app/types/resume"

// Import components
import { PersonalInfoForm } from "../../components/resume/personalinfo-form"
import { EducationForm } from "../../components/resume/education-form"
import { ExperienceForm } from "../../components/resume/experience-form"
import { SkillsForm } from "../../components/resume/skill-form"
import { TemplateSelector } from "../../components/resume/template-sector"
import { ResumePreview } from "../../components/resume/resume-preview"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx")

// Payment form component
interface PaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  onClose: () => void
}

function PaymentForm({ clientSecret, onSuccess, onClose }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Stripe has not been initialized.",
      })
      return
    }

    setIsProcessing(true)
    toast({
      title: "Processing payment...",
      description: "Please wait while we process your payment.",
    })

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message || "Payment details are invalid")
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: "if_required",
      })

      if (error) {
        throw new Error(error.message || "Payment failed")
      }

      if (paymentIntent?.status === "succeeded") {
        // Verify payment with backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/resume-builder`,
          { paymentIntentId: paymentIntent.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        )

        if (response.status === 200) {
          toast({
            title: "Payment Successful",
            description: "Your payment was processed successfully!",
            variant: "default",
          })
          onSuccess() // Trigger PDF generation
        } else {
          throw new Error("Failed to verify payment with server")
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Payment processing failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex justify-end space-x-4 mt-8">
        <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing} className="bg-primary hover:bg-primary/90">
          {isProcessing ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ₵4.99
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}

export default function ResumeBuilder() {
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

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>("idle")
  const [shouldDownloadPDF, setShouldDownloadPDF] = useState(false)
  const { toast } = useToast()

  // Effect to handle PDF download after payment success
  useEffect(() => {
    if (paymentStatus === "success" && shouldDownloadPDF) {
      const generatePDF = async () => {
        await generateAndDownloadPDF()
        setShouldDownloadPDF(false)
      }
      generatePDF()
    }
  }, [paymentStatus, shouldDownloadPDF])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResumeData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle array field changes
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

  // Create payment intent
  const createPaymentIntent = async () => {
    try {
      setPaymentStatus("processing")

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/create-payment-intent`,
        { amount: 499 }, // $4.99 in cents
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )

      if (response.status !== 200) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret } = response.data
      setClientSecret(clientSecret)
      setShowPaymentModal(true)
      setPaymentStatus("idle")
    } catch (error) {
      console.error("Error creating payment intent:", error)
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again later.",
      })
      setPaymentStatus("error")
    }
  }

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setPaymentStatus("success")
    setShouldDownloadPDF(true) // Set flag to generate PDF
  }

  // Generate and download PDF
  const generateAndDownloadPDF = async () => {
    if (!resumeRef.current) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resume content not found",
      })
      return
    }

    try {
      setIsGenerating(true)
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your resume",
      })

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${resumeData.name.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`)

      toast({
        title: "Success!",
        description: "Your resume has been downloaded",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Download PDF handler
  const downloadPDF = async () => {
    // If payment is not successful yet, initiate payment flow
    if (paymentStatus !== "success") {
      await createPaymentIntent()
      return
    }

    // If already paid, generate and download PDF
    await generateAndDownloadPDF()
  }

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
                  <Button onClick={downloadPDF} className="w-full" disabled={isGenerating}>
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
                        {paymentStatus === "success" ? "Download Resume PDF" : "Purchase & Download (₵4.99)"}
                      </span>
                    )}
                  </Button>

                  {paymentStatus === "success" && (
                    <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Payment complete! You can now download your resume.
                    </div>
                  )}
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

      {/* Payment Modal */}
      <Dialog
        open={showPaymentModal}
        onOpenChange={(open) => {
          // Only allow closing if not processing payment
          if (!open && paymentStatus !== "processing") {
            setShowPaymentModal(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>Pay ₵4.99 to download your premium resume in PDF format.</DialogDescription>
          </DialogHeader>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onClose={() => setShowPaymentModal(false)}
              />
            </Elements>
          ) : (
            <div className="flex items-center justify-center p-6">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  <Footer/>
  </>
  )
}


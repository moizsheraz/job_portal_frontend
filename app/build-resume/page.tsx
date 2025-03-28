"use client"

import { useState, useRef } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Download, Plus, Trash2, X, Briefcase, GraduationCap, Mail, Phone, MapPin, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ResumeBuilder() {
  // User data state
  const [resumeData, setResumeData] = useState({
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
  const resumeRef = useRef(null)
  const [activeSection, setActiveSection] = useState("personal")
  const [isGenerating, setIsGenerating] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setResumeData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle array field changes
  const handleArrayChange = (field, index, e) => {
    const { name, value } = e.target
    const updatedArray = [...resumeData[field]]
    updatedArray[index][name] = value
    setResumeData((prev) => ({ ...prev, [field]: updatedArray }))
  }

  // Add new education/experience entry
  const addEntry = (field) => {
    const template =
      field === "education"
        ? { institution: "", degree: "", year: "" }
        : { company: "", position: "", duration: "", description: "" }

    setResumeData((prev) => ({
      ...prev,
      [field]: [...prev[field], template],
    }))
  }

  // Remove education/experience entry
  const removeEntry = (field, index) => {
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

  const removeSkill = (index) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index)
    setResumeData((prev) => ({ ...prev, skills: updatedSkills }))
  }

  // Download as PDF
  const downloadPDF = async () => {
    if (!resumeRef.current) return

    try {
      setIsGenerating(true)

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
      pdf.save(`${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`)

      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setIsGenerating(false)
    }

  }

  // Template selection
  const selectTemplate = (template) => {
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
      summary:
        "Experienced software engineer with 8+ years of expertise in full-stack development. Passionate about creating scalable applications and solving complex problems with clean, efficient code.",
      education: [
        {
          institution: "Stanford University",
          degree: "Master of Science in Computer Science",
          year: "2015-2017",
        },
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science in Computer Engineering",
          year: "2011-2015",
        },
      ],
      experience: [
        {
          company: "Tech Innovations Inc.",
          position: "Senior Software Engineer",
          duration: "Jan 2020 - Present",
          description:
            "Lead a team of 5 developers in building cloud-native applications. Implemented CI/CD pipelines that reduced deployment time by 40%. Architected microservices that improved system scalability.",
        },
        {
          company: "DataSphere Solutions",
          position: "Software Engineer",
          duration: "Mar 2017 - Dec 2019",
          description:
            "Developed RESTful APIs and microservices using Node.js and Express. Optimized database queries that improved application performance by 30%. Collaborated with UX designers to implement responsive UI components.",
        },
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "AWS",
        "Docker",
        "Kubernetes",
        "GraphQL",
        "MongoDB",
      ],
      selectedTemplate: resumeData.selectedTemplate,
    })
  }

  // Clear all data
  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 text-[#00214D] mb-2"> Premium Resume Builder by ALLJOBS</h1>
          <p className="text-gray-600 font-bold max-w-2xl mx-auto">
            Create a professional resume in minutes with our easy-to-use builder. Choose from premium templates and
            download your resume in PDF format.
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
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <Input
                                  type="text"
                                  name="name"
                                  value={resumeData.name}
                                  onChange={handleChange}
                                  placeholder="John Doe"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Professional Title
                                </label>
                                <Input
                                  type="text"
                                  name="title"
                                  value={resumeData.title}
                                  onChange={handleChange}
                                  placeholder="Software Engineer"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <Input
                                  type="email"
                                  name="email"
                                  value={resumeData.email}
                                  onChange={handleChange}
                                  placeholder="john@example.com"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <Input
                                  type="tel"
                                  name="phone"
                                  value={resumeData.phone}
                                  onChange={handleChange}
                                  placeholder="(123) 456-7890"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <Input
                                  type="text"
                                  name="address"
                                  value={resumeData.address}
                                  onChange={handleChange}
                                  placeholder="City, Country"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Professional Summary
                                </label>
                                <Textarea
                                  name="summary"
                                  value={resumeData.summary}
                                  onChange={handleChange}
                                  rows={3}
                                  placeholder="Brief summary of your professional background..."
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="education">
                          <AccordionTrigger className="text-base font-medium">Education</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {resumeData.education.map((edu, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                                  <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-sm">Education #{index + 1}</h3>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeEntry("education", index)}
                                      className="h-6 w-6 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      type="text"
                                      name="institution"
                                      value={edu.institution}
                                      onChange={(e) => handleArrayChange("education", index, e)}
                                      placeholder="University Name"
                                      className="text-sm"
                                    />
                                    <Input
                                      type="text"
                                      name="degree"
                                      value={edu.degree}
                                      onChange={(e) => handleArrayChange("education", index, e)}
                                      placeholder="Degree/Certificate"
                                      className="text-sm"
                                    />
                                    <Input
                                      type="text"
                                      name="year"
                                      value={edu.year}
                                      onChange={(e) => handleArrayChange("education", index, e)}
                                      placeholder="Year (e.g., 2015-2019)"
                                      className="text-sm"
                                    />
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEntry("education")}
                                className="w-full text-sm"
                              >
                                <Plus className="h-4 w-4 mr-1" /> Add Education
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="experience">
                          <AccordionTrigger className="text-base font-medium">Experience</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {resumeData.experience.map((exp, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                                  <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-sm">Experience #{index + 1}</h3>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeEntry("experience", index)}
                                      className="h-6 w-6 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <Input
                                      type="text"
                                      name="company"
                                      value={exp.company}
                                      onChange={(e) => handleArrayChange("experience", index, e)}
                                      placeholder="Company Name"
                                      className="text-sm"
                                    />
                                    <Input
                                      type="text"
                                      name="position"
                                      value={exp.position}
                                      onChange={(e) => handleArrayChange("experience", index, e)}
                                      placeholder="Job Position"
                                      className="text-sm"
                                    />
                                    <Input
                                      type="text"
                                      name="duration"
                                      value={exp.duration}
                                      onChange={(e) => handleArrayChange("experience", index, e)}
                                      placeholder="Duration (e.g., Jan 2020 - Present)"
                                      className="text-sm"
                                    />
                                    <Textarea
                                      name="description"
                                      value={exp.description}
                                      onChange={(e) => handleArrayChange("experience", index, e)}
                                      placeholder="Job responsibilities and achievements"
                                      rows={2}
                                      className="text-sm"
                                    />
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEntry("experience")}
                                className="w-full text-sm"
                              >
                                <Plus className="h-4 w-4 mr-1" /> Add Experience
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="skills">
                          <AccordionTrigger className="text-base font-medium">Skills</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2">
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  placeholder="Add a skill"
                                  className="text-sm"
                                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                                />
                                <Button onClick={addSkill} size="sm">
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {resumeData.skills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="px-2 py-1 text-sm flex items-center gap-1"
                                  >
                                    {skill}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeSkill(index)}
                                      className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-red-500 hover:bg-transparent"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </TabsContent>

                  <TabsContent value="templates">
                    <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${resumeData.selectedTemplate === "professional" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => selectTemplate("professional")}
                      >
                        <div className="aspect-[3/4] bg-gray-100 relative">
                          <div className="absolute inset-0 p-4 flex flex-col">
                            <div className="h-8 bg-primary rounded-sm mb-2"></div>
                            <div className="flex-1 bg-white rounded-sm p-2">
                              <div className="h-4 w-24 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-3/4 bg-gray-100 rounded-sm mb-3"></div>

                              <div className="h-4 w-20 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-3"></div>

                              <div className="h-4 w-24 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 text-center font-medium">Professional</div>
                      </div>

                      <div
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${resumeData.selectedTemplate === "modern" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => selectTemplate("modern")}
                      >
                        <div className="aspect-[3/4] bg-gray-100 relative">
                          <div className="absolute inset-0 p-4 flex">
                            <div className="w-1/3 bg-gray-700 rounded-l-sm p-2">
                              <div className="h-12 w-12 rounded-full bg-gray-500 mx-auto mb-3"></div>
                              <div className="h-3 w-full bg-gray-600 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-600 rounded-sm mb-3"></div>
                              <div className="h-4 w-16 bg-gray-500 rounded-sm mb-2 mx-auto"></div>
                              <div className="h-2 w-full bg-gray-600 rounded-sm mb-1"></div>
                              <div className="h-2 w-full bg-gray-600 rounded-sm mb-1"></div>
                            </div>
                            <div className="w-2/3 bg-white rounded-r-sm p-2">
                              <div className="h-4 w-24 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-3"></div>

                              <div className="h-4 w-20 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 text-center font-medium">Modern</div>
                      </div>

                      <div
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${resumeData.selectedTemplate === "elegant" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => selectTemplate("elegant")}
                      >
                        <div className="aspect-[3/4] bg-gray-100 relative">
                          <div className="absolute inset-0 p-4 flex flex-col">
                            <div className="h-16 bg-white border-b-2 border-gray-300 flex items-center justify-center mb-2">
                              <div className="h-6 w-32 bg-gray-200 rounded-sm"></div>
                            </div>
                            <div className="flex-1 bg-white p-2">
                              <div className="h-4 w-24 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-3"></div>

                              <div className="h-4 w-20 bg-gray-200 rounded-sm mb-2"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                              <div className="h-3 w-full bg-gray-100 rounded-sm mb-1"></div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 text-center font-medium">Elegant</div>
                      </div>
                    </div>
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
                        Download Resume PDF
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Resume Preview</h2>
                  <Badge variant="outline" className="font-normal">
                    {resumeData.selectedTemplate.charAt(0).toUpperCase() + resumeData.selectedTemplate.slice(1)}{" "}
                    Template
                  </Badge>
                </div>

                <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                  <div
                    ref={resumeRef}
                    className={`resume-container ${resumeData.selectedTemplate} bg-white p-6`}
                    style={{ width: "210mm", minHeight: "297mm", maxWidth: "100%", margin: "0 auto" }}
                  >
                    {resumeData.selectedTemplate === "professional" && (
                      <div className="professional-template">
                        <div className="bg-primary text-white p-6 mb-6">
                          <h1 className="text-3xl font-bold">{resumeData.name || "Your Name"}</h1>
                          <p className="text-xl mt-1 opacity-90">{resumeData.title || "Professional Title"}</p>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                            {resumeData.email && (
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                <span>{resumeData.email}</span>
                              </div>
                            )}
                            {resumeData.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                <span>{resumeData.phone}</span>
                              </div>
                            )}
                            {resumeData.address && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{resumeData.address}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {resumeData.summary && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-3">
                              Professional Summary
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                          </div>
                        )}

                        {resumeData.experience.length > 0 && resumeData.experience[0].company && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-3">
                              <div className="flex items-center">
                                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                                Work Experience
                              </div>
                            </h2>
                            {resumeData.experience.map((exp, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-800">{exp.position || "Position"}</h3>
                                    <p className="text-primary font-medium">{exp.company || "Company"}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{exp.duration || "Duration"}</p>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{exp.description || "Job description"}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {resumeData.education.length > 0 && resumeData.education[0].institution && (
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-3">
                              <div className="flex items-center">
                                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                                Education
                              </div>
                            </h2>
                            {resumeData.education.map((edu, index) => (
                              <div key={index} className="mb-4">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-800">{edu.institution || "Institution"}</h3>
                                    <p className="text-gray-700">{edu.degree || "Degree"}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{edu.year || "Year"}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {resumeData.skills.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-3">
                              <div className="flex items-center">
                                <Award className="h-5 w-5 mr-2 text-primary" />
                                Skills
                              </div>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.map((skill, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {resumeData.selectedTemplate === "modern" && (
                      <div className="modern-template grid grid-cols-3 gap-6">
                        <div className="col-span-1 bg-gray-800 text-white p-6 min-h-full">
                          <div className="mb-8 text-center">
                            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                              {resumeData.name ? resumeData.name.charAt(0) : "?"}
                            </div>
                            <h1 className="text-xl font-bold">{resumeData.name || "Your Name"}</h1>
                            <p className="text-gray-300 mt-1">{resumeData.title || "Professional Title"}</p>
                          </div>

                          <div className="mb-6">
                            <h2 className="text-lg font-semibold border-b border-gray-600 pb-1 mb-3">Contact</h2>
                            <div className="space-y-2 text-sm">
                              {resumeData.email && (
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2" />
                                  <span>{resumeData.email}</span>
                                </div>
                              )}
                              {resumeData.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2" />
                                  <span>{resumeData.phone}</span>
                                </div>
                              )}
                              {resumeData.address && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{resumeData.address}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {resumeData.skills.length > 0 && (
                            <div>
                              <h2 className="text-lg font-semibold border-b border-gray-600 pb-1 mb-3">Skills</h2>
                              <div className="space-y-2">
                                {resumeData.skills.map((skill, index) => (
                                  <div key={index} className="bg-gray-700 px-3 py-1 rounded text-sm">
                                    {skill}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-span-2 p-6">
                          {resumeData.summary && (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
                                Profile
                              </h2>
                              <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                            </div>
                          )}

                          {resumeData.experience.length > 0 && resumeData.experience[0].company && (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
                                <div className="flex items-center">
                                  <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                                  Work Experience
                                </div>
                              </h2>
                              {resumeData.experience.map((exp, index) => (
                                <div key={index} className="mb-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-gray-800">{exp.position || "Position"}</h3>
                                      <p className="text-gray-600">{exp.company || "Company"}</p>
                                    </div>
                                    <p className="text-sm text-gray-600">{exp.duration || "Duration"}</p>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">{exp.description || "Job description"}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {resumeData.education.length > 0 && resumeData.education[0].institution && (
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
                                <div className="flex items-center">
                                  <GraduationCap className="h-5 w-5 mr-2 text-gray-600" />
                                  Education
                                </div>
                              </h2>
                              {resumeData.education.map((edu, index) => (
                                <div key={index} className="mb-4">
                                  <div className="flex justify-between">
                                    <div>
                                      <h3 className="font-semibold text-gray-800">
                                        {edu.institution || "Institution"}
                                      </h3>
                                      <p className="text-gray-700">{edu.degree || "Degree"}</p>
                                    </div>
                                    <p className="text-sm text-gray-600">{edu.year || "Year"}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {resumeData.selectedTemplate === "elegant" && (
                      <div className="elegant-template">
                        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
                          <h1 className="text-3xl font-bold text-gray-800">{resumeData.name || "Your Name"}</h1>
                          <p className="text-xl text-gray-600 mt-1">{resumeData.title || "Professional Title"}</p>

                          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
                            {resumeData.email && (
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                <span>{resumeData.email}</span>
                              </div>
                            )}
                            {resumeData.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                <span>{resumeData.phone}</span>
                              </div>
                            )}
                            {resumeData.address && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{resumeData.address}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {resumeData.summary && (
                          <div className="mb-6">
                            <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">
                              Professional Summary
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            {resumeData.experience.length > 0 && resumeData.experience[0].company && (
                              <div className="mb-6">
                                <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">Experience</h2>
                                {resumeData.experience.map((exp, index) => (
                                  <div key={index} className="mb-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-semibold text-gray-800">{exp.position || "Position"}</h3>
                                        <p className="italic text-gray-600">{exp.company || "Company"}</p>
                                      </div>
                                      <p className="text-sm text-gray-600">{exp.duration || "Duration"}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{exp.description || "Job description"}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            {resumeData.education.length > 0 && resumeData.education[0].institution && (
                              <div className="mb-6">
                                <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">Education</h2>
                                {resumeData.education.map((edu, index) => (
                                  <div key={index} className="mb-4">
                                    <div className="flex justify-between">
                                      <div>
                                        <h3 className="font-semibold text-gray-800">
                                          {edu.institution || "Institution"}
                                        </h3>
                                        <p className="text-gray-700">{edu.degree || "Degree"}</p>
                                      </div>
                                      <p className="text-sm text-gray-600">{edu.year || "Year"}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {resumeData.skills.length > 0 && (
                              <div>
                                <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                  {resumeData.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="border border-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .resume-container {
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.5;
        }
        
        .professional-template {
          color: #333;
        }
        
        .modern-template {
          color: #333;
        }
        
        .elegant-template {
          color: #333;
          font-family: 'Georgia', serif;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-container, .resume-container * {
            visibility: visible;
          }
          .resume-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  )
}


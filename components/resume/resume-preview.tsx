import type { ResumeData } from "../../app/types/resume"
import { Badge } from "@/components/ui/badge"
import { ProfessionalTemplate } from "./templates/professional"
import { ModernTemplate } from "./templates/modern"
import { ElegantTemplate } from "./templates/elegent"
import { forwardRef } from "react"

interface ResumePreviewProps {
  resumeData: ResumeData
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ resumeData }, ref) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Preview</h2>
        <Badge variant="outline" className="font-normal">
          {resumeData.selectedTemplate.charAt(0).toUpperCase() + resumeData.selectedTemplate.slice(1)} Template
        </Badge>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
        <div
          ref={ref}
          className={`resume-container ${resumeData.selectedTemplate} bg-white p-6`}
          style={{ width: "210mm", minHeight: "297mm", maxWidth: "100%", margin: "0 auto" }}
        >
          {resumeData.selectedTemplate === "professional" && <ProfessionalTemplate resumeData={resumeData} />}

          {resumeData.selectedTemplate === "modern" && <ModernTemplate resumeData={resumeData} />}

          {resumeData.selectedTemplate === "elegant" && <ElegantTemplate resumeData={resumeData} />}
        </div>
      </div>
    </div>
  )
})

ResumePreview.displayName = "ResumePreview"


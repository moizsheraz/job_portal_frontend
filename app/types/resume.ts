// Define types for resume data
export interface Education {
    institution: string;
    degree: string;
    year: string;
  }
  
  export interface Experience {
    company: string;
    position: string;
    duration: string;
    description: string;
  }
  
  export type TemplateType = 'professional' | 'modern' | 'elegant';
  
  export interface ResumeData {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    education: Education[];
    experience: Experience[];
    skills: string[];
    selectedTemplate: TemplateType;
  }
  
  export interface PaymentStatus {
    status: 'idle' | 'processing' | 'success' | 'error';
    message?: string;
  }

  export type PaymentStatusType = "idle" | "processing" | "success" | "error"
  
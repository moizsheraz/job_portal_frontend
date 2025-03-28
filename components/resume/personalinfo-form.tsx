import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "../../app/types/resume";

interface PersonalInfoFormProps {
  resumeData: ResumeData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PersonalInfoForm({ resumeData, onChange }: PersonalInfoFormProps) {
  return (
    <div className="space-y-3 pt-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <Input
          type="text"
          name="name"
          value={resumeData.name}
          onChange={onChange}
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
        <Input
          type="text"
          name="title"
          value={resumeData.title}
          onChange={onChange}
          placeholder="Software Engineer"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          name="email"
          value={resumeData.email}
          onChange={onChange}
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <Input
          type="tel"
          name="phone"
          value={resumeData.phone}
          onChange={onChange}
          placeholder="(123) 456-7890"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <Input
          type="text"
          name="address"
          value={resumeData.address}
          onChange={onChange}
          placeholder="City, Country"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
        <Textarea
          name="summary"
          value={resumeData.summary}
          onChange={onChange}
          rows={3}
          placeholder="Brief summary of your professional background..."
        />
      </div>
    </div>
  );
}

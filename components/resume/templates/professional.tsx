import { ResumeData } from "../../../app/types/resume";
import { Award, Briefcase, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

interface ProfessionalTemplateProps {
  resumeData: ResumeData;
}

export function ProfessionalTemplate({ resumeData }: ProfessionalTemplateProps) {
  return (
    <div className="professional-template">
      <div className="bg-primary text-white p-6 mb-6">
        <h1 className="text-3xl font-bold">{resumeData.name || 'Your Name'}</h1>
        <p className="text-xl mt-1 opacity-90">{resumeData.title || 'Professional Title'}</p>
        
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
          <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-3">Professional Summary</h2>
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
                  <h3 className="font-semibold text-gray-800">{exp.position || 'Position'}</h3>
                  <p className="text-primary font-medium">{exp.company || 'Company'}</p>
                </div>
                <p className="text-sm text-gray-600">{exp.duration || 'Duration'}</p>
              </div>
              <p className="text-sm text-gray-700 mt-1">{exp.description || 'Job description'}</p>
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
                  <h3 className="font-semibold text-gray-800">{edu.institution || 'Institution'}</h3>
                  <p className="text-gray-700">{edu.degree || 'Degree'}</p>
                </div>
                <p className="text-sm text-gray-600">{edu.year || 'Year'}</p>
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
  );
}

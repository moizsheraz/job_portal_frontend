import { ResumeData } from "../../../app/types/resume";
import { Briefcase, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

interface ModernTemplateProps {
  resumeData: ResumeData;
}

export function ModernTemplate({ resumeData }: ModernTemplateProps) {
  return (
    <div className="modern-template grid grid-cols-3 gap-6">
      <div className="col-span-1 bg-gray-800 text-white p-6 min-h-full">
        <div className="mb-8 text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
            {resumeData.name ? resumeData.name.charAt(0) : '?'}
          </div>
          <h1 className="text-xl font-bold">{resumeData.name || 'Your Name'}</h1>
          <p className="text-gray-300 mt-1">{resumeData.title || 'Professional Title'}</p>
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
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">Profile</h2>
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
                    <h3 className="font-semibold text-gray-800">{exp.position || 'Position'}</h3>
                    <p className="text-gray-600">{exp.company || 'Company'}</p>
                  </div>
                  <p className="text-sm text-gray-600">{exp.duration || 'Duration'}</p>
                </div>
                <p className="text-sm text-gray-700 mt-1">{exp.description || 'Job description'}</p>
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
                    <h3 className="font-semibold text-gray-800">{edu.institution || 'Institution'}</h3>
                    <p className="text-gray-700">{edu.degree || 'Degree'}</p>
                  </div>
                  <p className="text-sm text-gray-600">{edu.year || 'Year'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

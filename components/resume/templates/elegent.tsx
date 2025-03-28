import { ResumeData } from "../../../app/types/resume";
import { Mail, MapPin, Phone } from 'lucide-react';

interface ElegantTemplateProps {
  resumeData: ResumeData;
}

export function ElegantTemplate({ resumeData }: ElegantTemplateProps) {
  return (
    <div className="elegant-template">
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{resumeData.name || 'Your Name'}</h1>
        <p className="text-xl text-gray-600 mt-1">{resumeData.title || 'Professional Title'}</p>
        
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
          <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">Professional Summary</h2>
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
                      <h3 className="font-semibold text-gray-800">{exp.position || 'Position'}</h3>
                      <p className="italic text-gray-600">{exp.company || 'Company'}</p>
                    </div>
                    <p className="text-sm text-gray-600">{exp.duration || 'Duration'}</p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{exp.description || 'Job description'}</p>
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
              <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="border border-gray-300 text-gray-800 px-3 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

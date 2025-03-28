import { TemplateType } from "../../app/types/resume";

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div 
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedTemplate === 'professional' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => onSelectTemplate('professional')}
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
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedTemplate === 'modern' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => onSelectTemplate('modern')}
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
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedTemplate === 'elegant' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => onSelectTemplate('elegant')}
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
  );
}

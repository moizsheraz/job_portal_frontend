import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Education } from "../../app/types/resume";
import { Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EducationForm({ education, onAdd, onRemove, onChange }: EducationFormProps) {
  return (
    <div className="space-y-4 pt-2">
      {education.map((edu, index) => (
        <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Education #{index + 1}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
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
              onChange={(e) => onChange(index, e)}
              placeholder="University Name"
              className="text-sm"
            />
            <Input
              type="text"
              name="degree"
              value={edu.degree}
              onChange={(e) => onChange(index, e)}
              placeholder="Degree/Certificate"
              className="text-sm"
            />
            <Input
              type="text"
              name="year"
              value={edu.year}
              onChange={(e) => onChange(index, e)}
              placeholder="Year (e.g., 2015-2019)"
              className="text-sm"
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full text-sm"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Education
      </Button>
    </div>
  );
}

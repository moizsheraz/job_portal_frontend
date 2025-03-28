import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Experience } from "../../app/types/resume";
import { Plus, Trash2 } from 'lucide-react';

interface ExperienceFormProps {
  experience: Experience[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ExperienceForm({ experience, onAdd, onRemove, onChange }: ExperienceFormProps) {
  return (
    <div className="space-y-4 pt-2">
      {experience.map((exp, index) => (
        <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Experience #{index + 1}</h3>
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
              name="company"
              value={exp.company}
              onChange={(e) => onChange(index, e)}
              placeholder="Company Name"
              className="text-sm"
            />
            <Input
              type="text"
              name="position"
              value={exp.position}
              onChange={(e) => onChange(index, e)}
              placeholder="Job Position"
              className="text-sm"
            />
            <Input
              type="text"
              name="duration"
              value={exp.duration}
              onChange={(e) => onChange(index, e)}
              placeholder="Duration (e.g., Jan 2020 - Present)"
              className="text-sm"
            />
            <Textarea
              name="description"
              value={exp.description}
              onChange={(e) => onChange(index, e)}
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
        onClick={onAdd}
        className="w-full text-sm"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Experience
      </Button>
    </div>
  );
}

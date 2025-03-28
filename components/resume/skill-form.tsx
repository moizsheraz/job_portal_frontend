import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';

interface SkillsFormProps {
  skills: string[];
  newSkill: string;
  onNewSkillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function SkillsForm({ 
  skills, 
  newSkill, 
  onNewSkillChange, 
  onAddSkill, 
  onRemoveSkill,
  onKeyDown
}: SkillsFormProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={newSkill}
          onChange={onNewSkillChange}
          placeholder="Add a skill"
          className="text-sm"
          onKeyDown={onKeyDown}
        />
        <Button
          onClick={onAddSkill}
          size="sm"
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1">
            {skill}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveSkill(index)}
              className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-red-500 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

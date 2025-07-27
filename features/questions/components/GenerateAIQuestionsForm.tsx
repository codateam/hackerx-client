import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/Button/page";

interface GenerateAIQuestionsFormProps {
  values: GenerateAIQuestionsFormValues;
  onChange: (values: GenerateAIQuestionsFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface GenerateAIQuestionsFormValues {
  difficulty: "easy" | "medium" | "hard";
  question_types: string[];
  num_questions: number;
  mark: number;
  additional_context: string;
}

const QUESTION_TYPE_OPTIONS = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "essay", label: "Theory" },
  { value: "fill-in-the-blank", label: "German" },
];

const DIFFICULTY_OPTIONS: {value: "easy" | "medium" | "hard", label:string}[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const GenerateAIQuestionsForm: React.FC<GenerateAIQuestionsFormProps> = ({
  values,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  // For multi-select, we use a custom handler
  const handleQuestionTypeChange = (value: string) => {
    const newTypes = [value];
    // if (newTypes.includes(value)) {
    //   newTypes = newTypes.filter((t) => t !== value);
    // } else {
    //   newTypes.push(value);
    // }
    onChange({ ...values, question_types: newTypes });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <Label>Difficulty</Label>
        <Select
          value={values.difficulty}
          onValueChange={difficulty => onChange({ ...values, difficulty: difficulty as "easy" | "medium" | "hard" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Question Types</Label>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPE_OPTIONS.map(opt => (
            <button
              type="button"
              key={opt.value}
              className={`px-3 py-1 w-full rounded border ${values.question_types.includes(opt.value) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} transition`}
              onClick={() => handleQuestionTypeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Number of Questions</Label>
        <Input
          type="number"
          min={1}
          max={50}
          value={values.num_questions}
          onChange={e => onChange({ ...values, num_questions: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Mark</Label>
        <Input
          type="number"
          min={1}
          max={100}
          value={values.mark}
          onChange={e => onChange({ ...values, mark: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Additional Information</Label>
        <Textarea
          value={values.additional_context}
          onChange={e => onChange({ ...values, additional_context: e.target.value })}
          placeholder="Add any extra instructions for the AI..."
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </form>
  );
};

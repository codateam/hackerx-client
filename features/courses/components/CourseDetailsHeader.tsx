import React from "react";
import { ArrowLeft, Edit2, Trash2, Bot } from "lucide-react";
import { Button } from "@/components/Button/page";
import { useRouter } from "next/navigation";

interface CourseDetailsHeaderProps {
  role: "admin" | "lecturer" | "student";
  courseId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEnroll: () => void;
}

export const CourseDetailsHeader: React.FC<CourseDetailsHeaderProps> = ({
  role,
  courseId,
  onBack,
  onEdit,
  onEnroll,
  onDelete,
}) => {
  const router = useRouter();

  const handleAIChatNavigation = () => {
    router.push(`/ai/course/${courseId}`);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <Button size="lg" className="text-sm text-black" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      {role === "admin" && (
        <div className="hidden md:flex gap-4 mb-4 md:mb-6">
          <Button variant="default" className="text-sm" onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Course
          </Button>
          <Button variant="destructive" className="text-sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Course
          </Button>
        </div>
      )}

      {role === "student" && (
        <div className="hidden md:flex gap-4 mb-4 md:mb-6">
          <Button
            variant="secondary"
            className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            onClick={handleAIChatNavigation}
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Study Assistant
          </Button>
          <Button variant="default" className="text-sm" onClick={onEnroll}>
            <Edit2 className="w-4 h-4 mr-2" />
            Enroll in Course
          </Button>
        </div>
      )}

      {role === "lecturer" && (
        <div className="hidden md:flex gap-4 mb-4 md:mb-6">
          <Button variant="default" className="text-sm" onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Course
          </Button>
        </div>
      )}
    </div>
  );
};

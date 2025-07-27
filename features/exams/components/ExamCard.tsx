import { Exam } from "@/types/exam";
import { Button } from "@/components/Button/page";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishExam, deleteExam } from "@/features/exams/api"; // Added deleteExam import
import { toast } from "react-toastify";

interface ExamCardProps {
  exam: Exam;
  courseId: string;
  role: 'student' | 'lecturer' | 'admin';
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, courseId, role="admin" }) => {
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: () => publishExam(exam._id),
    onSuccess: () => {
      toast.success("Exam published successfully");
      queryClient.invalidateQueries({ queryKey: ["exams", courseId] });
      queryClient.invalidateQueries({ queryKey: ["exam", exam._id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish exam");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteExam(exam._id),
    onSuccess: () => {
      toast.success("Exam deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["exams", courseId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete exam");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{exam.title}</h3>
        {(role === "lecturer" || role === "admin") && (
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                exam.isPublished
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {exam.isPublished ? "Published" : "Draft"}
            </span>
            {role === "admin"  && (
              <Link href={`/admin/courses/${courseId}/exam/${exam._id}/edit`}>
                <Edit size={16} className="mr-2"/>
              </Link>
            )}
            {role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                title="Delete exam"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p><strong>Session:</strong> {exam.session}</p>
        <p><strong>Semester:</strong> {exam.semester}</p>
        <p><strong>Duration:</strong> {exam.duration} minutes</p>
        <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
      </div>
      <div className="flex justify-end gap-2">
        {role !== "student" && (
          <>
            <Button
              variant="default"
              onClick={() => {
          window.location.href = `/${role}/courses/${courseId}/exam/${exam._id}/questions`;
              }}
            >
              Manage Questions
            </Button>
            <Button
              variant="default"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending || exam.isPublished}
            >
              {publishMutation.isPending ? "Publishing..." : "Publish"}
            </Button>
          </>
        )}
        
        {role === "student" && (
          <Button asChild variant="default">
            <Link href={`/student/courses/${courseId}/exam/${exam._id}/assess`}>Take Exam</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
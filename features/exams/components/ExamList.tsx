import { Exam } from "@/types/exam";
import { ExamCard } from "@/features/exams/components/ExamCard";
import { Button } from "@/components/Button/page";

interface ExamListProps {
  exams: Exam[];
  courseId: string;
  role: 'student' | 'lecturer' | 'admin';
}

const ExamList = ({ exams, courseId, role="admin" }: ExamListProps) => {
  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center mt-10">
        <p className="text-center text-gray-500 mb-4">No exams found for this course.</p>
        <Button
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <ExamCard role={role} key={exam._id} exam={exam} courseId={courseId} />
      ))}
    </div>
  );
};

export default ExamList;

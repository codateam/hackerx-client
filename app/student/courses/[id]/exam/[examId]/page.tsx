"use client";

import { useParams } from "next/navigation";
import { useExamDetails } from "@/features/exams/hooks/useExamDetails";
import { ExamForm } from "@/features/exams/components/ExamForm";
import { Loader } from "lucide-react";

const ExamDetailsPage = () => {
  const { examId, id: courseId } = useParams<{ examId: string; id: string }>();
  const { data: examData, isLoading, error } = useExamDetails(examId);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={48} /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error fetching exam details: {error.message}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {examData?.data ? (
        <ExamForm courseId={courseId} exam={examData.data} />
      ) : (
        <p className="text-red-500 text-center mt-10">Exam not found</p>
      )}
    </div>
  );

};

export default ExamDetailsPage;

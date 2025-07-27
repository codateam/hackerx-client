"use client";

import { useParams } from "next/navigation";
import { useExamDetails } from "@/features/exams/hooks/useExamDetails";
import { Loader } from "lucide-react";
import { AssessmentPlayer } from "@/features/student-assessment/components/AssessmentPlayer";

const AssessmentPage = () => {
  const { examId } = useParams<{ examId: string; id: string }>();
  const { data: examData, isPending, error } = useExamDetails(examId);

  if (isPending) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={48} /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error fetching exam details: {error.message}</div>;
  }

  if (!examData) {
    return <div className="text-red-500 text-center mt-10">No exam found, check back again.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {examData?.data ? (
        <AssessmentPlayer exam={examData.data} />
      ) : (
        <div className="text-red-500 text-center mt-10">No exam data available.</div>
      )}
    </div>
  );
};

export default AssessmentPage;

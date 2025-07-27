"use client";

import { ExamForm } from "@/features/exams/components/ExamForm";
import { useParams } from "next/navigation";

const NewExamPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Exam</h1>
      <ExamForm courseId={courseId} />
    </div>
  );
};

export default NewExamPage;

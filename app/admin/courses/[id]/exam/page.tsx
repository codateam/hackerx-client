"use client";

import { useParams } from "next/navigation";
import { useExams } from "@/features/exams/hooks/useExams";
import ExamList from "../../../../../features/exams/components/ExamList";
import { Button } from "@/components/Button/page";
import Link from "next/link";
import { useCourseDetails } from "@/features/courses/hooks/UseCourseDetails";
import { Loader } from "lucide-react";

const ExamsPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const { course, loading: isCourseLoading } = useCourseDetails(courseId, "lecturer");
  const { data: examsData, isLoading: areExamsLoading, error } = useExams(courseId);

  if (isCourseLoading || areExamsLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={48} /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error fetching exams: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exams for {course?.title}</h1>
        <Button asChild>
          <Link href={`/admin/courses/${courseId}/exam/new`}>Create New Exam</Link>
        </Button>
      </div>
      <ExamList role="admin" exams={examsData?.data || []} courseId={courseId} />
    </div>
  );
};

export default ExamsPage;

"use client";

import { useParams } from "next/navigation";
import { useQuestions } from "@/features/questions/hooks/useQuestions";
import { QuestionList } from "@/features/questions/components/QuestionList";
import { BulkQuestionsFormInput } from "@/features/questions/lib/validation";
import { Loader } from "lucide-react";
import { useExamDetails } from "@/features/exams/hooks/useExamDetails";
import { QuestionForm } from "@/features/questions/components/QuestionForm";

const ManageQuestionsPage = () => {
  const params = useParams();
  const examId = params.examId as string;
  const courseId = params.id as string;

  const { data: exam, isLoading: isLoadingExam } = useExamDetails(examId);
  const {
    questions,
    isLoadingQuestions,
    createQuestions,
    isCreatingQuestions,
    deleteQuestion,
    isDeletingQuestion,
  } = useQuestions(examId);

  const handleFormSubmit = (data: BulkQuestionsFormInput) => {
    const payload = {
      exam: examId,
      questions: data.questions.map(q => ({ ...q, exam: examId }))
    };
    createQuestions(payload);
  };

  if (isLoadingExam) {
    return (
      <div className="flex justify-center items-center overflow-hidden">
        <Loader className="animate-spin" />
        <p className="ml-2">Loading exam details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 w-full overflow-hidden">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          Manage Questions for {exam?.data?.title}
        </h1>
        <p className="text-muted-foreground mb-6">
          Course: {typeof exam?.data?.course === 'object' && exam.data.course.title}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        <div className="lg:col-span-1">
          <QuestionForm 
            examId={examId} 
            courseId={courseId}
            onSubmit={handleFormSubmit} 
            isCreating={isCreatingQuestions} 
          />
        </div>
        <div className="lg:col-span-1">
          <QuestionList 
            questions={questions}
            onDelete={deleteQuestion}
            isDeleting={isDeletingQuestion}
            isLoading={isLoadingQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageQuestionsPage;

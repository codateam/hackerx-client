import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuestions, deleteQuestion, getQuestionsByExam, BulkCreateQuestionsPayload, autoGenerateQuestions } from "../api";
import { toast } from "react-toastify";
import { ResponseType } from "@/types/common";
import { IQuestion } from "@/types/question";

export const useQuestions = (examId: string) => {
  const queryClient = useQueryClient();

  // 1. Hook to fetch questions for an exam
  const { data: questions, isLoading: isLoadingQuestions, error: questionsError } = useQuery<ResponseType<IQuestion[]>, Error>({ 
    queryKey: ["questions", examId],
    queryFn: () => getQuestionsByExam(examId),
    enabled: !!examId, // Only run this query if examId is available
  });

  // 2. Hook to create questions in bulk
  const createQuestionsMutation = useMutation<
    ResponseType<IQuestion[]>, 
    Error, 
    BulkCreateQuestionsPayload
  >({
    mutationFn: createQuestions,
    onSuccess: (data) => {
      toast.success(data.message || "Questions created successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions", examId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create questions.");
    },
  });

  // 3. Hook to delete a single question
  const deleteQuestionMutation = useMutation<
    ResponseType<null>,
    Error,
    string // questionId
  >({
    mutationFn: deleteQuestion,
    onSuccess: (data) => {
      toast.success(data.message || "Question deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions", examId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete question.");
    },
  });

  return {
    questions: questions?.data || [],
    isLoadingQuestions,
    questionsError,
    createQuestions: createQuestionsMutation.mutate,
    isCreatingQuestions: createQuestionsMutation.isPending,
    deleteQuestion: deleteQuestionMutation.mutate,
    isDeletingQuestion: deleteQuestionMutation.isPending,
  };
};

export const useAutoGenerateQuestions = () => {
  const queryClient = useQueryClient();

  const autoGenerateQuestionsMutation = useMutation({
    mutationFn:autoGenerateQuestions,
    onSuccess: (data) => {
      toast.success( "Questions generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate questions.");
    },
  });

  return autoGenerateQuestionsMutation
}

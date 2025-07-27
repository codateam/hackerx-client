import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuestionsForExam, saveProgress, submitAnswers, getStudentProgress } from "../api";
import { SaveProgressPayload, SubmitAnswersPayload } from "../lib/types";
import { toast } from "react-toastify";

export const useExamQuestions = (examId: string) => {
  return useQuery({
    queryKey: ["examQuestions", examId],
    queryFn: () => getQuestionsForExam(examId),
    enabled: !!examId,
  });
};

export const useStudentProgress = (examId: string) => {
  return useQuery({
    queryKey: ["studentProgress", examId],
    queryFn: () => getStudentProgress(examId),
    enabled: !!examId,
  });
};

export const useSaveProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveProgressPayload) => saveProgress(payload),
    onSuccess: () => {
      toast.success("Progress saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["studentProgress"] });
    },
    onError: () => {
      toast.error("Failed to save progress. Please try again.");
    },
  });
};

export const useSubmitAnswers = () => {
  return useMutation({
    mutationFn: (payload: SubmitAnswersPayload) => submitAnswers(payload),
    onSuccess: () => {
      toast.success("Exam submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit exam. Please try again.");
    },
  });
};


import { IQuestion } from "@/types/question";
import { SaveProgressPayload, StudentProgressResponse, SubmitAnswersPayload } from "../lib/types";
import api from "@/configs/api-config";

export const getQuestionsForExam = (examId: string): Promise<IQuestion[]> => {
  return api.get(`/questions?exam=${examId}`).then(res => res.data.data);
};

export const saveProgress = (payload: SaveProgressPayload): Promise<any> => {
  return api.post("/answers/progress", payload);
};

export const submitAnswers = (payload: SubmitAnswersPayload): Promise<any> => {
  return api.post("/answers/submit", payload).then(res => res.data.data);
};

export const getStudentProgress = (examId: string): Promise<StudentProgressResponse> => {
  return api.get(`/answers/exam/${examId}`).then(res => res.data.data);
};

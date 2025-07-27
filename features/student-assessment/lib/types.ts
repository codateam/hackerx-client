import { IQuestion } from "@/types/question";

export interface Answer {
  question: string; // questionId
  selectedAnswer?: string; // for mcq
  writtenAnswer?: string; // for theory and german
}

export interface SaveProgressPayload {
  examId: string;
  answers: Answer[];
}

export interface SubmitAnswersPayload extends SaveProgressPayload {}

export interface StudentAnswer {
  _id: string;
  question: IQuestion;
  selectedAnswer?: string;
  writtenAnswer?: string;
}

export interface StudentProgressResponse {
  answers: StudentAnswer[];
  remainingTime: number;
}

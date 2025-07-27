import { isAxiosError } from "axios";
import api from "@/configs/api-config";
import { apiRoutes } from "../utils/question";
import { IQuestion } from "@/types/question";
import { ResponseType } from "@/types/common";

// This will be the type for a single question in the creation payload
export interface CreateQuestionInput {
  exam: string;
  type: "mcq" | "theory" | "german";
  text: string;
  options?: string[];
  correctAnswer?: string;
  mark: number;
}

// This is the type for the entire payload for the bulk create endpoint
export interface BulkCreateQuestionsPayload {
    exam: string;
    questions: CreateQuestionInput[];
}

const replacePath = (path: string, params: Record<string, string>) => {
  let result = path;
  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};

// 1. Create Questions (Bulk)
export const createQuestions = async (
  data: BulkCreateQuestionsPayload
): Promise<ResponseType<IQuestion[]>> => {
  try {
    const response = await api.post(apiRoutes.CREATE_QUESTIONS, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Questions created successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while creating questions.",
    };
  }
};

// 2. Get Questions by Exam
export const getQuestionsByExam = async (
  examId: string
): Promise<ResponseType<IQuestion[]>> => {
  try {
    const response = await api.get(`${apiRoutes.GET_QUESTIONS_BY_EXAM}?exam=${examId}`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while fetching questions.",
    };
  }
};

// 3. Delete Question
export const deleteQuestion = async (questionId: string): Promise<ResponseType<null>> => {
  try {
    const path = replacePath(apiRoutes.DELETE_QUESTION, { id: questionId });
    await api.delete(path);
    return {
      success: true,
      data: null,
      message: "Question deleted successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while deleting the question.",
    };
  }
};

interface AutoGenerateQuestionsInput {
  examId: string; 
  courseId: string;
  difficulty: "easy" | "medium" | "hard";
  question_types: string[]; // e.g., ["mcq", "theory",
  num_questions: number; // Number of questions to generate
  additional_context?: string; // Optional context for the AI
  mark: number; // Marks for each question
}

export const autoGenerateQuestions = async (data:AutoGenerateQuestionsInput): Promise<IQuestion[]> => {
  const res = await api.post(`/questions/generate`, {
     examId:data.examId,
    course_id: data.courseId,
    difficulty: data.difficulty,
    question_types:data.question_types,
    num_questions:data.num_questions,
    additional_context: data.additional_context ,
    mark: data.mark,
  });

  return res.data.data ;
}
import { isAxiosError } from "axios";
import { z } from "zod";
import api from "@/configs/api-config";
import { apiRoutes } from "../utils/exam";
import { AddExamValidationSchema } from "../lib/validation";
import { Exam, ResponseType } from "@/types/exam";

const replacePath = (path: string, params: Record<string, string>) => {
  let result = path;
  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};

export const createExam = async (
  courseId: string,
  data: z.infer<typeof AddExamValidationSchema> & { endTime: string }
): Promise<ResponseType<Exam>> => {
  try {
    const response = await api.post(apiRoutes.CREATE_EXAM, {
      ...data,
      course: courseId,
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Exam created successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while creating the exam.",
    };
  }
};

export const getExamsByCourse = async (
  courseId: string
): Promise<ResponseType<Exam[]>> => {
  try {
    const response = await api.get(`${apiRoutes.GET_ALL_EXAMS_IN_COURSE}?course=${courseId}`);
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
      message: message ?? "An error occurred while fetching exams.",
    };
  }
};

export const getExamById = async (examId: string): Promise<ResponseType<Exam>> => {
  try {
    const path = replacePath(apiRoutes.GET_EXAM_BY_ID, { id: examId });
    const response = await api.get(path);
    return {
      success: true,
      data: response.data.data,
      message: "Exam fetched successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while fetching exam details.",
    };
  }
};

export const updateExam = async (
  examId: string,
  data: Partial<z.infer<typeof AddExamValidationSchema> & { endTime: string }>
): Promise<ResponseType<Exam>> => {
  try {
    const path = replacePath(apiRoutes.UPDATE_EXAM, { id: examId });
    const response = await api.put(path, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Exam updated successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while updating the exam.",
    };
  }
};

export const deleteExam = async (examId: string): Promise<ResponseType<null>> => {
  try {
    const path = replacePath(apiRoutes.DELETE_EXAM, { id: examId });
    await api.delete(path);
    return {
      success: true,
      data: null,
      message: "Exam deleted successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while deleting the exam.",
    };
  }
};

export const publishExam = async (examId: string): Promise<ResponseType<Exam>> => {
  try {
    const path = replacePath(apiRoutes.PUBLISH_EXAM, { id: examId });
    const response = await api.post(path);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Exam published successfully",
    };
  } catch (error) {
    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while publishing the exam.",
    };
  }
};

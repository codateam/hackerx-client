import { cookiesStorage } from "@/lib/storage";
import { isAxiosError } from "axios";
import {
  EnrollmentCreateSchema,
  EnrollmentUpdateSchema,
} from "../lib/validation";
import { Enrollment, ResponseType } from "@/types/enrollment";
import { enrollmentRoutes } from "../utils/enrollment";
import api from "@/configs/api-config";
import { z } from "zod";

/**
 * Replace path parameters with actual values
 */
const replacePath = (path: string, params: Record<string, string>): string => {
  let result = path;
  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};

/**
 * Extract error message from API response
 */
const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallbackMessage;
};

/**
 * Check if user is authenticated
 */
const checkAuthentication = (): {
  isAuthenticated: boolean;
  token: string | null;
} => {
  const token = cookiesStorage.getItem("token");
  return {
    isAuthenticated: !!token,
    token,
  };
};

/**
 * Create a new enrollment (Student enrolls in a course)
 */
export const createEnrollment = async (
  data: z.infer<typeof EnrollmentCreateSchema>
): Promise<ResponseType<Enrollment>> => {
  try {
    const { isAuthenticated } = checkAuthentication();

    if (!isAuthenticated) {
      return {
        success: false,
        data: null,
        message: "Please login to enroll in courses.",
      };
    }

    const response = await api.post(enrollmentRoutes.CREATE_ENROLLMENT, {
      course: data.course,
      level: data.level,
      semester: data.semester,
      session: data.session,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Enrolled successfully!",
    };
  } catch (error) {
    console.error("Enrollment creation error:", error);

    return {
      success: false,
      data: null,
      message: getErrorMessage(
        error,
        "Failed to enroll in course. Please try again."
      ),
    };
  }
};

/**
 * Fetch all enrollments with optional filtering
 */
export const getAllEnrollments = async (params?: {
  status?: string;
  semester?: string;
  session?: string;
  level?: string;
}): Promise<ResponseType<{ count: number; enrollments: Enrollment[] }>> => {
  try {
    const { isAuthenticated } = checkAuthentication();

    if (!isAuthenticated) {
      return {
        success: false,
        data: null,
        message: "Please login to view enrollments.",
      };
    }

    let url = enrollmentRoutes.GET_ALL_ENROLLMENTS;

    // Add query parameters if provided
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.trim()) {
          queryParams.append(key, value.trim());
        }
      });

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const response = await api.get(url);

    return {
      success: true,
      data: {
        count: response.data.data.count,
        enrollments: response.data.data.enrollments,
      },
      message: response.data.message || "Enrollments retrieved successfully",
    };
  } catch (error) {
    console.error("Fetch enrollments error:", error);

    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to fetch enrollments."),
    };
  }
};

/**
 * Update an enrollment (Used by lecturers/admins to update scores, grades, status)
 */
export const updateEnrollment = async (
  enrollmentId: string,
  data: z.infer<typeof EnrollmentUpdateSchema>
): Promise<ResponseType<Enrollment>> => {
  try {
    const { isAuthenticated } = checkAuthentication();

    if (!isAuthenticated) {
      return {
        success: false,
        data: null,
        message: "Please login to update enrollments.",
      };
    }

    if (!enrollmentId) {
      return {
        success: false,
        data: null,
        message: "Enrollment ID is required.",
      };
    }

    const updatePath = replacePath(enrollmentRoutes.UPDATE_ENROLLMENT, {
      id: enrollmentId,
    });

    const updatePayload: Record<string, any> = {};

    // Only include fields that have values
    if (data.score !== undefined) updatePayload.score = data.score;
    if (data.grade) updatePayload.grade = data.grade;
    if (data.status) updatePayload.status = data.status;

    const response = await api.put(updatePath, updatePayload);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Enrollment updated successfully",
    };
  } catch (error) {
    console.error("Update enrollment error:", error);

    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to update enrollment."),
    };
  }
};

/**
 * Drop/Delete an enrollment (Used by students/admins to drop a course)
 */
export const dropEnrollment = async (
  enrollmentId: string
): Promise<ResponseType<Enrollment>> => {
  try {
    const { isAuthenticated } = checkAuthentication();

    if (!isAuthenticated) {
      return {
        success: false,
        data: null,
        message: "Please login to drop enrollments.",
      };
    }

    if (!enrollmentId) {
      return {
        success: false,
        data: null,
        message: "Enrollment ID is required.",
      };
    }

    const deletePath = replacePath(enrollmentRoutes.DELETE_ENROLLMENT, {
      id: enrollmentId,
    });

    const response = await api.delete(deletePath);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Course dropped successfully",
    };
  } catch (error) {
    console.error("Drop enrollment error:", error);

    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to drop course."),
    };
  }
};

/**
 * Get enrollments by status
 */
export const getEnrollmentsByStatus = async (
  status: "active" | "completed" | "dropped"
): Promise<ResponseType<{ count: number; enrollments: Enrollment[] }>> => {
  return getAllEnrollments({ status });
};

/**
 * Get enrollments for current session
 */
export const getCurrentSessionEnrollments = async (
  session: string
): Promise<ResponseType<{ count: number; enrollments: Enrollment[] }>> => {
  return getAllEnrollments({ session });
};

/**
 * Get active enrollments only
 */
export const getActiveEnrollments = async (): Promise<
  ResponseType<{ count: number; enrollments: Enrollment[] }>
> => {
  return getEnrollmentsByStatus("active");
};

/**
 * Complete an enrollment (shorthand for updating status to completed)
 */
export const completeEnrollment = async (
  enrollmentId: string,
  score?: number,
  grade?: string
): Promise<ResponseType<Enrollment>> => {
  return updateEnrollment(enrollmentId, {
    status: "completed",
    ...(score !== undefined && { score }),
    ...(grade && { grade }),
  });
};

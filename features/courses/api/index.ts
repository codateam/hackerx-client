import { isAxiosError } from "axios";
import {
  AddCourseValidationSchema,
  AssignLecturerSchema,
} from "../lib/validation";
import { Course, Lecturer, ResponseType } from "@/types/course";
import { z } from "zod";
import api from "@/configs/api-config";
import { apiRoutes } from "../utils/course";
import { cookiesStorage } from "@/lib/storage";

/**
 * Helper function to replace path parameters
 */
const replacePath = (path: string, params: Record<string, string>) => {
  let result = path;
  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};

/**
 * Fetch all courses from the backend
 */
export const fetchAllCourses = async (): Promise<
  ResponseType<{ count: number; courses: Course[] }>
> => {
  try {
    const response = await api.get(apiRoutes.GET_ALL_COURSES);

    return {
      success: true,
      data: response.data.data, // 🟢 FIX: unwrap the nested 'data'
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
      message: message ?? "An error occurred while fetching courses.",
    };
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (
  courseId: string
): Promise<ResponseType<Course>> => {
  try {
    const path = replacePath(apiRoutes.GET_COURSE_ID, { id: courseId });
    const response = await api.get(path);

    return {
      success: true,
      data: response.data.data,
      message: "Course fetched successfully",
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while fetching course details.",
    };
  }
};

/**
 * Get courses assigned to the logged-in lecturer
 */
export const getMyCoursesAsLecturer = async (): Promise<
  ResponseType<Course[]>
> => {
  try {
    const response = await api.get(apiRoutes.GET_MY_COURSES);
    const courses = response.data?.data?.courses || [];

    return {
      success: true,
      data: courses,
      message: response.data?.message || "Your courses fetched successfully",
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while fetching your courses.",
    };
  }
};

/**
 * Get all lecturers with optional search by name
 */
export const getAllLecturers = async (
  searchQuery?: string
): Promise<ResponseType<Lecturer[]>> => {
  try {
    let url = apiRoutes.GET_ALL_LECTURERS;

    if (searchQuery && searchQuery.trim()) {
      url += `?search=${encodeURIComponent(searchQuery.trim())}`;
    }
    console.log({ searchQuery, url });

    const response = await api.get(url);

    return {
      success: true,
      data: response.data.data.users,
      message: response.data.message || "Lecturers fetched successfully",
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while fetching lecturers.",
    };
  }
};

/**
 * Create a new course
 */
export const createCourse = async (
  data: z.infer<typeof AddCourseValidationSchema>
): Promise<ResponseType<Course>> => {
  try {
    const response = await api.post(apiRoutes.CREATE_COURSE, {
      title: data.title,
      code: data.code,
      description: data.description,
      creditUnit: data.creditUnit,
      level: data.level,
      semester: data.semester,
      department: data.department,
      courseMaterials: data.courseMaterials,
    });

    console.log("API response:", response);

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Course created successfully",
    };
  } catch (error) {
    console.error("API error:", error);

    let message;
    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while creating the course.",
    };
  }
};

/**
 * Update an existing course
 */
export const updateCourse = async (
  id: string,
  data: z.infer<typeof AddCourseValidationSchema> & { lecturerId?: string }
): Promise<ResponseType<Course>> => {
  try {
    const updatePayload = {
      title: data.title,
      code: data.code,
      description: data.description,
      creditUnit: data.creditUnit,
      level: data.level,
      semester: data.semester,
      department: data.department,
      ...(data.lecturerId && { lecturerId: data.lecturerId }),
      courseMaterials: data.courseMaterials,
    };

    const updateUrl = apiRoutes.UPDATE_COURSE.includes(":id")
      ? apiRoutes.UPDATE_COURSE.replace(":id", id)
      : `${apiRoutes.UPDATE_COURSE}/${id}`;

    const response = await api.put(updateUrl, updatePayload);

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Course updated successfully",
    };
  } catch (error) {
    console.error("API update error:", error);

    let message = "An error occurred while updating the course.";

    if (isAxiosError(error)) {
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
    }

    return {
      success: false,
      data: null,
      message,
    };
  }
};

/**
 * Assign a lecturer to a course
 */
export const assignLecturerToCourse = async (
  courseId: string,
  data: z.infer<typeof AssignLecturerSchema>
): Promise<ResponseType<Course>> => {
  try {
    const path = replacePath(apiRoutes.ASSIGN_LECTURER, { id: courseId });
    const response = await api.post(path, {
      lecturerId: data.lecturerId,
    });

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Lecturer assigned successfully",
    };
  } catch (error) {
    let message;

    if (isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      data: null,
      message: message ?? "An error occurred while assigning the lecturer.",
    };
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (
  courseId: string
): Promise<ResponseType<null>> => {
  try {
    const token = cookiesStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        data: null,
        message: "Not authenticated. Please login first.",
      };
    }

    const deleteUrl = apiRoutes.DELETE_COURSE.includes(":id")
      ? apiRoutes.DELETE_COURSE.replace(":id", courseId)
      : `${apiRoutes.DELETE_COURSE}/${courseId}`;

    const response = await api.delete(deleteUrl);

    return {
      success: true,
      data: null,
      message: response.data?.message || "Course deleted successfully",
    };
  } catch (error) {
    console.error("Delete course error:", error);

    return {
      success: false,
      data: null,
      message: "An unexpected error occurred while deleting the course.",
    };
  }
};

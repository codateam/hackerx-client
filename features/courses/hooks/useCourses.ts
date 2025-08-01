import { useState, useCallback } from "react";
import { deleteCourse, fetchAllCourses, getMyCoursesAsLecturer, getCourseById } from "@/features/courses/api";
import { Course } from "@/types/course";
import { toast } from "react-toastify";

export const useCourses = (userRole?: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    if (!userRole) return;
    
    try {
      setLoading(true);
      let response;
      
      if (userRole === "lecturer") {
        response = await getMyCoursesAsLecturer();
      } else {
        response = await fetchAllCourses();
      }

      if (response?.success) {
        const coursesData = userRole === "lecturer" 
          ? response.data || []
          : response.data?.courses || [];
        
        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
          setError(null);
        } else {
          setCourses([]);
          setError("Invalid data format received");
        }
      } else {
        setError(response?.message || "Failed to fetch courses");
        setCourses([]);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("An error occurred while fetching courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  const removeCourse = useCallback(async (courseId: string) => {
    try {
      const response = await deleteCourse(courseId);
      
      if (response.success) {
        setCourses(prev => prev.filter(course => 
          (course.id || course._id) !== courseId
        ));
        toast.success("Course deleted successfully");
        return true;
      } else {
        toast.error(response.message || "Failed to delete course");
        return false;
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("An error occurred while deleting the course");
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    courses,
    loading,
    error,
    loadCourses,
    removeCourse,
    clearError
  };
};

export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const response = await getCourseById(courseId);

      if (response?.success && response.data) {
        setCourse(response.data);
        setError(null);
      } else {
        setError(response?.message || "Failed to fetch course details");
        setCourse(null);
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError("An error occurred while fetching course details");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    course,
    loading,
    error,
    loadCourse,
    clearError
  };
};
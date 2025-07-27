import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCourseById, deleteCourse } from "@/features/courses/api";
import { Course } from "@/types/course";

export const useCourseDetails = (courseId: string, role: "admin" | "lecturer" | "student") => {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(courseId);
        if (response.success && response.data) {
          setCourse(response.data);
        } else {
          setError("Failed to fetch course details.");
        }
      } catch (error) {
        setError("An error occurred while fetching course details.");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleDelete = async () => {
    if (role !== "admin") {
      toast.error("Only administrators can delete courses");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await deleteCourse(courseId);
      if (response.success) {
        toast.success("Course deleted successfully");
        router.push(`${role === "admin" ? "/admin" : "/lecturer"}/courses`);
      } else {
        toast.error(response.message || "Failed to delete course");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the course");
      console.error("Delete error:", error);
    }
  };

  const navigateBack = (onBack?: () => void) => {
    if (onBack) {
      onBack();
    } else {
      router.push(`${role === "admin" ? "/admin" : "/lecturer"}/courses`);
    }
  };

  const navigateToEdit = () => {
    router.push(`/admin/courses/edit/${courseId}`);
  };

  const handleEnroll = () => {
    router.push(`/student/courses/enroll/${courseId}`);
  };

  return {
    course,
    loading,
    error,
    handleDelete,
    navigateBack,
    navigateToEdit,
    handleEnroll,
  };
};
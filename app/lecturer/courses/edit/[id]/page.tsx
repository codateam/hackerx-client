"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourseById } from "@/features/courses/api";
import { Course } from "@/types/course";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CourseForm from "@/features/courses/components/CourseForm";

const EditCoursePage = () => {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Course ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await getCourseById(courseId);

        if (response.success && response.data) {
          console.log("Course data fetched:", response.data);
          setCourse(response.data);
        } else {
          console.error("Failed to fetch course:", response.message);
          setError(response.message || "Failed to fetch course details");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("An error occurred while fetching course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSuccess = (updatedCourse?: Course) => {
    console.log("Course updated successfully:", updatedCourse);
    // Navigate back to courses list
    router.push(`${user?.role === "admin" ? "/admin" : "/lecturer"}/courses`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
          <button className="ml-2 underline" onClick={() => router.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Course not found</p>
          <button
            className="mt-2 text-blue-600 underline"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseForm
      isAdmin={user?.role === "admin"}
      initialData={course}
      onSuccess={handleSuccess}
    />
  );
};

export default EditCoursePage;

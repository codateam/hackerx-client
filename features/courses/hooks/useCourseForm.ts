import { useState, useEffect } from "react";
import { z } from "zod";
import { CourseFormData, Lecturer } from "@/types/course";
import { getAllLecturers } from "../api";
import {
  AddCourseValidationSchema,
  AssignLecturerSchema,
} from "../lib/validation";

const AdminCourseSchema = AddCourseValidationSchema.merge(AssignLecturerSchema);

export const useCourseForm = (isAdmin: boolean, initialData: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(false);
  const [lecturerSearchQuery, setLecturerSearchQuery] = useState("");

  const isEditSession = Boolean(initialData);
  const isEditing = Boolean(initialData?._id || initialData?.id);

  const [courseData, setCourseData] = useState<Partial<CourseFormData>>(
    isEditSession
      ? {
          title: initialData?.title || "",
          code: initialData?.code || "",
          description: initialData?.description || "",
          creditUnit: initialData?.creditUnit || 1,
          level: initialData?.level || 100,
          semester: initialData?.semester || "First",
          department: initialData?.department || "",
          lecturerId: initialData?.lecturers?.[0]?.id || "",
          courseMaterials: initialData?.courseMaterials || [],
        }
      : {
          title: "",
          code: "",
          description: "",
          creditUnit: 1,
          level: 100,
          semester: "First",
          department: "",
          lecturerId: "",
          courseMaterials: [],
        }
  );

  const fetchLecturers = async (searchQuery?: string) => {
    setIsLoadingLecturers(true);
    try {
      const response = await getAllLecturers(searchQuery);
      if (response.success && response.data) {
        setLecturers(response.data);
      } else {
        setLecturers([]);
      }
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      setLecturers([]);
    } finally {
      setIsLoadingLecturers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchLecturers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const timeoutId = setTimeout(() => {
      if (lecturerSearchQuery.trim()) {
        fetchLecturers(lecturerSearchQuery.trim());
      } else {
        fetchLecturers();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [lecturerSearchQuery, isAdmin]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name: string, value: string) => {
    setCourseData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value, 10) : value,
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    if (!isNaN(value)) {
      setCourseData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (onSuccess: (data: any) => void) => {
    setIsSubmitting(true);
    setError("");

    try {
      const validatedData = isAdmin
        ? AdminCourseSchema.parse(courseData)
        : AddCourseValidationSchema.parse(courseData);

      // Call the onSuccess callback with the validated data
      // The actual API call will be handled in the component
      await onSuccess(validatedData);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          `An error occurred while ${
            isEditing ? "updating" : "creating"
          } the course.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    courseData,
    setCourseData,
    isSubmitting,
    error,
    lecturers,
    isLoadingLecturers,
    lecturerSearchQuery,
    isEditing,
    handleChange,
    handleCustomChange,
    handleNumberChange,
    handleSubmit,
    setLecturerSearchQuery,
  };
};

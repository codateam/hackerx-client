"use client";
import React from "react";
import Link from "next/link";
import { CourseFormProps } from "@/types/course";
import { Button } from "@/components/Button/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCourseForm } from "../hooks/useCourseForm";
import { CourseBasicFields } from "./CourseBasicFields";
import { CourseSidebar } from "./CourseSidebar";
import { CourseBreadcrumb } from "./CourseBreadcrumb";
import { toast } from "react-toastify";
import { createCourse, updateCourse } from "../api";

export default function CourseForm({
  isAdmin = false,
  initialData = null,
  onSuccess = () => {},
}: CourseFormProps) {
  const { user } = useAuth();
  const {
    courseData,
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
    setCourseData, 
  } = useCourseForm(isAdmin, initialData);

  const courseManagePath = user?.role === "admin" ? "/admin/courses" : "/lecturer/courses";

  const handleMaterialsUploaded = (urls: string[]) => {

    console.log({handleMaterialsUploaded: urls})
    setCourseData(prev => ({
      ...prev,
      courseMaterials: urls
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleSubmit(async (validatedData) => {
      try {
        const dataWithFiles = {
          ...validatedData,
          courseMaterials: courseData.courseMaterials || [], 
        };
        
        let result;
        if (isEditing) {
          const courseId = initialData?._id || initialData?.id;
          if (!courseId) {
            throw new Error('Course ID is required for updating');
          }
          result = await updateCourse(courseId, dataWithFiles);
        } else {
          result = await createCourse(dataWithFiles);
        }
        
        if (result.success) {
          toast.success(result.message);
          onSuccess(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Submit error:', error);
        const errorMessage = error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} course`;
        toast.error(errorMessage);
        throw error;
      }
    });
  };

  return (
    <main className="container md:px-6 py-8">
      <CourseBreadcrumb userRole={user?.role || ""} isEditing={isEditing} />

      <h1 className="text-base lg:text-2xl font-semibold py-4 lg:py-6 text-black">
        {isEditing ? "Edit Course" : "Create Course"}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <CourseBasicFields
            courseData={courseData}
            handleChange={handleChange}
            handleCustomChange={handleCustomChange}
            handleNumberChange={handleNumberChange}
          />

          <CourseSidebar
            isAdmin={isAdmin}
            lecturers={lecturers}
            isLoadingLecturers={isLoadingLecturers}
            lecturerSearchQuery={lecturerSearchQuery}
            courseData={courseData}
            setLecturerSearchQuery={setLecturerSearchQuery}
            handleCustomChange={handleCustomChange}
            onMaterialsUploaded={handleMaterialsUploaded}
            existingMaterials={courseData.courseMaterials || []}
          />

          <div className="flex items-center space-x-4 justify-between">
            <Link href={courseManagePath}>
              <Button size="lg" className="px-6 py-2 rounded-md">
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              className="px-6 py-2 text-white rounded-md hover:bg-blue-800 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing ? "Updating..." : "Creating..."
                : isEditing ? "Update Course" : "Save Course"}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
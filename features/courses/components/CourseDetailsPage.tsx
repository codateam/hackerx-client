"use client";
import React from "react";
import { useCourseDetails } from "../hooks/UseCourseDetails";
import { CourseDetailsHeader } from "./CourseDetailsHeader";
import { CourseDetailsCard } from "./CourseDetailsCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";

interface CourseDetailsProps {
  role: "admin" | "lecturer" | "student";
  courseId: string;
  onBack?: () => void;
}

export default function CourseDetailsPage({ role, courseId, onBack }: CourseDetailsProps) {
  const {
    course,
    loading,
    error,
    handleDelete,
    navigateBack,
    navigateToEdit,
    handleEnroll,
  } = useCourseDetails(courseId, role);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onGoBack={() => navigateBack(onBack)}
      />
    );
  }

  if (!course) {
    return (
      <ErrorState
        message="Course not found"
        onGoBack={() => navigateBack(onBack)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetailsHeader
        role={role}
        onBack={() => navigateBack(onBack)}
        onEdit={navigateToEdit}
        onDelete={handleDelete}
        onEnroll={handleEnroll}
      />

      <CourseDetailsCard course={course} />
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "../Button/page";
import { toast } from "react-toastify";

import { useCourses } from "@/features/courses/hooks/useCourses";
import { useDeleteModal } from "@/features/courses/hooks/useDeleteModal";
import { CoursesList } from "@/features/courses/components/CourseList";
import { DeleteConfirmationModal } from "@/features/courses/components/DeleteConfirmationModal";

export default function BaseCoursesComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    courses,
    loading,
    error,
    loadCourses,
    removeCourse,
    clearError
  } = useCourses(user?.role);

  const {
    deleteModal,
    openDeleteModal,
    closeDeleteModal
  } = useDeleteModal();

  const basePath = user?.role === "admin" ? "/admin" : "/lecturer";

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user, loadCourses]);

  const handleAction = (action: "view" | "edit" | "exam", courseId: string) => {
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }

    const routes = {
      view: `${basePath}/courses/${courseId}`,
      edit: `${basePath}/courses/edit/${courseId}`,
      exam: `${basePath}/courses/${courseId}/exam`,
    };

    router.push(routes[action]);
  };

  const handleDeleteClick = (courseId: string) => {
    if (user?.role !== "admin") {
      toast.error("Only administrators can delete courses");
      return;
    }
    openDeleteModal(courseId);
  };

  const handleDeleteConfirm = async () => {
    const { courseId } = deleteModal;
    if (!courseId) return;

    setDeleteLoading(true);
    const success = await removeCourse(courseId);

    if (success) {
      closeDeleteModal();
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-base md:text-2xl font-bold">Course Management</h1>
          <Button
            className="text-white py-2 md:px-4 rounded-md"
            onClick={() => router.push(`${basePath}/courses/create-course`)}
          >
            Add New Course
          </Button>
        </div>

        <CoursesList
          courses={courses}
          loading={loading}
          error={error}
          onView={(id) => handleAction("view", id)}
          onEdit={(id) => handleAction("edit", id)}
          onExams={(id) => handleAction("exam", id)}
          onDelete={handleDeleteClick}
          onClearError={clearError}
          showDeleteButton={user?.role === "admin"}

        />
      </div>
    </>
  );
}
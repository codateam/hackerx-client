import { useState, useCallback } from "react";

export const useDeleteModal = () => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    courseId: string | null;
  }>({
    isOpen: false,
    courseId: null,
  });

  const openDeleteModal = useCallback((courseId: string) => {
    setDeleteModal({ isOpen: true, courseId });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, courseId: null });
  }, []);

  return {
    deleteModal,
    openDeleteModal,
    closeDeleteModal
  };
};
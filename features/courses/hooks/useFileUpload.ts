import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  uploadCourseFiles,
  FileUploadResponse,
} from "../services/fileUploadService";
import { toast } from "react-toastify";

export const useCourseFileUpload = () => {
  const [progress, setProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);

  const mutation = useMutation({
    mutationFn: (files: File[]) =>
      uploadCourseFiles(files, (percent) => setProgress(percent)),
    onSuccess: (data) => {
      setUploadedFiles((prev) => [...prev, ...data]);
      toast.success(`${data.length} file(s) uploaded successfully`);
      setProgress(0);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${(error as Error).message}`);
      setProgress(0);
    },
  });

  const resetUpload = () => {
    setUploadedFiles([]);
    setProgress(0);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return {
    ...mutation,
    isLoading: mutation.isPending, // For backward compatibility
    progress,
    uploadedFiles,
    resetUpload,
    removeFile,
  };
};

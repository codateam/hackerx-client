import axios from "axios";

export interface FileUploadResponse {
  success: boolean;
  secure_url: string;
  id: string;
}

export const uploadCourseFiles = async (
  files: File[],
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<FileUploadResponse>(
      "/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (onProgress) {
      const progressPercent = Math.round(((index + 1) / files.length) * 100);
      onProgress(progressPercent);
    }

    return response.data;
  });

  return Promise.all(uploadPromises);
};

// Single file upload function
export const uploadSingleFile = async (
  file: File
): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<FileUploadResponse>(
    "/api/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

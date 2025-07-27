import React, { useRef, useState } from "react";
import { useCourseFileUpload } from "../hooks/useFileUpload";
import { FileUploadResponse } from "../services/fileUploadService";
import { X, FileText, Upload } from "lucide-react";
import { toast } from "react-toastify";

interface FileUploadZoneProps {
  onFilesUploaded: (urls: string[]) => void;
  multiple?: boolean;
  acceptedTypes?: string;
  maxFiles?: number;
  existingFiles?: string[];
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesUploaded,
  multiple = true,
  acceptedTypes = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mp3",
  maxFiles = 10,
  existingFiles = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { mutate, isPending, progress, uploadedFiles, removeFile } = useCourseFileUpload();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const totalFiles = uploadedFiles.length + existingFiles.length + fileArray.length;
    
    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = fileArray.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !acceptedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    mutate(fileArray, {
      onSuccess: (data: FileUploadResponse[]) => {
        console.log("Files uploaded successfully:", data);
        const urls = data.map(file => file.secure_url);
        onFilesUploaded(urls);
      }
    });
  };

  const handleClick = () => {
    if (!isPending) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isPending) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isPending) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (fileId: string, url: string) => {
    removeFile(fileId);
    const remainingUrls = uploadedFiles
      .filter(file => file.id !== fileId)
      .map(file => file.secure_url);
    onFilesUploaded(remainingUrls);
  };

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('.')[0] || 'Unknown file';
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-[#0000FF]'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        focus:border-[#0000FF] focus:ring-0 focus:outline-none md:h-[170px] px-6 rounded-md py-6 md:py-12 flex flex-col items-center justify-center transition-colors`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mb-2">
          {isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : (
            <Upload className="w-6 h-6 text-blue-600" />
          )}
        </div>
        
        {isPending ? (
          <div className="text-center w-full">
            <span className="text-sm font-medium text-black">Uploading...</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 mt-1">{progress}%</span>
          </div>
        ) : (
          <>
            <span className="text-sm font-medium text-black">
              {multiple ? 'Upload Files' : 'Upload File'}
            </span>
            <span className="text-xs text-gray-500 mt-1 text-center">
              Drag & drop or click to browse<br />
              {acceptedTypes.replace(/\./g, '').toUpperCase()} files only
            </span>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={isPending}
      />

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Existing Files:</h4>
          <div className="space-y-2">
            {existingFiles.map((url, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm truncate">{getFileName(url)}</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Existing</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newly Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm truncate">{getFileName(file.secure_url)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-600 font-medium">✓ Uploaded</span>
                  <button
                    onClick={() => handleRemoveFile(file.id, file.secure_url)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Count Info */}
      <div className="text-xs text-gray-500 text-center">
        {existingFiles.length + uploadedFiles.length} of {maxFiles} files
      </div>
    </div>
  );
};

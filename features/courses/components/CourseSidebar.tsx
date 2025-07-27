import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lecturer } from "@/types/course";
import { FileUploadZone } from "./FileUploadZone";

interface CourseSidebarProps {
  isAdmin: boolean;
  lecturers: Lecturer[];
  isLoadingLecturers: boolean;
  lecturerSearchQuery: string;
  courseData: any;
  setLecturerSearchQuery: (query: string) => void;
  handleCustomChange: (name: string, value: string) => void;
  onMaterialsUploaded: (urls: string[]) => void;
  existingMaterials?: string[]; // For edit mode
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  isAdmin,
  lecturers,
  isLoadingLecturers,
  lecturerSearchQuery,
  courseData,
  setLecturerSearchQuery,
  handleCustomChange,
  onMaterialsUploaded,
  existingMaterials = []
}) => {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <label className="block mb-2 font-medium">
          Course Material
        </label>
        <FileUploadZone 
          onFilesUploaded={onMaterialsUploaded}
          multiple={true}
          acceptedTypes=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mp3,.zip"
          maxFiles={10}
          existingFiles={existingMaterials}
        />
      </div>

      {isAdmin && (
        <div>
          <label htmlFor="lecturerId" className="block mb-2 font-medium">
            Assign lecturer
          </label>

          <div className="mb-2">
            <Input
              type="text"
              placeholder="Search lecturers by name..."
              value={lecturerSearchQuery}
              onChange={(e) => setLecturerSearchQuery(e.target.value)}
              className="w-full border border-gray-300 focus:border-[#0000FF] focus:ring-0 focus:outline-none px-3 py-2 rounded-md text-sm"
            />
          </div>

          <Select
            value={courseData.lecturerId || ""}
            onValueChange={(val) => handleCustomChange("lecturerId", val)}
          >
            <SelectTrigger
              className="w-full md:px-6 py-3 border border-[#0000FF] focus:ring-0 focus:outline-none rounded-md"
              id="lecturerId"
            >
              <SelectValue
                placeholder={
                  isLoadingLecturers ? "Loading lecturers..." : "Select lecturer"
                }
              />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {isLoadingLecturers ? (
                  <SelectItem value="loading" disabled>
                    Loading lecturers...
                  </SelectItem>
                ) : !Array.isArray(lecturers) || lecturers.length === 0 ? (
                  <SelectItem value="no-lecturers" disabled>
                    No lecturers found
                  </SelectItem>
                ) : (
                  lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.title ? `${lecturer.title} ` : ""}
                      {lecturer.firstName}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <Image
            src="/images/course-illustration.png"
            alt="Course illustration"
            width={400}
            height={320}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
import React from "react";
import { Course } from "@/types/course";

interface CourseDetailsCardProps {
  course: Course;
}

export const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({ course }) => {
  const courseFields = [
    { label: "Level", value: `${course.level} Level` },
    { label: "Semester", value: `${course.semester} Semester` },
    { label: "Credit Units", value: course.creditUnit },
    { label: "Department", value: course.department },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="space-y-6">
        {/* Course Header */}
        <div className="border-b pb-4">
          <h1 className="text-4xl font-bold  mb-2">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
              {course.code}
            </span>
            <span>{course.creditUnit} Credit Units</span>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courseFields.map((field) => (
            <div key={field.label} className="bg-gray-50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {field.label}
              </dt>
              <dd className="mt-2 text-lg font-semibold text-gray-900">{field.value}</dd>
            </div>
          ))}
        </div>

        {/* Course Description */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Description
          </dt>
          <dd className="text-gray-900 leading-relaxed">
            {course.description || (
              <span className="italic text-gray-500">No description provided</span>
            )}
          </dd>
        </div>
      </div>
    </div>
  );
};
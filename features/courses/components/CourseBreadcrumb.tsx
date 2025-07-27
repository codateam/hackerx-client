import React from "react";
import Link from "next/link";

interface CourseBreadcrumbProps {
  userRole: string;
  isEditing: boolean;
}

export const CourseBreadcrumb: React.FC<CourseBreadcrumbProps> = ({
  userRole,
  isEditing,
}) => {
  const courseManagePath = userRole === "admin" ? "/admin/courses" : "/lecturer/courses";
  
  return (
    <div className="flex items-center gap-1 text-xs lg:text-base text-gray-500 mb-4 lg:mb-6">
      <Link href="/" className="hover:text-blue-600">
        Home
      </Link>
      <span className="mx-2">/</span>
      <Link href={courseManagePath} className="hover:text-blue-600">
        Manage Course
      </Link>
      <span className="mx-2">/</span>
      <span className="text-black">
        {isEditing ? "Edit Course" : "Create Course"}
      </span>
    </div>
  );
};
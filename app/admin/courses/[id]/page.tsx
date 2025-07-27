"use client";

import { useParams } from "next/navigation";
import CourseDetailsPage from "@/features/courses/components/CourseDetailsPage";

export default function Page() {
  const params = useParams();
  const courseId = params.id as string;

  return (
    <CourseDetailsPage role="admin" courseId={courseId} />
  );
}

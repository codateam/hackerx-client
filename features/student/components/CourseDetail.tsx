"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/Button/page";
import { EnrollmentModal } from "@/features/enrollment/components/EnrollmentModal";
import { getCourseById } from "@/features/courses/api";
import { getAllEnrollments } from "@/features/enrollment/api";
import { Course } from "@/types/course";
import { toast } from "react-toastify";
import { Bot, Edit2 } from "lucide-react";

export default function StudentCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourseDetails();
      checkEnrollmentStatus();
    }
  }, [courseId]);
  console.log("Course ID:", courseId);

  const loadCourseDetails = async () => {
    try {
      const result = await getCourseById(courseId);

      if (result.success && result.data) {
        setCourse(result.data);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const result = await getAllEnrollments({ status: "active" });

      if (result.success && result.data) {
        const enrolled = result.data.enrollments.some(
          (enrollment) => enrollment.course?._id === courseId
        );
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
    }
  };

  const handleEnroll = () => {
    if (course) {
      setShowEnrollModal(true);
    }
  };

  const handleEnrollmentSuccess = () => {
    setIsEnrolled(true);
    setShowEnrollModal(false);
    toast.success("Successfully enrolled in the course!", {
      className: "font-poppins font-normal",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleAIChatNavigation = () => {
    router.push(`/ai/course/${courseId}`);
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Course not found</p>
          <Button
            onClick={() => router.push("/student/courses/discover")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {course.code}
              </h1>
              <h2 className="text-xl text-gray-600 mb-4">{course.title}</h2>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {course.creditUnit} Unit{course.creditUnit !== 1 ? "s" : ""}
              </div>
              {isEnrolled && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Enrolled
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Course Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{course.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium">{course.semester}</span>
                </div>
              </div>
            </div>
          </div>

          {course.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <Button
              onClick={() => router.push("/student/courses/discover")}
              variant="outline"
            >
              Back to Courses
            </Button>
            {!isEnrolled && (
              <Button
                onClick={handleEnroll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enroll in Course
              </Button>
            )}
            {isEnrolled && (
              <Button
                onClick={() => router.push("/student/courses/enrolled")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                View My Courses
              </Button>
            )}
            <Button className="text-sm " onClick={handleAIChatNavigation}>
              <Bot className="w-4 h-4 mr-2" />
              AI Study Assistant
            </Button>
          </div>
        </div>
      </div>

      {course && (
        <EnrollmentModal
          course={course}
          isOpen={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
    </div>
  );
}

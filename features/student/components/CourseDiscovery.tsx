"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CoursesList } from "@/features/courses/components/CourseList";
import { EnrollmentModal } from "@/features/enrollment/components/EnrollmentModal";
import { fetchAllCourses } from "@/features/courses/api";
import { getActiveEnrollments } from "@/features/enrollment/api";
import { Course } from "@/types/course";
import { toast } from "react-toastify";

export default function StudentCoursesDiscoverPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

    useEffect(() => {
        loadCourses();
        loadEnrolledCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchAllCourses();

            if (result.success && result.data) {
                setCourses(result.data.courses);
            } else {
                setError(result.message);
            }
        } catch {
            setError("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const loadEnrolledCourses = async () => {
        try {
            const result = await getActiveEnrollments();
            if (result.success && result.data) {
                // Extract course IDs from enrollments
                const courseIds = result.data.enrollments
                    .map(enrollment => {
                        // Handle the case where course might be null
                        if (!enrollment.course) return null;
                        
                        // Extract course ID from EnrollmentCourse object (likely uses _id)
                        return enrollment.course._id;
                    })
                    .filter(Boolean) as string[];
                
                setEnrolledCourses(courseIds);
            }
        } catch (error) {
            console.error("Failed to load enrolled courses:", error);
            // Optionally show a toast or handle error silently
        }
    };

    const handleViewCourse = (courseId: string) => {
        router.push(`/student/courses/${courseId}`);
    };

    const handleEnrollCourse = (courseId: string) => {
        const course = courses.find(c => (c.id || c._id) === courseId);
        if (course) {
            setSelectedCourse(course);
            setShowEnrollModal(true);
        }
    };

    const handleEnrollmentSuccess = () => {
        toast.success("Successfully enrolled! Check your enrolled courses.");
        setShowEnrollModal(false);
        setSelectedCourse(null);
        // Reload enrolled courses to update the UI
        loadEnrolledCourses();
    };

    const handleExams = (courseId: string) => {
        router.push(`/student/courses/${courseId}/exam`);
    };

    const handleClearError = () => {
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Discover Courses</h1>
                <p className="text-gray-600">Browse and enroll in available courses</p>
            </div>

            <CoursesList
                courses={courses}
                loading={loading}
                error={error}
                onView={handleViewCourse}
                onEnroll={handleEnrollCourse}
                onExams={handleExams}
                onClearError={handleClearError}
                showEnrollButton={true}
                showEditButton={false}
                showDeleteButton={false}
                userRole="student"
                enrolledCourses={enrolledCourses}
            />

            {selectedCourse && (
                <EnrollmentModal
                    course={selectedCourse}
                    isOpen={showEnrollModal}
                    onClose={() => {
                        setShowEnrollModal(false);
                        setSelectedCourse(null);
                    }}
                    onSuccess={handleEnrollmentSuccess}
                />
            )}
        </div>
    );
}
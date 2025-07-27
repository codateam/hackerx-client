"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button/page";
import { toast } from "react-toastify";
import { getAllEnrollments} from "@/features/enrollment/api";
import { Enrollment } from "@/types/enrollment";

export default function StudentEnrolledCoursesPage() {
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEnrolledCourses();
    }, []);

    const loadEnrolledCourses = async () => {
        try {
            setLoading(true);
            const result = await getAllEnrollments({ status: "active" });

            if (result.success && result.data) {
                // Filter out enrollments where the course has been deleted
                const validEnrollments = result.data.enrollments.filter(
                    (enrollment: Enrollment) => enrollment.course && enrollment.course._id
                );
                setEnrollments(validEnrollments);
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to load enrolled courses");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "text-green-600 bg-green-100";
            case "completed": return "text-blue-600 bg-blue-100";
            case "dropped": return "text-red-600 bg-red-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">My Enrolled Courses</h1>
                    <p className="text-gray-600 mt-1">Manage your course enrollments</p>
                </div>
                <Button
                    onClick={() => router.push("/student/courses/discover")}
                >
                    Discover More Courses
                </Button>
            </div>

            {enrollments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-4">You haven&apos;t enrolled in any courses yet.</p>
                    <Button
                        onClick={() => router.push("/student/courses/discover")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
                    >
                        Browse Available Courses
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {enrollment.course?.code}
                                    </h3>
                                    <p className="text-gray-600 mt-1">{enrollment.course?.title}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                                    {enrollment.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Level:</span>
                                    <span className="font-medium">{enrollment.level}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Semester:</span>
                                    <span className="font-medium">{enrollment.semester}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Session:</span>
                                    <span className="font-medium">{enrollment.session}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Enrolled:</span>
                                    <span className="font-medium">{formatDate(enrollment.enrolledAt)}</span>
                                </div>
                                {enrollment.score && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Score:</span>
                                        <span className="font-medium">{enrollment.score}%</span>
                                    </div>
                                )}
                                {enrollment.grade && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Grade:</span>
                                        <span className="font-medium">{enrollment.grade}</span>
                                    </div>
                                )}
                            </div>

                                <Button
                                    onClick={() => {
                                        if (enrollment.course && enrollment.course._id) {
                                            router.push(`/student/courses/${enrollment.course._id}/exam`);
                                        } else {
                                            toast.error("Course information is unavailable.");
                                        }
                                    }}
                                    className="  py-2 px-4 rounded-md w-full"
                                >
                                   Start Exam
                                </Button>                          
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
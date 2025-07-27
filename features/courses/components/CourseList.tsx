import { Course } from "@/types/course";
import { CourseCard } from "./CourseCard/CourseCard";

interface CoursesListProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
  onView: (courseId: string) => void;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
  onExams?: (courseId: string) => void;
  onClearError: () => void;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  showEnrollButton?: boolean;
  userRole?: 'admin' | 'lecturer' | 'student';
  enrolledCourses?: string[]; 
}

export const CoursesList = ({
  courses,
  loading,
  error,
  onView,
  onEdit,
  onExams,
  onDelete,
  onEnroll,
  onClearError,
  showDeleteButton = false,
  showEditButton = true,
  showEnrollButton = false,
  userRole,
  enrolledCourses = []
}: CoursesListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getListTitle = () => {
    switch (userRole) {
      case 'student':
        return 'Available Courses';
      default:
        return 'All Courses';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{getListTitle()}</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
          <button className="ml-2 underline" onClick={onClearError}>
            Dismiss
          </button>
        </div>
      )}

      {!Array.isArray(courses) || courses.length === 0 ? (
        <p className="text-gray-500">
          {!Array.isArray(courses) ? "Error loading courses." : "No courses found."}
        </p>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {courses.map((course) => {
            const courseId = course.id || course._id || "";
            const isEnrolled = enrolledCourses.includes(courseId);
            
            return (
              <CourseCard
                key={courseId}
                course={course}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onEnroll={onEnroll}
                onExams={onExams}
                showDeleteButton={showDeleteButton}
                showEditButton={showEditButton}
                showEnrollButton={showEnrollButton}
                userRole={userRole}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
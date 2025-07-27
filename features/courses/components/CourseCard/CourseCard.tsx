import { Button } from "@/components/Button/page";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onView: (courseId: string) => void;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
  onExams?: (courseId: string) => void;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  showEnrollButton?: boolean;
  userRole?: 'admin' | 'lecturer' | 'student';
  isEnrolled?: boolean;
}

export const CourseCard = ({
  course,
  onView,
  onEdit,
  onDelete,
  onEnroll,
  onExams,
  showDeleteButton = false,
  showEditButton = true,
  showEnrollButton = false,
  isEnrolled = false,
}: CourseCardProps) => {
  const courseId = course.id || course._id || "";

  return (
    <div className="border p-4 rounded-lg hover:bg-gray-100 hover:border-[#0000ff] flex flex-col gap-4 md:gap-6">
      <div className="flex justify-between">
        <h3 className="font-medium text-base md:text-lg">{course.code}</h3>
        <div className="text-sm font-medium">
          {course.creditUnit} Unit
          {course.creditUnit !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <span className="hidden md:block place-self-end">{course.title}</span>
        <span className="md:hidden block text-center">{course.title}</span>

        <div className="mt-3 flex flex-col md:flex-row gap-4">
          <Button
            onClick={() => onView(courseId)}
          >
            View Details
          </Button>

          {onExams && <Button
            onClick={() => onExams(courseId)}
          >
            View Exams
          </Button>}

          {showEditButton && onEdit && (
            <Button
              onClick={() => onEdit(courseId)}
            >
              Edit
            </Button>
          )}

          {showEnrollButton && (
            isEnrolled ? (
              <Button
                disabled
                className="bg-green-500 hover:bg-green-500 text-white cursor-not-allowed"
              >
                Enrolled
              </Button>
            ) : (
              onEnroll && (
                <Button
                  onClick={() => onEnroll(courseId)}
                  variant="destructive"
                >
                  Enroll
                </Button>
              )
            )
          )}

          {showDeleteButton && onDelete && (
            <Button
              onClick={() => onDelete(courseId)}
              variant="destructive"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
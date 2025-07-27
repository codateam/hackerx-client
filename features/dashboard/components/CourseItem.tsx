import { Button } from "@/components/Button/page";

interface CourseItemProps {
  courseCode: string;
  courseTitle: string;
}

export function CourseItem({ courseCode, courseTitle }: CourseItemProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{courseCode}</p>
        <p className="text-sm text-gray-500">{courseTitle}</p>
      </div>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        View Result
      </Button>
    </div>
  );
}

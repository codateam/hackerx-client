import { useQuery } from "@tanstack/react-query";
import { getExamsByCourse } from "../api";

export const useExams = (courseId: string) => {
  return useQuery({
    queryKey: ["exams", courseId],
    queryFn: () => getExamsByCourse(courseId),
    enabled: !!courseId, // Only run the query if courseId is available
  });
};

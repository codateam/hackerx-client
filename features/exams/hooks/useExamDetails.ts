import { useQuery } from "@tanstack/react-query";
import { getExamById } from "../api";

export const useExamDetails = (examId: string) => {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExamById(examId),
    enabled: !!examId, // Only run the query if examId is available
  });
};

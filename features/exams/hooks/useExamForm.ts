import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddExamValidationSchema,
  AddExamFormInput,
  AddExamFormOutput,
} from "@/features/exams/lib/validation";
import { createExam, updateExam } from "../api";
import { toast } from "react-toastify";
import { Exam } from "@/types/exam";
import { ResponseType } from "@/types/common";

export const useExamForm = (courseId: string, exam?: Exam) => {
  const queryClient = useQueryClient();

  const form = useForm<AddExamFormInput>({
    resolver: zodResolver(AddExamValidationSchema),
    defaultValues: exam
      ? {
          ...exam,
          startTime: exam.startTime
            ? new Date(exam.startTime).toISOString().slice(0, 16)
            : "",
        }
      : {
          title: "",
          session: "",
          semester: "First",
          examType: "regular",
          duration: 120,
          startTime: "",
          totalMarks: 100,
        },
  });

  const createExamMutation = useMutation<
    ResponseType<Exam>,
    Error,
    AddExamFormOutput & { endTime: string }
  >({
    mutationFn: (data) => createExam(courseId, data),
    onSuccess: () => {
      toast.success("Exam created successfully");
      queryClient.invalidateQueries({ queryKey: ["exams", courseId] });
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateExamMutation = useMutation<
    ResponseType<Exam>,
    Error,
    Partial<AddExamFormOutput & { endTime: string }>
  >({
    mutationFn: (data) => updateExam(exam?._id || "", data),
    onSuccess: () => {
      toast.success("Exam updated successfully");
      queryClient.invalidateQueries({ queryKey: ["exams", courseId] });
      queryClient.invalidateQueries({ queryKey: ["exam", exam?._id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: AddExamFormOutput) => {
    const { startTime, duration } = data;
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + (duration + 5) * 60000);
    const endTime = endDate.toISOString();

    const payload = { ...data, endTime };

    if (exam) {
      updateExamMutation.mutate(payload);
    } else {
      createExamMutation.mutate(payload);
    }
  };

  return {
    form,
    onSubmit,
    isLoading: createExamMutation.isPending || updateExamMutation.isPending,
  };
};

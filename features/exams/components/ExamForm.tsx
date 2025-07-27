"use client";

import { useExamForm } from "@/features/exams/hooks/useExamForm";
import { Exam } from "@/types/exam";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/Button/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/Label";
import { Loader } from "lucide-react";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ExamFormProps {
  courseId: string;
  exam?: Exam;
}

export const ExamForm: React.FC<ExamFormProps> = ({ courseId, exam }) => {
  const { form, onSubmit, isLoading } = useExamForm(courseId, exam);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      
      if (exam) {
        toast.success("Exam updated successfully!");
      } else {
        toast.success("Exam created successfully!");
      }
      
      router.back();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="session">Session</Label>
        <Input id="session" placeholder="e.g. 2023/2024" {...form.register("session")} />
        {form.formState.errors.session && <p className="text-red-500 text-sm">{form.formState.errors.session.message}</p>}
      </div>

      <div>
        <Label>Semester</Label>
        <Controller
          control={form.control}
          name="semester"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First">First</SelectItem>
                <SelectItem value="Second">Second</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.semester && <p className="text-red-500 text-sm">{form.formState.errors.semester.message}</p>}
      </div>

      <div>
        <Label>Exam Type</Label>
        <Controller
          control={form.control}
          name="examType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="resit">Resit</SelectItem>
                <SelectItem value="makeup">Makeup</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.examType && <p className="text-red-500 text-sm">{form.formState.errors.examType.message}</p>}
      </div>

      <div>
        <Label htmlFor="duration">Duration (in minutes)</Label>
        <Input id="duration" type="number" {...form.register("duration")} />
        {form.formState.errors.duration && <p className="text-red-500 text-sm">{form.formState.errors.duration.message}</p>}
      </div>

      <div>
        <Label htmlFor="totalMarks">Total Marks</Label>
        <Input id="totalMarks" type="number" {...form.register("totalMarks")} />
        {form.formState.errors.totalMarks && <p className="text-red-500 text-sm">{form.formState.errors.totalMarks.message}</p>}
      </div>

      <div>
        <Label htmlFor="startTime">Start Time</Label>
        <Input id="startTime" type="datetime-local" {...form.register("startTime")} />
        {form.formState.errors.startTime && <p className="text-red-500 text-sm">{form.formState.errors.startTime.message}</p>}
      </div>

      <div className="flex justify-between items-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin" /> : (exam ? "Update Exam" : "Create Exam")}
        </Button>

        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

    </form>
  );
};
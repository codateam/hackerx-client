import { z } from "zod";

export const AddCourseValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  code: z.string().min(1, "Course code is required"),
  description: z.string(),
  creditUnit: z.number().min(1, "Credit unit must be at least 1"),
  level: z.number(),
  semester: z.enum(["First", "Second"]),
  department: z.string().min(1, "Department is required"),
  courseMaterials: z.array(z.string().url("Invalid URL format")).optional(),
});

export const AssignLecturerSchema = z.object({
  lecturerId: z.string().min(1, "Lecturer ID is required"),
});

import { z } from "zod";

export const EnrollmentCreateSchema = z.object({
  course: z.string().min(1, "Course is required"),
  level: z.string().min(1, "Level is required"),
  semester: z.enum(["First", "Second"], {
    errorMap: () => ({ message: "Semester must be either 'First' or 'Second'" }),
  }),
  session: z.string().min(1, "Session is required"),
});

export const EnrollmentUpdateSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  grade: z.string().optional(),
  status: z.enum(["active", "completed", "dropped"]).optional(),
});

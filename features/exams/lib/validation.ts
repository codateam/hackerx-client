import { z } from "zod";

export const AddExamValidationSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  session: z.string().min(9, { message: "Session must be in format YYYY/YYYY" }),
  semester: z.enum(["First", "Second"]),
  examType: z.enum(["regular", "resit", "makeup"]),
  duration: z.coerce.number().positive({ message: "Duration must be a positive number" }),
  startTime: z.preprocess((arg) => {
    // The datetime-local input can return an empty string, which is not a valid date.
    if (typeof arg === "string" && arg) {
      const date = new Date(arg);
      // Ensure the date is valid before converting.
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return arg; // Return original arg to let Zod handle the invalid type.
  }, z.string().datetime({ message: "Invalid date and time format" })),
  totalMarks: z.coerce.number().positive({ message: "Total marks must be a positive number" }),
});

export type AddExamFormInput = z.input<typeof AddExamValidationSchema>;
export type AddExamFormOutput = z.output<typeof AddExamValidationSchema>;

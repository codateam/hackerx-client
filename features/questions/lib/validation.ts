import { z } from "zod";

// Base schema for all question types
const QuestionBaseSchema = z.object({
  text: z.string().min(1, "Question text cannot be empty"),
  mark: z.coerce.number().min(1, "Mark must be at least 1"),
});

// Schema for MCQ questions
const McqQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal("mcq"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "MCQ must have at least 2 options"),
  correctAnswer: z.string().min(1, "Correct answer cannot be empty"),
});

// Schema for Theory questions
const TheoryQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal("theory"),
  options: z.array(z.string()).optional(), // Not used, but kept for consistency
  correctAnswer: z.string().optional(), // Not used
});

// Schema for German (Short Answer) questions
const GermanQuestionSchema = QuestionBaseSchema.extend({
  type: z.literal("german"),
  options: z.array(z.string()).optional(), // Not used
  correctAnswer: z.string().optional(), // Not used
});

// Discriminated union for different question types
export const QuestionSchema = z.discriminatedUnion("type", [
  McqQuestionSchema,
  TheoryQuestionSchema,
  GermanQuestionSchema,
]);

// Schema for the entire form for creating multiple questions
export const BulkQuestionsFormSchema = z.object({
  exam: z.string(), // This will be hidden, but needed for submission
  questions: z.array(QuestionSchema).min(1, "You must add at least one question"),
});

export type QuestionFormInput = z.infer<typeof QuestionSchema>;
export type BulkQuestionsFormInput = z.infer<typeof BulkQuestionsFormSchema>;

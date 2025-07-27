import { Course } from "./course";

export interface Exam {
  _id: string;
  title: string;
  course: Course | string;
  lecturer: string; 
  session: string;
  semester: "First" | "Second";
  examType: "regular" | "resit" | "makeup";
  duration: number;
  startTime: string;
  endTime: string;
  totalMarks: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseType<T> {
  success: boolean;
  data: T | null;
  message: string;
}

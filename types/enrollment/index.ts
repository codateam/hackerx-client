
export interface Student {
  id: string;
  email: string;
}

export interface EnrollmentCourse {
  _id: string;
  code: string;
  title: string;
}

export interface Enrollment {
  _id: string;
  student: Student;
  course: EnrollmentCourse | null;
  level: number;
  semester: "First" | "Second";
  session: string;
  status: "active" | "completed" | "dropped";
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  grade?: string;
  score?: number;
  __v: number;
}

export interface ResponseType<T> {
  success: boolean;
  data: T | null;
  message: string;
}
export interface Lecturer {
  id: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Course {
  id?: string;
  _id?: string;
  title: string;
  code: string;
  description: string;
  creditUnit: number;
  level: number;
  semester: string;
  department: string;
  lecturers?: Array<{
    id: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }>;
  lecturer?: {
    id: string;
  };
  courseMaterials?: string[];
}
export interface CourseBasicFieldsProps {
  courseData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
  handleNumberChange: (name: string, value: number) => void;
}

export interface CourseCardProps {
  course: Course;
  onView: (courseId: string) => void;
  onEdit: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  showDeleteButton?: boolean;
}

export interface CourseFormProps {
  isAdmin?: boolean;
  initialData?: Course | null;
  courseCodeOptions?: string[];
  lecturerOptions?: Lecturer[];
  onSuccess?: (data: Course) => void;
}

export type ResponseType<T> = {
  success: boolean;
  data: T | null;
  message: string;
};

export interface CourseFormData {
  title: string;
  code: string;
  description: string;
  creditUnit: number;
  level: number;
  semester: string;
  department: string;
  lecturerId: string;
  courseMaterials?: string[];
}

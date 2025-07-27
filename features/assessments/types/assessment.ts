export interface Assessment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  duration: number;
  status: 'pending' | 'in_progress' | 'completed';
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  answers: Record<string, string | string[]>;
  score: number;
  submittedAt: string;
  status: 'in_progress' | 'completed';
}

export interface AssessmentResult {
  attempt: AssessmentAttempt;
  assessment: Assessment;
  score: number;
  maxScore: number;
  feedback: string;
}

import { useState, useEffect } from 'react';
import { Assessment } from '../types/assessment';

interface UseAssessmentStateProps {
  courseId: string;
}

interface AssessmentState {
  assessments: Assessment[];
  loading: boolean;
  error: string | null;
}

export const useAssessmentState = ({ courseId }: UseAssessmentStateProps): AssessmentState => {
  const [state, setState] = useState<AssessmentState>({
    assessments: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/assessments`);
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        const data = await response.json();
        setState({
          assessments: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          assessments: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchAssessments();
  }, [courseId]);

  return state;
};

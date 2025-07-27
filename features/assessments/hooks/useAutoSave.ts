import { useState, useEffect } from 'react';

interface UseAutoSaveProps {
  assessmentId: string;
  answers: Record<string, string | string[]>;
}

export const useAutoSave = ({ assessmentId, answers }: UseAutoSaveProps) => {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const saveAnswers = async () => {
      try {
        await fetch(`/api/assessments/${assessmentId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        });
        setLastSavedAt(new Date());
      } catch (error) {
        console.error('Failed to save answers:', error);
      }
    };

    const timer = setTimeout(() => {
      saveAnswers();
    }, 30000);

    return () => clearTimeout(timer);
  }, [assessmentId, JSON.stringify(answers)]);

  return {
    lastSavedAt,
    isDirty: lastSavedAt ? new Date().getTime() - lastSavedAt.getTime() > 30000 : true,
  };
};

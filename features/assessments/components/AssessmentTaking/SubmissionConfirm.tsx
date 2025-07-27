import { useAutoSave } from '../../hooks/useAutoSave';

interface SubmissionConfirmProps {
  assessmentId: string;
  answers: Record<string, string | string[]>;
}

export const SubmissionConfirm: React.FC<SubmissionConfirmProps> = ({ assessmentId, answers }) => {
  const { lastSavedAt, isDirty } = useAutoSave({ assessmentId, answers });

  const handleSubmit = async () => {
    try {
      await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      // Redirect to results page
      window.location.href = `/student/courses/[id]/assessments/${assessmentId}/results`;
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Last saved: {lastSavedAt ? lastSavedAt.toLocaleTimeString() : 'Never'}
        </p>
        {isDirty && (
          <p className="text-sm text-yellow-600">
            Warning: Your answers have not been saved yet
          </p>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit Assessment
      </button>
    </div>
  );
};

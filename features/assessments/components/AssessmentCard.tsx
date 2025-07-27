interface AssessmentCardProps {
  assessment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  };
  onTakeExam?: (assessmentId: string) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onTakeExam }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
      <p className="text-gray-600 mb-2">{assessment.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Due: {new Date(assessment.dueDate).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            assessment.status === 'pending'
              ? 'bg-blue-100 text-blue-800'
              : assessment.status === 'in_progress'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {assessment.status}
        </span>
      </div>
      {assessment.status === 'pending' && onTakeExam && (
        <button
          onClick={() => onTakeExam(assessment.id)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Take Exam
        </button>
      )}
    </div>
  );
};

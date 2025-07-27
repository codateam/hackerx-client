import { AssessmentCard } from './AssessmentCard';
import { useAssessmentState } from '../hooks/useAssessmentState';

interface AssessmentListProps {
  courseId: string;
}

export const AssessmentList: React.FC<AssessmentListProps> = ({ courseId }) => {
  const { assessments, loading, error } = useAssessmentState({ courseId });

  if (loading) return <div>Loading assessments...</div>;
  if (error) return <div>Error loading assessments</div>;

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} />
      ))}
    </div>
  );
};

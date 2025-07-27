import { useState } from 'react';
import { QuestionDisplay } from './QuestionDisplay';
import { Timer } from './Timer';
import { AnswerInput } from './AnswerInput';
import { SubmissionConfirm } from './SubmissionConfirm';
import { useAssessmentState } from '../../hooks/useAssessmentState';
import { useAssessmentTimer } from '../../hooks/useAssessmentTimer';
import { Assessment, Question } from '../../types/assessment';

interface AssessmentPlayerProps {
  assessmentId: string;
}

export const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({ assessmentId }) => {
  const { assessments, loading, error } = useAssessmentState({ courseId: assessmentId });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  if (loading) return <div>Loading assessment...</div>;
  if (error) return <div>Error: {error}</div>;
  if (assessments.length === 0) return <div>No assessments found</div>;

  const assessment = assessments[0]; // Assuming we want to show the first assessment
  const { duration, questions } = assessment;
  const { timeRemaining, isActive, startTimer, pauseTimer, resumeTimer } = useAssessmentTimer({ duration });

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{assessment.title}</h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <Timer
          timeRemaining={timeRemaining}
          isActive={isActive}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
        />
      </div>

      <QuestionDisplay question={currentQuestion} />

      <AnswerInput
        question={currentQuestion}
        value={answers[currentQuestion.id] || ''}
        onChange={handleAnswerChange}
      />

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {!isLastQuestion ? (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next Question
            </button>
          ) : (
            <SubmissionConfirm
              assessmentId={assessmentId}
              answers={answers}
            />
          )}
        </div>
      </div>
    </div>
  );
};
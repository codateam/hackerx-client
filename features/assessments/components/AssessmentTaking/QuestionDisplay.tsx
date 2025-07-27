import { Question } from "../../types/assessment";

interface QuestionDisplayProps {
  question: Question;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Question {question.id}</h3>
      <p className="text-gray-700 mb-4">{question.text}</p>

      {question.type === 'multiple_choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                name={`q${question.id}`}
                value={option}
                className="mr-2"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

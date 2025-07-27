import { Question } from "../../types/assessment";

interface AnswerInputProps {
  question: Question;
  value: string | string[];
  onChange: (answer: string | string[]) => void;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({ question, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleMultipleChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mt-4">
      {question.type === 'multiple_choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                name={`q${question.id}`}
                value={option}
                onChange={handleMultipleChoice}
                className="mr-2"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}

      {question.type === 'short_answer' && (
        <input
          type="text"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          placeholder="Enter your answer..."
        />
      )}

      {question.type === 'essay' && (
        <textarea
          className="w-full p-2 border rounded h-32"
          onChange={handleChange}
          placeholder="Enter your essay..."
        />
      )}
    </div>
  );
};

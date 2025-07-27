"use client";

import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { IQuestion } from "@/types/question";
import { RootState } from "@/store/store";
import { setAnswer } from "@/store/assessmentSlice";

interface QuestionRendererProps {
  question: IQuestion;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question }) => {
  const dispatch = useDispatch();
  const { answers } = useSelector((state: RootState) => state.assessment);
  const currentAnswer = answers[question._id];

  const handleMcqChange = (option: string) => {
    dispatch(setAnswer({ question: question._id, selectedAnswer: option, type: 'mcq', questionText: question.text }));
  };

  const handleWrittenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setAnswer({ question: question._id, writtenAnswer: e.target.value, type: question.type, questionText: question.text }));
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{question.text}</h3>
      </div>
      <div className="px-6 mb-6 pt-0">
        {question.type === 'mcq' && (
          <div className="space-y-2">
            {question.options?.map((option, index) => {
              const letter = String.fromCharCode(65 + index)
              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="font-medium min-w-[24px]">{letter}.</span>
                  <input
                    type="radio"
                    id={`${question._id}-option-${index}`}
                    name={question._id}
                    value={option}
                    checked={currentAnswer?.selectedAnswer === option}
                    onChange={() => handleMcqChange(option)}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <Label htmlFor={`${question._id}-option-${index}`} className="text-black">{option}</Label>
                </div>
              )
            })}
          </div>
        )}

        {(question.type === 'theory' || question.type === 'german') && (
          <div>
            <Label htmlFor={`answer-${question._id}`}>Your Answer</Label>
            <Textarea
              id={`answer-${question._id}`}
              value={currentAnswer?.writtenAnswer || ''}
              onChange={handleWrittenChange}
              rows={question.type === 'theory' ? 10 : 3}
              placeholder={question.type === 'theory' ? "Write your detailed answer here..." : "Write your short answer here..."}
            />
          </div>
        )}
      </div>
    </div>
  );
};

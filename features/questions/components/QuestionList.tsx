import React from 'react';
import { IQuestion } from "@/types/question";
import { Button } from "@/components/Button/page";
import { Loader, Trash2 } from "lucide-react";

interface QuestionListProps {
  questions: IQuestion[];
  onDelete: (questionId: string) => void;
  isDeleting: boolean;
  isLoading: boolean;
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions, onDelete, isDeleting, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin" />
        <p className="ml-2">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="text-center text-gray-500 py-8">No questions have been added to this exam yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Existing Questions</h3>
      {questions.map((q, index) => (
        <div key={q._id} className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="flex flex-col gap-2 font-bold"> 
                <span>{index + 1}. {q.text}</span> 
                <span className="font-normal text-sm text-[#666666]">({q.type}, {q.mark} marks)</span>
              </p>
              {q.type === 'mcq' && q.options && (
                <ul className="list-disc list-inside pl-4 mt-2">
                  {q.options.map((opt, i) => (
                    <li key={i} className={opt === q.correctAnswer ? 'font-semibold text-green-700' : ''}>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(q._id)} 
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

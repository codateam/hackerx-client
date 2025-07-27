import React from "react";
import { Button } from "@/components/Button/page";

interface ErrorStateProps {
  message: string;
  onGoBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onGoBack }) => {
  return (
    <div className="p-4">
      <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
        {message}
      </div>
      <Button variant="outline" className="mt-4" onClick={onGoBack}>
        Go Back
      </Button>
    </div>
  );
};
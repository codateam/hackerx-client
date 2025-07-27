import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Answer {
  question: string; // questionId
  selectedAnswer?: string;
  writtenAnswer?: string;
  studentId?: string; // Optional, if needed for tracking
  type?: 'mcq' | 'german' | 'theory'; // Type
  examId?: string; // Optional, if needed for tracking
  questionText: string; // Optional, if needed for tracking
  score?: number;
  graded?: boolean;
}

export interface AssessmentState {
  answers: Record<string, Answer>;
  remainingTime: number | null;
}

const initialState: AssessmentState = {
  answers: {},
  remainingTime: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setAnswer(state, action: PayloadAction<Answer>) {
      state.answers[action.payload.question] = action.payload;
    },
    setRemainingTime(state, action: PayloadAction<number>) {
      state.remainingTime = action.payload;
    },
    resetAssessment(state) {
      state.answers = {};
      state.remainingTime = null;
    },
    setBulkAnswers(state, action: PayloadAction<Answer[]>) {
      action.payload.forEach(ans => {
        state.answers[ans.question] = ans;
      });
    },
  },
});

export const { setAnswer, setRemainingTime, resetAssessment, setBulkAnswers } = assessmentSlice.actions;
export default assessmentSlice.reducer;

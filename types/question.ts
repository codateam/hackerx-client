export interface IQuestion {
  _id: string;
  exam: string;
  type: "mcq" | "theory" | "german";
  text: string;
  options?: string[];
  correctAnswer?: string;
  mark: number;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
export type Question = {
  id: string;
  topic: string;
  subtopic?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  choices: string[];
  correct_answer: string;
  explanation: string;
  formula_used?: string;
  keywords?: string[];
  image?: string | null;
  LOS_reference?: string;
  options: string[];
};

export type QuizAnswerResponse = {
  isCorrect: boolean;
  nextQuestion: Question;
  response: string;
  thread_id: string;
};

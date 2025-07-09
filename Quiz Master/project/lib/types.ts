export interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: number;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  questions: Question[];
}
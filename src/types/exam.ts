export interface ExamQuestion {
  id: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  rationale: string;
  piCode: string;
  instructionalArea: string;
  level: "PQ" | "CS" | "SP";
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  isCorrect: boolean | null;
}

export interface SessionState {
  mode: "home" | "quiz" | "results" | "review" | "drill";
  currentQuestionIndex: number;
  answers: UserAnswer[];
  score: number | null;
  selectedQuestions: ExamQuestion[];
  quizSize: number;
  filterIA: string | null;
  filterLevel: string | null;
}

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

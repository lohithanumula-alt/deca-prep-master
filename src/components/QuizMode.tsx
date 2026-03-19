"use client";

import { useState } from "react";
import { ExamQuestion, UserAnswer } from "@/types/exam";
import QuestionCard from "./QuestionCard";
import CoachPanel from "./CoachPanel";
import ResultsSummary from "./ResultsSummary";

interface QuizModeProps {
  questions: ExamQuestion[];
  onExit: () => void;
  onAnswerSubmit?: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
  onQuizComplete?: (correctCount: number, total: number) => void;
}

export default function QuizMode({ questions, onExit, onAnswerSubmit, onQuizComplete }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>(
    questions.map((q) => ({ questionId: q.id, selectedAnswer: null, isCorrect: null }))
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [selectedForThisQ, setSelectedForThisQ] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [phase, setPhase] = useState<"quiz" | "results" | "review">("quiz");
  const [reviewIndex, setReviewIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    setSelectedForThisQ(answer);
    const updated = [...answers];
    updated[currentIndex] = { ...updated[currentIndex], selectedAnswer: answer, isCorrect: null };
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const isCorrect = selectedForThisQ === currentQuestion.correctAnswer;
    const updated = [...answers];
    updated[currentIndex] = { ...updated[currentIndex], isCorrect };
    setAnswers(updated);
    setIsSubmitted(true);
    onAnswerSubmit?.(currentQuestion.id, selectedForThisQ!, isCorrect);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setShowCoach(false);
    setSelectedForThisQ(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalAnswers = answers;
      const correct = finalAnswers.filter((a) => a.isCorrect === true).length;
      onQuizComplete?.(correct, questions.length);
      setPhase("results");
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers(questions.map((q) => ({ questionId: q.id, selectedAnswer: null, isCorrect: null })));
    setIsSubmitted(false);
    setShowCoach(false);
    setSelectedForThisQ(null);
    setPhase("quiz");
  };

  if (phase === "results") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-gray-900 text-2xl font-bold">Quiz Results</h1>
            <button onClick={onExit} className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
              ← Back to Setup
            </button>
          </div>
          <ResultsSummary
            questions={questions}
            answers={answers}
            onReview={() => { setReviewIndex(0); setPhase("review"); }}
            onRetry={handleRetry}
            onHome={onExit}
          />
        </div>
      </div>
    );
  }

  if (phase === "review") {
    const reviewQ = questions[reviewIndex];
    const reviewA = answers[reviewIndex];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPhase("results")}
              className="text-gray-500 hover:text-gray-800 transition-colors text-sm"
            >
              ← Back to Results
            </button>
            <span className="text-gray-500 text-sm">
              Question {reviewIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <QuestionCard
                question={reviewQ}
                questionNumber={reviewIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={reviewA.selectedAnswer}
                onSelectAnswer={() => {}}
                isSubmitted={true}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
                  disabled={reviewIndex === 0}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setReviewIndex(Math.min(questions.length - 1, reviewIndex + 1))}
                  disabled={reviewIndex === questions.length - 1}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="h-[600px]">
              <CoachPanel
                question={reviewQ}
                selectedAnswer={reviewA.selectedAnswer || reviewQ.correctAnswer}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const correct = answers.filter((a) => a.isCorrect === true).length;
  const answered = answers.filter((a) => a.isCorrect !== null).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-gray-800 transition-colors text-sm flex items-center gap-1"
          >
            ← Exit Quiz
          </button>
          <div className="flex items-center gap-4">
            {answered > 0 && (
              <div className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                Score: <span className="font-bold text-gray-900">{correct}/{answered}</span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${showCoach && isSubmitted ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={currentAnswer.selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              isSubmitted={isSubmitted}
              onSubmit={handleSubmit}
              onNext={handleNext}
            />

            {isSubmitted && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowCoach(!showCoach)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${
                    showCoach
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span>🎓</span>
                  {showCoach ? "Hide Coach" : "Get AI Coaching"}
                </button>
              </div>
            )}
          </div>

          {showCoach && isSubmitted && (
            <div className="h-[600px]">
              <CoachPanel
                question={currentQuestion}
                selectedAnswer={currentAnswer.selectedAnswer || currentQuestion.correctAnswer}
                onClose={() => setShowCoach(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

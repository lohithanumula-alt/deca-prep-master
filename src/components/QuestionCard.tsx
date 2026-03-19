"use client";

import { ExamQuestion } from "@/types/exam";

interface QuestionCardProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  onSelectAnswer: (answer: "A" | "B" | "C" | "D") => void;
  showResult?: boolean;
  onSubmit?: () => void;
  onNext?: () => void;
  isSubmitted?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  onNext,
  isSubmitted = false,
}: QuestionCardProps) {
  const options: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

  const getOptionStyle = (option: "A" | "B" | "C" | "D") => {
    if (!isSubmitted) {
      if (selectedAnswer === option) {
        return "bg-blue-50 border-blue-500 text-blue-900 shadow-sm";
      }
      return "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300";
    }
    if (option === question.correctAnswer) {
      if (selectedAnswer === option) return "bg-green-50 border-green-500 text-green-900";
      return "bg-green-50/60 border-green-300 text-green-700";
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return "bg-red-50 border-red-400 text-red-900";
    }
    return "bg-gray-50 border-gray-200 text-gray-400 opacity-70";
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      PQ: "bg-green-100 text-green-700 border border-green-200",
      CS: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      SP: "bg-red-100 text-red-700 border border-red-200",
    };
    return colors[level] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-sm text-gray-500 mb-1.5">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getLevelBadge(question.level)}`}>
            {question.level}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {question.instructionalArea}
          </span>
          <span className="text-xs text-gray-400 ml-auto font-mono">{question.piCode}</span>
        </div>

        {/* Question text */}
        <p className="text-gray-900 text-lg font-medium leading-relaxed mb-6">
          {question.questionText}
        </p>

        {/* Answer options */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => !isSubmitted && onSelectAnswer(option)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${getOptionStyle(option)} ${!isSubmitted ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="font-bold text-sm min-w-[1.5rem] mt-0.5">{option}.</span>
              <span className="text-sm leading-relaxed">{question.options[option]}</span>
              {isSubmitted && option === question.correctAnswer && (
                <span className="ml-auto text-green-600 text-lg">✓</span>
              )}
              {isSubmitted && option === selectedAnswer && option !== question.correctAnswer && (
                <span className="ml-auto text-red-500 text-lg">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Result banner */}
        {isSubmitted && (
          <div className={`mt-4 p-3 rounded-xl text-center font-semibold text-sm ${
            selectedAnswer === question.correctAnswer
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {selectedAnswer === question.correctAnswer
              ? "✅ Correct! Great job."
              : `❌ Incorrect — the correct answer is ${question.correctAnswer}.`}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end">
        {!isSubmitted && (
          <button
            onClick={onSubmit}
            disabled={!selectedAnswer}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors shadow-sm"
          >
            Submit Answer
          </button>
        )}
        {isSubmitted && onNext && (
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-sm"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
}

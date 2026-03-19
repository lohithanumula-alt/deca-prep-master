"use client";

import { ExamQuestion, UserAnswer } from "@/types/exam";

interface ResultsSummaryProps {
  questions: ExamQuestion[];
  answers: UserAnswer[];
  onReview: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultsSummary({ questions, answers, onReview, onRetry, onHome }: ResultsSummaryProps) {
  const score = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const percentage = Math.round((score / total) * 100);

  const iaBreakdown = questions.reduce((acc, q, idx) => {
    const ia = q.instructionalArea;
    if (!acc[ia]) acc[ia] = { correct: 0, total: 0 };
    acc[ia].total++;
    if (answers[idx]?.isCorrect) acc[ia].correct++;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (pct: number) => {
    if (pct >= 90) return "Outstanding! You're DECA-ready! 🏆";
    if (pct >= 80) return "Great job! Solid performance! 🎉";
    if (pct >= 70) return "Good work! A bit more practice and you'll ace it! 📚";
    if (pct >= 60) return "Keep studying! Focus on your weak areas. 💪";
    return "Keep going! Review the explanations and try again. 🔄";
  };

  const getBarColor = (pct: number) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Score card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className={`text-7xl font-extrabold mb-2 ${getScoreColor(percentage)}`}>
          {percentage}%
        </div>
        <div className="text-gray-600 text-xl mb-1">{score} / {total} Correct</div>
        <div className="text-gray-500 text-base mt-3">{getScoreMessage(percentage)}</div>
        <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-gray-500 text-sm mt-1">Correct</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{total - score}</div>
          <div className="text-gray-500 text-sm mt-1">Incorrect</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-gray-500 text-sm mt-1">Total</div>
        </div>
      </div>

      {/* Instructional Area Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-gray-900 font-bold text-lg mb-4">Performance by Instructional Area</h3>
        <div className="space-y-3">
          {Object.entries(iaBreakdown)
            .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total)
            .map(([ia, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={ia}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 text-sm">{ia}</span>
                    <span className={`text-sm font-semibold ${getScoreColor(pct)}`}>
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReview}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-sm"
        >
          Review Answers
        </button>
        <button
          onClick={onRetry}
          className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          Try Again
        </button>
        <button
          onClick={onHome}
          className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          Back to Setup
        </button>
      </div>
    </div>
  );
}

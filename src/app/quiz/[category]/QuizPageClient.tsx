"use client";

import { useState, useRef } from "react";
import { examQuestions, instructionalAreas } from "@/data/examQuestions";
import { ExamQuestion } from "@/types/exam";
import QuizMode from "@/components/QuizMode";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  createQuizSession,
  saveQuestionAttempt,
  completeQuizSession,
} from "@/lib/supabase/db";

interface QuizConfig {
  size: number;
  filterIA: string | null;
  filterLevel: string | null;
  shuffle: boolean;
}

export default function QuizPageClient() {
  const [mode, setMode] = useState<"config" | "quiz">("config");
  const [quizQuestions, setQuizQuestions] = useState<ExamQuestion[]>([]);
  const [config, setConfig] = useState<QuizConfig>({
    size: 25,
    filterIA: null,
    filterLevel: null,
    shuffle: true,
  });

  // Session tracking
  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  const startQuiz = async () => {
    let pool = [...examQuestions];
    if (config.filterIA) pool = pool.filter((q) => q.instructionalArea === config.filterIA);
    if (config.filterLevel) pool = pool.filter((q) => q.level === config.filterLevel);
    if (config.shuffle) pool = pool.sort(() => Math.random() - 0.5);
    const selected = pool.slice(0, Math.min(config.size, pool.length));
    setQuizQuestions(selected);

    // Create session in Supabase
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userIdRef.current = user.id;
      const sessionId = await createQuizSession({
        userId: user.id,
        totalQuestions: selected.length,
        filterIA: config.filterIA,
        filterLevel: config.filterLevel,
      });
      sessionIdRef.current = sessionId;
    }

    setMode("quiz");
  };

  const handleAnswerSubmit = async (
    questionId: number,
    selectedAnswer: string,
    isCorrect: boolean
  ) => {
    const sessionId = sessionIdRef.current;
    const userId = userIdRef.current;
    if (!sessionId || !userId) return;

    const question = quizQuestions.find((q) => q.id === questionId);
    if (!question) return;

    await saveQuestionAttempt({
      sessionId,
      userId,
      questionId,
      piCode: question.piCode,
      instructionalArea: question.instructionalArea,
      level: question.level,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    });
  };

  const handleQuizComplete = async (correctCount: number, total: number) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    await completeQuizSession(sessionId, correctCount, total);
  };

  if (mode === "quiz") {
    return (
      <QuizMode
        questions={quizQuestions}
        onExit={() => setMode("config")}
        onAnswerSubmit={handleAnswerSubmit}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  const filteredCount = examQuestions.filter((q) => {
    if (config.filterIA && q.instructionalArea !== config.filterIA) return false;
    if (config.filterLevel && q.level !== config.filterLevel) return false;
    return true;
  }).length;

  const iaCounts = instructionalAreas.map((ia) => ({
    name: ia,
    count: examQuestions.filter((q) => q.instructionalArea === ia).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-[#0a1628] text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
        >
          ← Dashboard
        </Link>
        <span className="text-gray-600">|</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-semibold text-sm">Business Admin Core</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configure Your Practice Session</h1>
          <p className="text-gray-500 mt-1">Choose how many questions and what to focus on.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              {/* Quiz size */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((size) => (
                    <button
                      key={size}
                      onClick={() => setConfig({ ...config, size })}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${
                        config.size === size
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructional Area */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Instructional Area
                  <span className="text-gray-400 font-normal ml-2">(optional)</span>
                </label>
                <select
                  value={config.filterIA || ""}
                  onChange={(e) => setConfig({ ...config, filterIA: e.target.value || null })}
                  className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Areas ({examQuestions.length} questions)</option>
                  {iaCounts.map(({ name, count }) => (
                    <option key={name} value={name}>
                      {name} ({count} questions)
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Difficulty Level
                  <span className="text-gray-400 font-normal ml-2">(optional)</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setConfig({ ...config, filterLevel: null })}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                      !config.filterLevel
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {(["PQ", "CS", "SP"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfig({ ...config, filterLevel: level })}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${
                        config.filterLevel === level
                          ? level === "PQ"
                            ? "bg-green-600 text-white shadow-md"
                            : level === "CS"
                            ? "bg-yellow-500 text-white shadow-md"
                            : "bg-red-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> PQ = Basic
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" /> CS = Intermediate
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" /> SP = Advanced
                  </span>
                </div>
              </div>

              {/* Shuffle */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-gray-700 text-sm font-semibold">Shuffle Questions</div>
                  <div className="text-gray-400 text-xs mt-0.5">Randomize question order</div>
                </div>
                <button
                  onClick={() => setConfig({ ...config, shuffle: !config.shuffle })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.shuffle ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      config.shuffle ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Start */}
              <button
                onClick={startQuiz}
                disabled={filteredCount === 0}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                Start Practice ({Math.min(config.size, filteredCount)} Questions)
              </button>

              {filteredCount === 0 && (
                <p className="text-red-500 text-sm text-center mt-2">
                  No questions match your filters.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-gray-900 font-bold mb-3">Events Covered</h3>
              <div className="space-y-2">
                {[
                  { code: "PEN", name: "Principles of Entrepreneurship" },
                  { code: "PBM", name: "Principles of Business Mgmt." },
                  { code: "PFN", name: "Principles of Finance" },
                  { code: "PHT", name: "Principles of Hospitality & Tourism" },
                  { code: "PMK", name: "Principles of Marketing" },
                ].map((event) => (
                  <div key={event.code} className="flex items-center gap-2">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
                      {event.code}
                    </span>
                    <span className="text-gray-500 text-xs">{event.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-gray-900 font-bold mb-3">How It Works</h3>
              <div className="space-y-3">
                {[
                  { icon: "📝", title: "Answer Questions", desc: "Multiple choice" },
                  { icon: "🤖", title: "Get AI Coaching", desc: "Instant breakdown" },
                  { icon: "📊", title: "Track Progress", desc: "Saved automatically" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-gray-800 text-sm font-medium">{item.title}</div>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

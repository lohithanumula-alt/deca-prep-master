import { createClient } from "./client";
import type { SupabaseClient } from "@supabase/supabase-js";

// ── Sessions (browser client — called from client components) ──

export async function createQuizSession(opts: {
  userId: string;
  totalQuestions: number;
  filterIA: string | null;
  filterLevel: string | null;
}): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      user_id: opts.userId,
      total_questions: opts.totalQuestions,
      filter_ia: opts.filterIA,
      filter_level: opts.filterLevel,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createQuizSession:", error.message);
    return null;
  }
  return data.id;
}

export async function completeQuizSession(
  sessionId: string,
  correctCount: number,
  totalQuestions: number
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("quiz_sessions")
    .update({
      completed_at: new Date().toISOString(),
      correct_count: correctCount,
      score_pct: Math.round((correctCount / totalQuestions) * 100),
    })
    .eq("id", sessionId);

  if (error) console.error("completeQuizSession:", error.message);
}

// ── Attempts (browser client — called from client components) ──

export async function saveQuestionAttempt(opts: {
  sessionId: string;
  userId: string;
  questionId: number;
  piCode: string;
  instructionalArea: string;
  level: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("question_attempts").insert({
    session_id: opts.sessionId,
    user_id: opts.userId,
    question_id: opts.questionId,
    pi_code: opts.piCode,
    instructional_area: opts.instructionalArea,
    level: opts.level,
    selected_answer: opts.selectedAnswer,
    correct_answer: opts.correctAnswer,
    is_correct: opts.isCorrect,
  });

  if (error) console.error("saveQuestionAttempt:", error.message);
}

// ── Dashboard stats (server client — passed in from server component) ──

export async function getDashboardStats(
  supabase: SupabaseClient,
  userId: string
) {
  const [attemptsRes, sessionsRes, iaRes, piRes] = await Promise.all([
    supabase
      .from("question_attempts")
      .select("is_correct")
      .eq("user_id", userId),

    supabase
      .from("quiz_sessions")
      .select("id, started_at, completed_at, total_questions, correct_count, score_pct, filter_ia, filter_level")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(5),

    supabase
      .from("ia_performance")
      .select("instructional_area, attempts, correct, accuracy_pct")
      .eq("user_id", userId)
      .order("accuracy_pct", { ascending: true }),

    supabase
      .from("pi_performance")
      .select("pi_code, instructional_area, attempts, correct, accuracy_pct")
      .eq("user_id", userId)
      .gte("attempts", 2)
      .order("accuracy_pct", { ascending: true })
      .limit(5),
  ]);

  const attempts = attemptsRes.data ?? [];
  const totalAttempted = attempts.length;
  const totalCorrect = attempts.filter((a) => a.is_correct).length;
  const overallPct =
    totalAttempted > 0
      ? Math.round((totalCorrect / totalAttempted) * 100)
      : null;

  return {
    totalAttempted,
    totalCorrect,
    overallPct,
    sessions: sessionsRes.data ?? [],
    iaBreakdown: iaRes.data ?? [],
    weakestPIs: piRes.data ?? [],
  };
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { examQuestions } from "@/data/examQuestions";
import { getDashboardStats } from "@/lib/supabase/db";

const EXAM_CATEGORIES = [
  {
    id: "business-admin",
    title: "Business Admin Core",
    desc: "Business law, communications, customer relations, economics, and operations management.",
    events: ["PEN", "PBM", "PFN", "PHT", "PMK"],
    available: true,
    color: "from-blue-600 to-blue-800",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "marketing",
    title: "Marketing",
    desc: "Marketing concepts, market research, advertising, branding, and consumer behavior.",
    events: ["PMK"],
    available: false,
    color: "from-teal-600 to-teal-800",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    id: "finance",
    title: "Finance",
    desc: "Financial analysis, investments, banking, and financial management principles.",
    events: ["PFN"],
    available: false,
    color: "from-orange-600 to-orange-800",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    desc: "Starting a business, innovation, risk management, and entrepreneurial mindset.",
    events: ["PEN"],
    available: false,
    color: "from-red-600 to-red-800",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "hospitality",
    title: "Hospitality & Tourism",
    desc: "Hotel operations, tourism, food service, event planning, and hospitality management.",
    events: ["PHT"],
    available: false,
    color: "from-emerald-600 to-emerald-800",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "management",
    title: "Management",
    desc: "Leadership, human resources, organizational behavior, and strategic planning.",
    events: ["PBM"],
    available: false,
    color: "from-yellow-600 to-yellow-800",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "Student";

  const stats = await getDashboardStats(supabase, user.id);
  const hasActivity = stats.totalAttempted > 0;

  const accuracyColor =
    stats.overallPct === null ? "text-gray-400"
    : stats.overallPct >= 80 ? "text-green-400"
    : stats.overallPct >= 60 ? "text-yellow-400"
    : "text-red-400";

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* ── NAV ── */}
      <nav className="bg-[#0d1117]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-bold text-lg">
              DECA <span className="text-blue-400">Prep Master</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                {firstName[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block text-gray-200">{firstName}</span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10 border border-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ── GREETING ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {hasActivity ? "Session in progress" : "Ready to study"}
          </div>
          <h1 className="text-4xl font-extrabold text-white">
            Hey {firstName}! {hasActivity ? "👋" : "🎉"}
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            {hasActivity
              ? "Here's how you're doing. Keep up the momentum!"
              : "Welcome! Start a practice session to begin tracking your progress."}
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Questions Practiced", value: hasActivity ? stats.totalAttempted.toString() : "—", color: "text-blue-400", icon: "📝" },
            { label: "Overall Accuracy", value: stats.overallPct !== null ? `${stats.overallPct}%` : "—", color: accuracyColor, icon: "🎯" },
            { label: "Sessions Completed", value: hasActivity ? stats.sessions.length.toString() : "—", color: "text-purple-400", icon: "⚡" },
            { label: "Questions Available", value: examQuestions.length.toString(), color: "text-teal-400", icon: "📚" },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a2035] border border-white/10 rounded-2xl p-5 text-center hover:border-blue-500/30 transition-colors">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── CATEGORY GRID ── */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-1">Choose Your Exam Category</h2>
            <p className="text-gray-400 text-sm mb-5">Select a category to start practicing</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXAM_CATEGORIES.map((cat) => {
                const card = (
                  <div className={`bg-[#1a2035] border rounded-2xl p-5 h-full transition-all ${
                    cat.available
                      ? "border-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 cursor-pointer"
                      : "border-white/5 opacity-50"
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        {cat.icon}
                      </div>
                      {!cat.available && (
                        <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded-full font-medium">
                          Coming soon
                        </span>
                      )}
                      {cat.available && (
                        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full font-medium">
                          Available
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-base mb-1">{cat.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">{cat.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.events.map((e) => (
                        <span key={e} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded font-mono font-semibold">
                          {e}
                        </span>
                      ))}
                    </div>
                    {cat.available && (
                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                        <span className="text-gray-500">100 questions</span>
                        <span className="text-blue-400 font-bold flex items-center gap-1">
                          Start practicing →
                        </span>
                      </div>
                    )}
                  </div>
                );

                return cat.available ? (
                  <Link key={cat.id} href={`/quiz/${cat.id}`} className="block">
                    {card}
                  </Link>
                ) : (
                  <div key={cat.id}>{card}</div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Performance by area */}
            <div className="bg-[#1a2035] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-1">Performance by Area</h3>
              {stats.iaBreakdown.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {stats.iaBreakdown
                    .slice()
                    .sort((a, b) => Number(b.accuracy_pct) - Number(a.accuracy_pct))
                    .map((ia) => {
                      const pct = Number(ia.accuracy_pct);
                      const barColor = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
                      const textColor = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
                      return (
                        <div key={ia.instructional_area}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-gray-300 text-xs truncate max-w-[150px]">{ia.instructional_area}</span>
                            <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-3">Complete a session to see your breakdown.</p>
              )}
            </div>

            {/* Weakest PIs */}
            {stats.weakestPIs.length > 0 && (
              <div className="bg-[#1a2035] border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-1">Focus Areas</h3>
                <p className="text-gray-500 text-xs mb-3">PIs where you struggle most</p>
                <div className="space-y-2">
                  {stats.weakestPIs.map((pi) => (
                    <div key={pi.pi_code} className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-red-400">{pi.pi_code}</span>
                        <span className="text-xs text-gray-500 ml-2">{pi.attempts} attempts</span>
                      </div>
                      <span className="text-xs font-bold text-red-400">{pi.accuracy_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent sessions */}
            {stats.sessions.length > 0 && (
              <div className="bg-[#1a2035] border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">Recent Sessions</h3>
                <div className="space-y-2.5">
                  {stats.sessions.map((session) => {
                    const pct = Number(session.score_pct);
                    const date = new Date(session.completed_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const color = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
                    return (
                      <div key={session.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-200 text-sm font-medium">{session.total_questions}Q</span>
                          {session.filter_ia && (
                            <span className="text-gray-500 text-xs ml-1.5">· {session.filter_ia}</span>
                          )}
                          <span className="text-gray-600 text-xs ml-2">{date}</span>
                        </div>
                        <span className={`font-bold text-sm ${color}`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Study tip */}
            {!hasActivity && (
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
                <p className="font-semibold text-blue-400 text-sm mb-1">💡 Study tip</p>
                <p className="text-blue-300/70 text-xs leading-relaxed">
                  After each question, tap <strong className="text-blue-300">Get AI Coaching</strong> to understand exactly why you got it right or wrong.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-gray-600 text-sm mt-10">
        DECA Prep Master · Not affiliated with DECA Inc.
      </footer>
    </div>
  );
}

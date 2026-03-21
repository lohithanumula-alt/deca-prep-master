import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { examQuestions } from "@/data/examQuestions";
import { getDashboardStats } from "@/lib/supabase/db";
import {
  Zap,
  BookOpen,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb,
  ChevronRight,
  LogOut,
  Trophy,
  Clock,
  Flame,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const EXAM_CATEGORIES = [
  {
    id: "business-admin",
    title: "Business Admin Core",
    subtitle: "All 5 Principles Events",
    desc: "Business law, communications, customer relations, economics, and operations management.",
    events: ["PEN", "PBM", "PFN", "PHT", "PMK"],
    questions: 100,
    available: true,
    accent: "from-blue-500 to-indigo-600",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    accentText: "text-blue-400",
    tag: "Available Now",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    id: "marketing",
    title: "Marketing",
    subtitle: "Principles of Marketing",
    desc: "Market research, advertising, consumer behavior, and marketing strategy.",
    events: ["PMK"],
    questions: 0,
    available: false,
    accent: "from-teal-500 to-emerald-600",
    accentBg: "bg-teal-500/10",
    accentBorder: "border-teal-500/20",
    accentText: "text-teal-400",
    tag: "Coming Soon",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Principles of Finance",
    desc: "Financial analysis, investments, banking, and financial management principles.",
    events: ["PFN"],
    questions: 0,
    available: false,
    accent: "from-orange-500 to-amber-600",
    accentBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/20",
    accentText: "text-orange-400",
    tag: "Coming Soon",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    subtitle: "Principles of Entrepreneurship",
    desc: "Starting a business, innovation, risk management, and entrepreneurial mindset.",
    events: ["PEN"],
    questions: 0,
    available: false,
    accent: "from-rose-500 to-pink-600",
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/20",
    accentText: "text-rose-400",
    tag: "Coming Soon",
    icon: <Flame className="w-6 h-6" />,
  },
  {
    id: "hospitality",
    title: "Hospitality & Tourism",
    subtitle: "Principles of Hospitality",
    desc: "Hotel operations, tourism, food service, event planning, and hospitality management.",
    events: ["PHT"],
    questions: 0,
    available: false,
    accent: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
    accentText: "text-emerald-400",
    tag: "Coming Soon",
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    id: "management",
    title: "Management",
    subtitle: "Principles of Business Mgmt",
    desc: "Leadership, human resources, organizational behavior, and strategic planning.",
    events: ["PBM"],
    questions: 0,
    available: false,
    accent: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    accentText: "text-violet-400",
    tag: "Coming Soon",
    icon: <Target className="w-6 h-6" />,
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

  return (
    <div className="min-h-screen bg-[#080c14] font-[family-name:var(--font-dm-sans)] text-white">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur-xl border-b border-white/8 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-[family-name:var(--font-syne)] font-bold text-base text-white tracking-tight">
              DECA <span className="text-blue-400">Coach</span>
            </span>
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-2.5 hover:bg-white/8 rounded-full px-3 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-sm text-white">
                {firstName[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-300 hidden sm:block">{firstName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
            </button>
            <div className="absolute right-0 mt-2 w-52 bg-[#111827] rounded-xl shadow-2xl border border-white/10 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-white truncate mt-0.5">{user.email}</p>
              </div>
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">DECA Business Administration Core</p>
            <h1 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {hasActivity ? `Welcome back, ${firstName} 👋` : `Hey ${firstName}, ready to study? 🎯`}
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-md">
              {hasActivity
                ? "Here's your progress. Keep pushing — every question gets you closer."
                : "Choose a category below and start your first practice session."}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8 shrink-0">
            {[
              { label: "Practiced", value: hasActivity ? stats.totalAttempted : "—", color: "text-blue-400" },
              { label: "Accuracy", value: stats.overallPct !== null ? `${stats.overallPct}%` : "—", color: stats.overallPct !== null ? (stats.overallPct >= 80 ? "text-green-400" : stats.overallPct >= 60 ? "text-yellow-400" : "text-red-400") : "text-gray-500" },
              { label: "Sessions", value: hasActivity ? stats.sessions.length : "—", color: "text-purple-400" },
              { label: "Available", value: examQuestions.length, color: "text-teal-400" },
            ].map((s) => (
              <div key={s.label} className="bg-[#0d1117] px-5 py-4 text-center min-w-[80px]">
                <div className={`font-[family-name:var(--font-syne)] text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* ── CHOOSE YOUR TEST ── */}
        <section>
          <div className="mb-6">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Practice</p>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-extrabold text-white">Choose Your Test</h2>
            <p className="text-gray-400 text-sm mt-1">Select a category to start practicing. More coming soon.</p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All Events", "PEN", "PBM", "PFN", "PHT", "PMK"].map((chip, i) => (
              <span
                key={chip}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer transition-all ${
                  i === 0
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white/5 text-gray-400 border border-white/8 hover:bg-white/10 hover:text-white"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAM_CATEGORIES.map((cat) => {
              const cardInner = (
                <div className={`relative rounded-2xl border h-full flex flex-col transition-all duration-200 overflow-hidden ${
                  cat.available
                    ? `bg-[#0d1117] border-white/10 hover:border-blue-500/40 hover:bg-[#111827] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 group cursor-pointer`
                    : "bg-[#0a0e16] border-white/5 opacity-50 cursor-default"
                }`}>

                  {/* Subtle gradient top strip */}
                  {cat.available && (
                    <div className={`h-1 bg-gradient-to-r ${cat.accent} w-full`} />
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl ${cat.accentBg} border ${cat.accentBorder} flex items-center justify-center ${cat.accentText}`}>
                        {cat.icon}
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        cat.available
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                          : "bg-white/5 text-gray-500 border border-white/8"
                      }`}>
                        {cat.tag}
                      </span>
                    </div>

                    {/* Title + subtitle */}
                    <h3 className="font-[family-name:var(--font-syne)] font-bold text-white text-base leading-tight mb-1">
                      {cat.title}
                    </h3>
                    <p className={`text-xs mb-3 ${cat.accentText}`}>{cat.subtitle}</p>
                    <p className="text-gray-400 text-xs leading-relaxed flex-1">{cat.desc}</p>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {cat.events.map(e => (
                          <span key={e} className="text-xs bg-white/8 text-gray-300 px-2 py-0.5 rounded font-mono font-semibold">{e}</span>
                        ))}
                      </div>
                      {cat.available ? (
                        <span className="inline-flex items-center gap-1 text-blue-400 font-bold text-xs group-hover:text-blue-300 transition-colors">
                          {cat.questions} Qs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">0 Qs</span>
                      )}
                    </div>

                    {/* CTA bar for available */}
                    {cat.available && (
                      <div className="mt-3">
                        <div className="w-full bg-blue-600 group-hover:bg-blue-500 text-white font-bold text-sm py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                          Start Practice <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );

              return cat.available ? (
                <Link key={cat.id} href={`/quiz/${cat.id}`} className="flex flex-col">
                  {cardInner}
                </Link>
              ) : (
                <div key={cat.id}>{cardInner}</div>
              );
            })}
          </div>
        </section>

        {/* ── PERFORMANCE + STATS ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Performance by area */}
          <div className="md:col-span-2 bg-[#0d1117] rounded-2xl border border-white/8 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="font-[family-name:var(--font-syne)] font-bold text-white text-sm">Performance by Area</h3>
            </div>
            {stats.iaBreakdown.length > 0 ? (
              <div className="space-y-5">
                {stats.iaBreakdown
                  .slice()
                  .sort((a, b) => Number(b.accuracy_pct) - Number(a.accuracy_pct))
                  .slice(0, 5)
                  .map((ia) => {
                    const pct = Number(ia.accuracy_pct);
                    const color = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
                    return (
                      <div key={ia.instructional_area}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300 text-sm font-medium">{ia.instructional_area}</span>
                          <span className={`text-sm font-bold ${color}`}>{pct}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-36 text-center">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-gray-400 text-sm font-medium">No data yet</p>
                <p className="text-gray-600 text-xs mt-1">Complete a session to see your breakdown</p>
              </div>
            )}
          </div>

          {/* Recent sessions / tip */}
          <div className="bg-[#0d1117] rounded-2xl border border-white/8 p-6 flex flex-col">
            {hasActivity && stats.sessions.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-white text-sm">Recent Sessions</h3>
                </div>
                <div className="space-y-2.5 flex-1">
                  {stats.sessions.slice(0, 4).map((session) => {
                    const pct = Number(session.score_pct);
                    const date = new Date(session.completed_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const scoreColor = pct >= 80 ? "text-green-400 bg-green-500/10" : pct >= 60 ? "text-yellow-400 bg-yellow-500/10" : "text-red-400 bg-red-500/10";
                    return (
                      <div key={session.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/8 transition-colors">
                        <div>
                          <span className="text-gray-200 text-sm font-semibold">{session.total_questions} Questions</span>
                          <div className="text-gray-500 text-xs mt-0.5">{date}</div>
                        </div>
                        <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${scoreColor}`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-white text-sm">Pro Tip</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  After each question, tap{" "}
                  <span className="text-blue-400 font-semibold">Get AI Coaching</span>{" "}
                  to get a full breakdown — why you got it right or wrong, real-world examples, and a new practice question.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  Works on every single question
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── FOCUS AREAS (if activity) ── */}
        {hasActivity && stats.weakestPIs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-red-400" />
              <h3 className="font-[family-name:var(--font-syne)] font-bold text-white text-sm">Focus Areas</h3>
              <span className="text-gray-500 text-xs">— performance indicators to review</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.weakestPIs.map((pi) => (
                <div key={pi.pi_code} className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-red-500/8 border border-red-500/15">
                  <div>
                    <span className="text-sm font-mono font-bold text-red-400">{pi.pi_code}</span>
                    <div className="text-gray-500 text-xs mt-0.5">{pi.attempts} attempts</div>
                  </div>
                  <span className="font-bold text-sm text-red-400 bg-red-500/15 px-3 py-1 rounded-full">{pi.accuracy_pct}%</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-[family-name:var(--font-syne)] font-bold text-white text-sm">DECA Coach</span>
          </div>
          <div className="flex items-center gap-6 text-gray-600 text-xs">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Home</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">About</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
          </div>
          <p className="text-gray-700 text-xs">© 2026 DECA Coach · Not affiliated with DECA Inc.</p>
        </div>
      </footer>
    </div>
  );
}

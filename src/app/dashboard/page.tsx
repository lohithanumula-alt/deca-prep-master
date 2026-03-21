import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { examQuestions } from "@/data/examQuestions";
import { getDashboardStats } from "@/lib/supabase/db";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  BookOpen,
  Brain,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb,
  ChevronRight,
  LogOut,
  Trophy,
  Clock,
  Flame,
} from "lucide-react";

const EXAM_CATEGORIES = [
  {
    id: "business-admin",
    title: "Business Admin Core",
    subtitle: "All 5 Principles Events",
    desc: "Business law, communications, customer relations, economics, and operations.",
    events: ["PEN", "PBM", "PFN", "PHT", "PMK"],
    questions: 100,
    available: true,
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    tag: "Most Popular",
    tagVariant: "blue" as const,
    icon: <BookOpen className="w-9 h-9 text-white/90" />,
  },
  {
    id: "marketing",
    title: "Marketing",
    subtitle: "Principles of Marketing",
    desc: "Marketing concepts, market research, advertising, and consumer behavior.",
    events: ["PMK"],
    questions: 0,
    available: false,
    gradient: "from-teal-600 via-teal-700 to-emerald-800",
    tag: "Coming Soon",
    tagVariant: "gray" as const,
    icon: <TrendingUp className="w-9 h-9 text-white/90" />,
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Principles of Finance",
    desc: "Financial analysis, investments, banking, and financial management.",
    events: ["PFN"],
    questions: 0,
    available: false,
    gradient: "from-orange-600 via-orange-700 to-amber-800",
    tag: "Coming Soon",
    tagVariant: "gray" as const,
    icon: <BarChart3 className="w-9 h-9 text-white/90" />,
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    subtitle: "Principles of Entrepreneurship",
    desc: "Starting a business, innovation, risk management, and entrepreneurial mindset.",
    events: ["PEN"],
    questions: 0,
    available: false,
    gradient: "from-rose-600 via-red-700 to-pink-800",
    tag: "Coming Soon",
    tagVariant: "gray" as const,
    icon: <Flame className="w-9 h-9 text-white/90" />,
  },
  {
    id: "hospitality",
    title: "Hospitality & Tourism",
    subtitle: "Principles of Hospitality",
    desc: "Hotel operations, tourism, food service, event planning, and hospitality management.",
    events: ["PHT"],
    questions: 0,
    available: false,
    gradient: "from-emerald-600 via-green-700 to-teal-800",
    tag: "Coming Soon",
    tagVariant: "gray" as const,
    icon: <Trophy className="w-9 h-9 text-white/90" />,
  },
  {
    id: "management",
    title: "Management",
    subtitle: "Principles of Business Mgmt",
    desc: "Leadership, human resources, organizational behavior, and strategic planning.",
    events: ["PBM"],
    questions: 0,
    available: false,
    gradient: "from-violet-600 via-purple-700 to-indigo-800",
    tag: "Coming Soon",
    tagVariant: "gray" as const,
    icon: <Target className="w-9 h-9 text-white/90" />,
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
    <div className="min-h-screen bg-[#f6f0e8] font-[family-name:var(--font-dm-sans)]">

      {/* ── NAV ── */}
      <nav className="bg-[#0f1623] px-6 py-3.5 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-[family-name:var(--font-syne)] font-bold text-base text-white tracking-tight">
            DECA <span className="text-blue-400">Coach</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2.5 hover:bg-white/8 rounded-full px-3 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-sm text-white shadow-md">
                {firstName[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-300 hidden sm:block">{firstName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-90" />
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
              </div>
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <div className="relative bg-[#0f1623] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-48 h-48 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">DECA Business Administration Core</p>
            <h1 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {hasActivity ? `Welcome back, ${firstName} 👋` : `Let's get started, ${firstName}!`}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {hasActivity
                ? "Here's your progress. Keep pushing — you've got this!"
                : "Pick a category below to start your first practice session."}
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            {[
              { label: "Practiced", value: hasActivity ? stats.totalAttempted : "—", icon: <BookOpen className="w-4 h-4" />, color: "text-blue-400" },
              { label: "Accuracy", value: stats.overallPct !== null ? `${stats.overallPct}%` : "—", icon: <Target className="w-4 h-4" />, color: stats.overallPct !== null ? (stats.overallPct >= 80 ? "text-green-400" : stats.overallPct >= 60 ? "text-yellow-400" : "text-red-400") : "text-gray-400" },
              { label: "Sessions", value: hasActivity ? stats.sessions.length : "—", icon: <Clock className="w-4 h-4" />, color: "text-purple-400" },
              { label: "Available", value: examQuestions.length, icon: <Brain className="w-4 h-4" />, color: "text-teal-400" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`flex items-center justify-center gap-1 ${s.color} mb-0.5`}>
                  {s.icon}
                  <span className="font-[family-name:var(--font-syne)] text-2xl font-extrabold">{s.value}</span>
                </div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Featured + Performance */}
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-base font-bold text-gray-800 mb-4">Featured Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Featured big card */}
            {EXAM_CATEGORIES.filter(c => c.available).map((cat) => (
              <Link key={cat.id} href={`/quiz/${cat.id}`} className="md:col-span-2 group block">
                <div className={`relative bg-gradient-to-br ${cat.gradient} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 h-full`}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                  </div>
                  <div className="relative p-7 flex flex-col h-full justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5 shrink-0">
                        {cat.icon}
                      </div>
                      <div className="flex-1">
                        <Badge className="bg-white/20 text-white border-0 text-xs font-bold mb-2 hover:bg-white/20">{cat.tag}</Badge>
                        <h3 className="font-[family-name:var(--font-syne)] text-white font-extrabold text-2xl leading-tight mb-1">{cat.title}</h3>
                        <p className="text-white/60 text-sm">{cat.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {cat.events.map(e => (
                          <span key={e} className="text-xs bg-white/15 text-white/90 px-2 py-0.5 rounded font-mono font-bold">{e}</span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-white text-blue-700 font-bold text-sm px-4 py-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                        Start <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Performance sidebar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <h3 className="font-[family-name:var(--font-syne)] font-bold text-gray-800 text-sm">Performance by Area</h3>
              </div>
              {stats.iaBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {stats.iaBreakdown
                    .slice()
                    .sort((a, b) => Number(b.accuracy_pct) - Number(a.accuracy_pct))
                    .slice(0, 5)
                    .map((ia) => {
                      const pct = Number(ia.accuracy_pct);
                      const color = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500";
                      return (
                        <div key={ia.instructional_area}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-gray-600 text-xs truncate max-w-[140px] font-medium">{ia.instructional_area}</span>
                            <span className={`text-xs font-bold ${color}`}>{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-36 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <BarChart3 className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No data yet</p>
                  <p className="text-gray-400 text-xs mt-1">Complete a session to see your breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-syne)] text-base font-bold text-gray-800">All Categories</h2>
            <span className="text-xs text-gray-400 font-medium">{EXAM_CATEGORIES.length} categories</span>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {["All Events", "PEN", "PBM", "PFN", "PHT", "PMK"].map((chip, i) => (
              <span
                key={chip}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer transition-colors ${
                  i === 0
                    ? "bg-[#0f1623] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAM_CATEGORIES.map((cat) => {
              const cardContent = (
                <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all h-full ${
                  cat.available
                    ? "border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                    : "border-gray-100 opacity-55"
                }`}>
                  {/* Gradient top */}
                  <div className={`bg-gradient-to-br ${cat.gradient} h-28 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full blur-2xl" />
                    </div>
                    <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                      {cat.icon}
                    </div>
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full text-white ${
                      cat.available ? "bg-blue-500" : "bg-gray-600/70"
                    }`}>
                      {cat.tag}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="p-4">
                    <h3 className="font-[family-name:var(--font-syne)] text-gray-900 font-bold text-sm mb-0.5">{cat.title}</h3>
                    <p className="text-gray-400 text-xs mb-2">{cat.subtitle}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {cat.events.map(e => (
                          <span key={e} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">{e}</span>
                        ))}
                      </div>
                      {cat.available && (
                        <span className="text-xs font-bold text-gray-400">{cat.questions} Qs</span>
                      )}
                    </div>
                    {cat.available && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Ready to practice</span>
                        <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs group-hover:gap-2 transition-all">
                          Practice <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
              return cat.available ? (
                <Link key={cat.id} href={`/quiz/${cat.id}`} className="flex flex-col">{cardContent}</Link>
              ) : (
                <div key={cat.id}>{cardContent}</div>
              );
            })}
          </div>
        </div>

        {/* Recent Sessions + Focus Areas */}
        {hasActivity && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stats.sessions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-gray-800 text-sm">Recent Sessions</h3>
                </div>
                <div className="space-y-2.5">
                  {stats.sessions.map((session) => {
                    const pct = Number(session.score_pct);
                    const date = new Date(session.completed_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const scoreStyle = pct >= 80
                      ? "text-green-700 bg-green-100"
                      : pct >= 60
                      ? "text-yellow-700 bg-yellow-100"
                      : "text-red-600 bg-red-100";
                    return (
                      <div key={session.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div>
                          <span className="text-gray-800 text-sm font-semibold">{session.total_questions} Questions</span>
                          {session.filter_ia && <span className="text-gray-400 text-xs ml-2">· {session.filter_ia}</span>}
                          <div className="text-gray-400 text-xs mt-0.5">{date}</div>
                        </div>
                        <span className={`font-bold text-xs px-3 py-1.5 rounded-full ${scoreStyle}`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {stats.weakestPIs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-red-500" />
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-gray-800 text-sm">Focus Areas</h3>
                </div>
                <p className="text-gray-400 text-xs mb-4">Performance indicators to review</p>
                <div className="space-y-2">
                  {stats.weakestPIs.map((pi) => (
                    <div key={pi.pi_code} className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                      <div>
                        <span className="text-xs font-mono font-bold text-red-700">{pi.pi_code}</span>
                        <span className="text-xs text-gray-400 ml-2">{pi.attempts} attempts</span>
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">{pi.accuracy_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tip for new users */}
        {!hasActivity && (
          <div className="bg-white border border-blue-100 rounded-2xl p-5 flex gap-4 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-syne)] font-bold text-gray-900 text-sm">Pro tip</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                After each question, tap <strong className="text-gray-700">Get AI Coaching</strong> to get a full breakdown — why you got it right or wrong, real-world examples, and a brand-new practice question.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-10 bg-[#0f1623] border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-[family-name:var(--font-syne)] font-bold text-white text-sm">DECA Coach</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-xs">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Home</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">About</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
          </div>
          <p className="text-gray-600 text-xs">© 2026 DECA Coach · Not affiliated with DECA Inc.</p>
        </div>
      </footer>
    </div>
  );
}

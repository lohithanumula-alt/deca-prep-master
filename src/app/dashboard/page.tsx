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
    subtitle: "All 5 Principles Events",
    desc: "Business law, communications, customer relations, economics, and operations.",
    events: ["PEN", "PBM", "PFN", "PHT", "PMK"],
    questions: 100,
    available: true,
    gradient: "from-blue-900 via-blue-800 to-indigo-900",
    tag: "Most Popular",
    tagColor: "bg-blue-500",
    icon: (
      <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "marketing",
    title: "Marketing",
    subtitle: "Principles of Marketing",
    desc: "Marketing concepts, market research, advertising, and consumer behavior.",
    events: ["PMK"],
    questions: 0,
    available: false,
    gradient: "from-teal-900 via-teal-800 to-emerald-900",
    tag: "Coming Soon",
    tagColor: "bg-gray-500",
    icon: (
      <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Principles of Finance",
    desc: "Financial analysis, investments, banking, and financial management.",
    events: ["PFN"],
    questions: 0,
    available: false,
    gradient: "from-orange-900 via-orange-800 to-amber-900",
    tag: "Coming Soon",
    tagColor: "bg-gray-500",
    icon: (
      <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    subtitle: "Principles of Entrepreneurship",
    desc: "Starting a business, innovation, risk management, and entrepreneurial mindset.",
    events: ["PEN"],
    questions: 0,
    available: false,
    gradient: "from-rose-900 via-red-800 to-pink-900",
    tag: "Coming Soon",
    tagColor: "bg-gray-500",
    icon: (
      <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "hospitality",
    title: "Hospitality & Tourism",
    subtitle: "Principles of Hospitality",
    desc: "Hotel operations, tourism, food service, event planning, and hospitality management.",
    events: ["PHT"],
    questions: 0,
    available: false,
    gradient: "from-emerald-900 via-green-800 to-teal-900",
    tag: "Coming Soon",
    tagColor: "bg-gray-500",
    icon: (
      <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "management",
    title: "Management",
    subtitle: "Principles of Business Management",
    desc: "Leadership, human resources, organizational behavior, and strategic planning.",
    events: ["PBM"],
    questions: 0,
    available: false,
    gradient: "from-violet-900 via-purple-800 to-indigo-900",
    tag: "Coming Soon",
    tagColor: "bg-gray-500",
    icon: (
      <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
    stats.overallPct === null ? "text-gray-300"
    : stats.overallPct >= 80 ? "text-green-300"
    : stats.overallPct >= 60 ? "text-yellow-300"
    : "text-red-300";

  return (
    <div className="min-h-screen bg-[#f5ede0]">

      {/* ── NAV ── */}
      <nav className="bg-[#1a1a2e] text-white px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-base">
            DECA <span className="text-blue-400">Prep Master</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 hover:bg-white/10 rounded-full px-3 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                {firstName[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block">{firstName}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
              </div>
              <form action={logout}>
                <button type="submit" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <div className="relative bg-[#1a1a2e] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-blue-400 text-sm font-semibold mb-1">DECA Business Administration Core</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {hasActivity ? `Welcome back, ${firstName}! 👋` : `Hey ${firstName}, let's study! 🎉`}
            </h1>
            <p className="text-gray-400 mt-2">
              {hasActivity ? "Here's your progress overview. Keep up the great work!" : "Pick a category below to start your first practice session."}
            </p>
          </div>
          {/* Quick stats in hero */}
          <div className="flex gap-4 flex-shrink-0">
            {[
              { label: "Practiced", value: hasActivity ? stats.totalAttempted : "—", color: "text-blue-300" },
              { label: "Accuracy", value: stats.overallPct !== null ? `${stats.overallPct}%` : "—", color: accuracyColor },
              { label: "Sessions", value: hasActivity ? stats.sessions.length : "—", color: "text-purple-300" },
              { label: "Available", value: examQuestions.length, color: "text-teal-300" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Featured (available) */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Featured Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXAM_CATEGORIES.filter(c => c.available).map((cat) => (
              <Link key={cat.id} href={`/quiz/${cat.id}`} className="md:col-span-2 group block">
                <div className={`relative bg-gradient-to-br ${cat.gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-0.5`}>
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                  </div>
                  <div className="relative p-6 flex items-start gap-4">
                    <div className="bg-white/10 rounded-xl p-3 flex-shrink-0">
                      {cat.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${cat.tagColor}`}>{cat.tag}</span>
                      </div>
                      <h3 className="text-white font-extrabold text-xl mb-1">{cat.title}</h3>
                      <p className="text-white/60 text-sm mb-3">{cat.subtitle}</p>
                      <p className="text-white/70 text-sm leading-relaxed mb-4">{cat.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {cat.events.map(e => (
                            <span key={e} className="text-xs bg-white/15 text-white/90 px-2 py-0.5 rounded font-mono font-semibold">{e}</span>
                          ))}
                        </div>
                        <span className="text-white font-bold text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
                          Start →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Stats sidebar card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Performance by Area</h3>
              {stats.iaBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {stats.iaBreakdown
                    .slice()
                    .sort((a, b) => Number(b.accuracy_pct) - Number(a.accuracy_pct))
                    .slice(0, 5)
                    .map((ia) => {
                      const pct = Number(ia.accuracy_pct);
                      const barColor = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
                      const textColor = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500";
                      return (
                        <div key={ia.instructional_area}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 text-xs truncate max-w-[140px]">{ia.instructional_area}</span>
                            <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-400 text-sm">Complete a session to see your breakdown.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ALL CATEGORIES ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">All Categories</h2>
            <span className="text-sm text-gray-400">{EXAM_CATEGORIES.length} categories</span>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {["All Events", "PEN", "PBM", "PFN", "PHT", "PMK"].map((chip, i) => (
              <span
                key={chip}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                  i === 0
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAM_CATEGORIES.map((cat) => {
              const card = (
                <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                  cat.available
                    ? "border-gray-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    : "border-gray-100 opacity-60"
                }`}>
                  {/* Card image/gradient top */}
                  <div className={`bg-gradient-to-br ${cat.gradient} h-32 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full blur-2xl" />
                    </div>
                    <div className="relative bg-white/10 rounded-xl p-3">
                      {cat.icon}
                    </div>
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white ${cat.tagColor}`}>
                      {cat.tag}
                    </span>
                  </div>
                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="text-gray-900 font-bold text-base mb-0.5">{cat.title}</h3>
                    <p className="text-gray-400 text-xs mb-3">{cat.subtitle}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {cat.events.map(e => (
                          <span key={e} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-semibold">{e}</span>
                        ))}
                      </div>
                      {cat.available && (
                        <span className="text-xs font-bold text-gray-400">{cat.questions} Qs</span>
                      )}
                    </div>
                    {cat.available && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Click to start</span>
                        <span className="text-blue-600 font-bold text-sm">Practice →</span>
                      </div>
                    )}
                  </div>
                </div>
              );
              return cat.available ? (
                <Link key={cat.id} href={`/quiz/${cat.id}`}>{card}</Link>
              ) : (
                <div key={cat.id}>{card}</div>
              );
            })}
          </div>
        </div>

        {/* ── RECENT SESSIONS + FOCUS AREAS ── */}
        {hasActivity && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            {stats.sessions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {stats.sessions.map((session) => {
                    const pct = Number(session.score_pct);
                    const date = new Date(session.completed_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const color = pct >= 80 ? "text-green-600 bg-green-50" : pct >= 60 ? "text-yellow-600 bg-yellow-50" : "text-red-500 bg-red-50";
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div>
                          <span className="text-gray-800 text-sm font-semibold">{session.total_questions} Questions</span>
                          {session.filter_ia && <span className="text-gray-400 text-xs ml-2">· {session.filter_ia}</span>}
                          <div className="text-gray-400 text-xs mt-0.5">{date}</div>
                        </div>
                        <span className={`font-bold text-sm px-3 py-1 rounded-full ${color}`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {stats.weakestPIs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-1">Focus Areas</h3>
                <p className="text-gray-400 text-xs mb-4">Performance indicators to review</p>
                <div className="space-y-2">
                  {stats.weakestPIs.map((pi) => (
                    <div key={pi.pi_code} className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                      <div>
                        <span className="text-xs font-mono font-bold text-red-700">{pi.pi_code}</span>
                        <span className="text-xs text-gray-400 ml-2">{pi.attempts} attempts</span>
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{pi.accuracy_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tip for new users */}
        {!hasActivity && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-blue-900 text-sm">Study tip</p>
              <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                After each question, tap <strong>Get AI Coaching</strong> to get a full breakdown — why you got it right or wrong, real-world examples, and a practice question.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-[#1a1a2e] text-gray-500 py-6 text-center text-sm mt-10">
        <div className="flex items-center justify-center gap-6 text-gray-600 mb-2 text-xs">
          <span>Home</span><span>About</span><span>Privacy Policy</span>
        </div>
        <p className="text-gray-700 text-xs">© 2026 DECA Prep Master · Not affiliated with DECA Inc.</p>
      </footer>
    </div>
  );
}

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
    icon: "🏢",
    iconBg: "bg-blue-500",
    events: ["PEN", "PBM", "PFN", "PHT", "PMK"],
    available: true,
  },
  {
    id: "marketing",
    title: "Marketing",
    desc: "Marketing concepts, market research, advertising, branding, and consumer behavior.",
    icon: "📢",
    iconBg: "bg-teal-500",
    events: ["PMK"],
    available: false,
  },
  {
    id: "finance",
    title: "Finance",
    desc: "Financial analysis, investments, banking, and financial management principles.",
    icon: "💰",
    iconBg: "bg-orange-500",
    events: ["PFN"],
    available: false,
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    desc: "Starting a business, innovation, risk management, and entrepreneurial mindset.",
    icon: "💡",
    iconBg: "bg-red-500",
    events: ["PEN"],
    available: false,
  },
  {
    id: "hospitality",
    title: "Hospitality & Tourism",
    desc: "Hotel operations, tourism, food service, event planning, and hospitality management.",
    icon: "🍽️",
    iconBg: "bg-emerald-500",
    events: ["PHT"],
    available: false,
  },
  {
    id: "management",
    title: "Management",
    desc: "Leadership, human resources, organizational behavior, and strategic planning.",
    icon: "👥",
    iconBg: "bg-yellow-500",
    events: ["PBM"],
    available: false,
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

  const stats = await getDashboardStats(user.id);
  const hasActivity = stats.totalAttempted > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-lg">
            DECA <span className="text-blue-400">Prep Master</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
              {firstName[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block">{firstName}</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hey {firstName}! {hasActivity ? "👋" : "🎉"}
          </h1>
          <p className="text-gray-500 mt-1">
            {hasActivity
              ? "Here's how you're doing. Keep up the momentum!"
              : "Welcome! Start a practice session to begin tracking your progress."}
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Questions Practiced"
            value={hasActivity ? stats.totalAttempted.toString() : "—"}
            color="text-blue-600"
          />
          <StatCard
            label="Overall Accuracy"
            value={stats.overallPct !== null ? `${stats.overallPct}%` : "—"}
            color={
              stats.overallPct === null
                ? "text-gray-400"
                : stats.overallPct >= 80
                ? "text-green-600"
                : stats.overallPct >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }
          />
          <StatCard
            label="Sessions Completed"
            value={hasActivity ? stats.sessions.length.toString() : "—"}
            color="text-purple-600"
          />
          <StatCard
            label="Questions Available"
            value={examQuestions.length.toString()}
            color="text-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Category grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Exam Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXAM_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all ${
                    cat.available
                      ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                      : "opacity-60"
                  }`}
                >
                  {cat.available ? (
                    <Link href={`/quiz/${cat.id}`} className="block p-5">
                      <CategoryCard cat={cat} />
                    </Link>
                  ) : (
                    <div className="p-5">
                      <CategoryCard cat={cat} comingSoon />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Progress sidebar */}
          <div className="space-y-5">
            {/* Instructional area breakdown */}
            {stats.iaBreakdown.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-900 font-bold mb-4">Performance by Area</h3>
                <div className="space-y-3">
                  {stats.iaBreakdown
                    .slice()
                    .sort((a, b) => Number(b.accuracy_pct) - Number(a.accuracy_pct))
                    .map((ia) => {
                      const pct = Number(ia.accuracy_pct);
                      return (
                        <div key={ia.instructional_area}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600 text-xs truncate max-w-[140px]">
                              {ia.instructional_area}
                            </span>
                            <span
                              className={`text-xs font-bold ${
                                pct >= 80
                                  ? "text-green-600"
                                  : pct >= 60
                                  ? "text-yellow-600"
                                  : "text-red-500"
                              }`}
                            >
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                pct >= 80
                                  ? "bg-green-500"
                                  : pct >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-900 font-bold mb-2">Performance by Area</h3>
                <p className="text-gray-400 text-sm">
                  Complete a practice session to see your breakdown.
                </p>
              </div>
            )}

            {/* Weakest PIs */}
            {stats.weakestPIs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-900 font-bold mb-1">Focus Areas</h3>
                <p className="text-gray-400 text-xs mb-3">PIs where you struggle most</p>
                <div className="space-y-2">
                  {stats.weakestPIs.map((pi) => (
                    <div
                      key={pi.pi_code}
                      className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-3 py-2"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-red-700">
                          {pi.pi_code}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {pi.attempts} attempts
                        </span>
                      </div>
                      <span className="text-xs font-bold text-red-600">
                        {pi.accuracy_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent sessions */}
            {stats.sessions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-gray-900 font-bold mb-3">Recent Sessions</h3>
                <div className="space-y-2">
                  {stats.sessions.map((session) => {
                    const pct = Number(session.score_pct);
                    const date = new Date(session.completed_at!).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="text-gray-700 font-medium">
                            {session.total_questions}Q
                          </span>
                          {session.filter_ia && (
                            <span className="text-gray-400 text-xs ml-1">
                              · {session.filter_ia}
                            </span>
                          )}
                          <span className="text-gray-400 text-xs ml-2">{date}</span>
                        </div>
                        <span
                          className={`font-bold ${
                            pct >= 80
                              ? "text-green-600"
                              : pct >= 60
                              ? "text-yellow-600"
                              : "text-red-500"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Start tip */}
            {!hasActivity && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="font-semibold text-blue-900 text-sm">💡 Study tip</p>
                <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                  After each question, tap{" "}
                  <strong>Get AI Coaching</strong> to understand exactly why you
                  got it right or wrong.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-gray-500 text-xs mt-1">{label}</div>
    </div>
  );
}

function CategoryCard({
  cat,
  comingSoon,
}: {
  cat: (typeof EXAM_CATEGORIES)[number];
  comingSoon?: boolean;
}) {
  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 ${cat.iconBg} rounded-xl flex items-center justify-center text-xl shadow-sm`}
        >
          {cat.icon}
        </div>
        {comingSoon && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="text-gray-900 font-bold text-base mb-1">{cat.title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed mb-3">{cat.desc}</p>
      <div className="flex flex-wrap gap-1">
        {cat.events.map((e) => (
          <span
            key={e}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold"
          >
            {e}
          </span>
        ))}
      </div>
      {cat.available && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">100 questions</span>
          <span className="text-blue-600 font-bold">Start →</span>
        </div>
      )}
    </>
  );
}

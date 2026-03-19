import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { examQuestions } from "@/data/examQuestions";

const EXAM_CATEGORIES = [
  {
    id: "business-admin",
    title: "Business Admin Core",
    desc: "Business law, communications, customer relations, economics, and operations management.",
    icon: "🏢",
    color: "from-blue-600 to-blue-700",
    iconBg: "bg-blue-500",
    events: ["PEN", "PBM", "PFN", "PHT", "PMK"],
    available: true,
  },
  {
    id: "marketing",
    title: "Marketing",
    desc: "Marketing concepts, market research, advertising, branding, and consumer behavior.",
    icon: "📢",
    color: "from-teal-600 to-teal-700",
    iconBg: "bg-teal-500",
    events: ["PMK"],
    available: false,
  },
  {
    id: "finance",
    title: "Finance",
    desc: "Financial analysis, investments, banking, and financial management principles.",
    icon: "💰",
    color: "from-orange-600 to-orange-700",
    iconBg: "bg-orange-500",
    events: ["PFN"],
    available: false,
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    desc: "Starting a business, innovation, risk management, and entrepreneurial mindset.",
    icon: "💡",
    color: "from-red-600 to-red-700",
    iconBg: "bg-red-500",
    events: ["PEN"],
    available: false,
  },
  {
    id: "hospitality",
    title: "Hospitality & Tourism",
    desc: "Hotel operations, tourism, food service, event planning, and hospitality management.",
    icon: "🍽️",
    color: "from-emerald-600 to-emerald-700",
    iconBg: "bg-emerald-500",
    events: ["PHT"],
    available: false,
  },
  {
    id: "management",
    title: "Management",
    desc: "Leadership, human resources, organizational behavior, and strategic planning.",
    icon: "👥",
    color: "from-yellow-600 to-yellow-700",
    iconBg: "bg-yellow-500",
    events: ["PBM"],
    available: false,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Student";
  const totalQuestions = examQuestions.length;

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

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hey {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Ready to crush your DECA exam? Pick a category below to start practicing.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Questions Available", value: totalQuestions, color: "text-blue-600" },
            { label: "Instructional Areas", value: 13, color: "text-teal-600" },
            { label: "Events Covered", value: 5, color: "text-orange-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Choose Your Exam Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <Link href={`/quiz/${cat.id}`} className="block p-6">
                  <CategoryCard cat={cat} />
                </Link>
              ) : (
                <div className="p-6">
                  <CategoryCard cat={cat} comingSoon />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4 items-start">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-blue-900">Study tip</p>
            <p className="text-blue-700 text-sm mt-1">
              Start with Business Admin Core — it covers all 5 Principles events (PEN, PBM, PFN, PHT, PMK).
              After each question, use the AI Coach to understand exactly why you got it right or wrong.
            </p>
          </div>
        </div>
      </main>
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
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 ${cat.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-sm`}
        >
          {cat.icon}
        </div>
        {comingSoon && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
            Coming soon
          </span>
        )}
      </div>

      <h3 className="text-gray-900 font-bold text-lg mb-2">{cat.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{cat.desc}</p>

      <div className="flex flex-wrap gap-1.5">
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
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">100 questions ready</span>
            <span className="text-blue-600 font-semibold">Start →</span>
          </div>
        </div>
      )}
    </>
  );
}

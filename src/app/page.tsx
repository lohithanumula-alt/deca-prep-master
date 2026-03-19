import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 bg-[#0a1628]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span className="font-bold text-lg">
            <span className="text-white">DECA</span>{" "}
            <span className="text-blue-400">Prep Master</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white text-sm transition-colors">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-[#0a1628]/75" />

        {/* Yellow accent bars */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-yellow-400" />
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-yellow-400" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-72px)] text-center px-6 py-24">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 drop-shadow-lg">
            Welcome
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-xl border-2 border-blue-400 min-w-[280px]"
            >
              Login to Your Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl text-base transition-all"
            >
              Create an Account
            </Link>
            <Link
              href="#features"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl text-base transition-all"
            >
              Explore Study Resources
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-3">
          Everything you need to ace DECA
        </h2>
        <p className="text-gray-400 text-center mb-12">
          AI-powered coaching for all 5 Principles events
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "100 Real Exam Questions",
              desc: "Practice with actual DECA BA Core Test 1321 questions, sorted by instructional area and difficulty.",
            },
            {
              icon: "🤖",
              title: "AI Coaching",
              desc: "Get instant, detailed breakdowns of every answer — why you were right or wrong, plus memory tips.",
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              desc: "Your results are saved to your account. See exactly which areas need the most work.",
            },
            {
              icon: "🏆",
              title: "PEN · PBM · PFN · PHT · PMK",
              desc: "Covers all 5 DECA Principles events with Performance Indicator tracking.",
            },
            {
              icon: "⚡",
              title: "Smart Filtering",
              desc: "Filter by difficulty (PQ / CS / SP) and instructional area to focus your study sessions.",
            },
            {
              icon: "🔐",
              title: "Secure Accounts",
              desc: "Your progress is saved to the cloud — access it from any device, anytime.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-16 border-t border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to start?</h2>
        <p className="text-gray-400 mb-8">Free to use. No credit card required.</p>
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all inline-block"
        >
          Create Your Free Account
        </Link>
      </div>

      <footer className="text-center py-6 text-gray-600 text-sm border-t border-white/5">
        DECA Prep Master · Not affiliated with DECA Inc.
      </footer>
    </div>
  );
}

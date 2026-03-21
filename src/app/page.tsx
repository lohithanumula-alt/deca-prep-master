"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  const bg = isDark ? "bg-[#0d1117]" : "bg-[#faf8f4]";
  const text = isDark ? "text-white" : "text-gray-900";
  const sub = isDark ? "text-gray-400" : "text-gray-500";
  const navBg = isDark ? "bg-[#0d1117]/95 border-white/10" : "bg-white/95 border-gray-200";
  const sectionBg = isDark ? "bg-[#111827]" : "bg-gray-100";
  const cardBorder = isDark ? "border-white/10" : "border-gray-200";
  const inputBg = isDark ? "bg-white/10 border-white/20 text-white placeholder-gray-500" : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400";
  const footerBg = isDark ? "bg-[#080d14]" : "bg-gray-900";

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>

      {/* ── NAV ── */}
      <nav className={`sticky top-0 z-50 ${navBg} backdrop-blur-md border-b px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-bold text-lg">
              DECA <span className="text-blue-500">Prep Master</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm">
            <Link href="/quiz/marketing" className={`${sub} hover:text-blue-500 transition-colors`}>Practice</Link>
            <Link href="/dashboard" className={`${sub} hover:text-blue-500 transition-colors`}>Dashboard</Link>
            <Link href="/login" className={`${sub} hover:text-blue-500 transition-colors`}>Login</Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${cardBorder} transition-colors ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-600/20">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col md:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Free for all DECA competitors
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Master the DECA Core:<br />
            <span className="text-blue-500">Prep Smarter,</span><br />
            Score Higher.
          </h1>
          <p className={`text-lg ${sub} mb-8 leading-relaxed`}>
            Your digital study partner for the DECA Business Administration Core Exam. Practice, track progress, and get personalized AI coaching.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-blue-600/30">
              Start Free →
            </Link>
            <Link href="/login" className={`inline-flex items-center gap-2 border ${cardBorder} ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"} font-semibold px-7 py-3.5 rounded-xl text-base transition-all`}>
              Login
            </Link>
          </div>
        </div>

        {/* Right — laptop mockup */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-lg">
            {/* Screen */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-gray-700 rounded text-gray-400 text-xs px-3 py-1 ml-2">
                  deca-coach.vercel.app/dashboard
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="bg-[#0d1117] p-4">
                <div className="flex gap-3 mb-3">
                  {[["321", "Questions"], ["650", "XP"], ["86%", "Accuracy"], ["90%", "Score"]].map(([v, l]) => (
                    <div key={l} className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-blue-400 font-bold text-sm">{v}</div>
                      <div className="text-gray-500 text-xs">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mb-2 font-medium">Top Categories</div>
                {[["Marketing", 82], ["Finance", 74], ["Entrepreneurship", 68], ["Management", 91]].map(([cat, pct]) => (
                  <div key={cat} className="flex items-center gap-2 mb-1.5">
                    <div className="text-gray-400 text-xs w-28 truncate">{cat}</div>
                    <div className="flex-1 bg-white/10 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-gray-400 text-xs w-8 text-right">{pct}%</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Laptop stand */}
            <div className="h-3 bg-gray-700 mx-8 rounded-b-lg" />
            <div className="h-1.5 bg-gray-600 mx-16 rounded-b-lg" />
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: "100+ Exam-Style Quizzes",
              desc: "Practice by category and performance indicator with real DECA BA Core exam questions.",
            },
            {
              icon: (
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: "AI-Powered Coaching",
              desc: "Get instant, detailed feedback, real-world examples, and new practice questions after every answer.",
            },
            {
              icon: (
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Real-Time Analytics Dashboard",
              desc: "Identify weak points, track progress, and build confidence with detailed performance tracking.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-[#1a2035] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRACK YOUR PERFORMANCE ── */}
      <section className={`${sectionBg} py-20 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className={`text-4xl font-extrabold mb-4 ${text}`}>Track Your Performance</h2>
            <p className={`${sub} text-lg leading-relaxed mb-6`}>
              Identify your weakest instructional areas, monitor accuracy by category, and stay on track to hit your target score for the exam.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              See Your Dashboard →
            </Link>
          </div>
          <div className="flex-1">
            <div className="bg-[#1a2035] rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-white font-bold text-lg">Track Your Performance</div>
                  <div className="text-gray-400 text-sm">Updated after every session</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-bold text-3xl">88%</div>
                  <div className="text-gray-400 text-xs">Avg Accuracy</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-3 font-medium">Weakest Areas</div>
              {[["Economics", 54], ["Financial Analysis", 61], ["Operations", 67], ["Communications", 72]].map(([cat, pct]) => (
                <div key={cat} className="flex items-center gap-3 mb-2.5">
                  <div className="text-gray-300 text-xs w-36 truncate">{cat}</div>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-gray-400 text-xs w-8 text-right">{pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className={`text-4xl font-extrabold text-center mb-3 ${text}`}>How it Works</h2>
        <p className={`${sub} text-center mb-14`}>Get from zero to exam-ready in three simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-blue-500/30" />
          {[
            {
              step: "1",
              icon: (
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h8" />
                </svg>
              ),
              title: "Choose a Category",
              desc: "Pick the category and performance indicators you want to drill — Marketing, Finance, Entrepreneurship, and more.",
            },
            {
              step: "2",
              icon: (
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
              title: "Take a Quiz",
              desc: "Answer timed, exam-style questions and get instant results on every question you attempt.",
            },
            {
              step: "3",
              icon: (
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "Get AI Feedback",
              desc: "Identify weak points, get real-world explanations, and build confidence for the actual DECA exam.",
            },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 relative">
                {s.icon}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${text}`}>{s.title}</h3>
              <p className={`${sub} text-sm leading-relaxed max-w-xs`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={`${sectionBg} py-20 px-6`}>
        <h2 className={`text-4xl font-extrabold text-center mb-2 ${text}`}>User Testimonials</h2>
        <p className={`${sub} text-center mb-12`}>From real DECA competitors</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "The AI coaching explained every question I got wrong. I went from 65% to 90% accuracy in one week.", name: "Marcus T.", role: "DECA State Finalist" },
            { quote: "This is the only DECA prep tool that actually explains the WHY behind each answer. Total game changer.", name: "Priya K.", role: "DECA Competitor" },
            { quote: "I used this every night before States. The practice questions are spot on to the real exam.", name: "Jordan M.", role: "DECA State Qualifier" },
          ].map((t) => (
            <div key={t.name} className={`${isDark ? "bg-[#1a2035] border-white/10" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
              <p className={`${sub} text-sm leading-relaxed mb-4`}>&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className={`${text} font-semibold text-sm`}>{t.name}</div>
                  <div className={`${sub} text-xs`}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className={`text-4xl font-extrabold mb-4 ${text}`}>Ready to start?</h2>
        <p className={`${sub} text-lg mb-8`}>Free forever. No credit card needed.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-xl shadow-blue-600/30">
          Create Your Free Account →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`${footerBg} text-gray-400 py-12 px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="text-gray-300 font-semibold text-sm mb-3">Links</div>
            {["About", "Practice", "Dashboard", "Privacy Policy", "Contact"].map(l => (
              <div key={l} className="text-gray-500 text-sm mb-1.5 hover:text-gray-300 cursor-pointer">{l}</div>
            ))}
          </div>
          <div>
            <div className="text-gray-300 font-semibold text-sm mb-3">Company</div>
            {["Coach", "Contact", "Pricing", "Team"].map(l => (
              <div key={l} className="text-gray-500 text-sm mb-1.5 hover:text-gray-300 cursor-pointer">{l}</div>
            ))}
          </div>
          <div>
            <div className="text-gray-300 font-semibold text-sm mb-3">Newsletter Signup</div>
            <div className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="Enter email..."
                className={`flex-1 text-xs px-3 py-2 rounded-lg border ${inputBg} focus:outline-none`}
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-lg transition-colors">→</button>
            </div>
          </div>
          <div>
            <div className="text-gray-300 font-semibold text-sm mb-3">About Us</div>
            <p className="text-gray-500 text-xs leading-relaxed">
              DECA Prep Master is a free study platform for high school students competing in DECA&apos;s Business Administration Core exam events.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-gray-300 text-xs font-bold">DECA Prep Master</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-gray-600 text-xs">Copyright © 2026 DECA Prep Master. All Rights Reserved.</div>
          <div className="text-gray-600 text-xs">Not affiliated with DECA Inc.</div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  BookOpen,
  Brain,
  BarChart3,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger: Variants = { show: { transition: { staggerChildren: 0.12 } } };

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  const bg = isDark ? "bg-[#080c14]" : "bg-[#f7f5f0]";
  const text = isDark ? "text-white" : "text-gray-900";
  const sub = isDark ? "text-gray-400" : "text-gray-500";
  const navBg = isDark
    ? "bg-[#080c14]/90 border-white/8"
    : "bg-white/90 border-gray-200";
  const cardBg = isDark ? "bg-[#111827]" : "bg-white";
  const cardBorder = isDark ? "border-white/8" : "border-gray-200";
  const sectionBg = isDark ? "bg-[#0d1117]" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>

      {/* ── NAV ── */}
      <nav className={`sticky top-0 z-50 ${navBg} backdrop-blur-xl border-b px-6 py-3.5`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className={`font-[family-name:var(--font-syne)] font-bold text-lg tracking-tight ${text}`}>
              DECA <span className="text-blue-500">Coach</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[["Practice", "/quiz/marketing"], ["Dashboard", "/dashboard"], ["Login", "/login"]].map(([label, href]) => (
              <Link key={label} href={href} className={`${sub} hover:text-blue-400 transition-colors`}>{label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border ${cardBorder} transition-all ${isDark ? "bg-white/8 hover:bg-white/15" : "bg-gray-100 hover:bg-gray-200"}`}
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-gray-500" />
              }
            </button>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/25"
            >
              Start Free <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <motion.div
            className="flex-1 max-w-2xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <Badge className="bg-blue-600/15 text-blue-400 border border-blue-500/25 hover:bg-blue-600/15 text-xs font-semibold px-3 py-1.5 rounded-full gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                Free for all DECA competitors
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={`font-[family-name:var(--font-syne)] text-5xl lg:text-[3.75rem] font-extrabold leading-[1.08] tracking-tight mb-6 ${text}`}
            >
              Master the DECA
              <br />
              Core Exam with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                AI Coaching
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className={`text-lg ${sub} mb-8 leading-relaxed max-w-lg`}>
              Your AI-powered study partner for the DECA Business Administration Core Exam. Practice questions, instant feedback, and personalized coaching after every answer.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                Start Studying Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 border ${cardBorder} ${isDark ? "hover:bg-white/8" : "hover:bg-gray-100"} font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5`}
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className={`flex items-center gap-6 text-sm ${sub}`}>
              {["No credit card", "All 5 DECA events", "Instant AI feedback"].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — App preview card */}
          <motion.div
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={`${cardBg} border ${cardBorder} rounded-2xl shadow-2xl overflow-hidden`}>
              {/* Mock browser bar */}
              <div className={`${isDark ? "bg-[#0d1117]" : "bg-gray-100"} px-4 py-3 flex items-center gap-2 border-b ${cardBorder}`}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className={`flex-1 ${isDark ? "bg-white/8" : "bg-white"} rounded text-xs px-3 py-1 ml-1 ${sub} font-mono`}>
                  deca-coach.vercel.app/quiz
                </div>
              </div>
              {/* Quiz preview */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-600/15 text-blue-400 border-blue-500/25 text-xs">Marketing — PIM</Badge>
                  <span className={`text-xs ${sub}`}>Q 7 / 20</span>
                </div>
                <p className={`text-sm font-medium ${text} mb-4 leading-relaxed`}>
                  Which pricing strategy sets a price below competitors to rapidly gain market share?
                </p>
                <div className="space-y-2">
                  {[
                    { label: "A", text: "Skimming pricing", correct: false },
                    { label: "B", text: "Penetration pricing", correct: true },
                    { label: "C", text: "Bundle pricing", correct: false },
                    { label: "D", text: "Premium pricing", correct: false },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        opt.correct
                          ? "bg-green-500/15 border-green-500/40 text-green-400"
                          : `${isDark ? "border-white/8 text-gray-400" : "border-gray-200 text-gray-500"}`
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${opt.correct ? "bg-green-500 text-white" : isDark ? "bg-white/8" : "bg-gray-100"}`}>
                        {opt.label}
                      </span>
                      {opt.text}
                      {opt.correct && <CheckCircle2 className="w-4 h-4 ml-auto text-green-400" />}
                    </div>
                  ))}
                </div>
                <div className={`mt-4 p-3 rounded-lg ${isDark ? "bg-blue-600/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-xs font-semibold">AI Coach</span>
                  </div>
                  <p className={`text-xs ${sub} leading-relaxed`}>
                    Penetration pricing enters the market at a low price to attract customers quickly…
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-blue-400" />,
              color: "blue",
              title: "100+ Exam-Style Questions",
              desc: "Curated DECA BA Core questions organised by PI code and instructional area.",
            },
            {
              icon: <Brain className="w-6 h-6 text-purple-400" />,
              color: "purple",
              title: "AI-Powered Coaching",
              desc: "Get instant breakdowns, real-world examples, and new practice questions after every answer.",
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-green-400" />,
              color: "green",
              title: "Real-Time Analytics",
              desc: "Track weak spots, monitor accuracy by category, and stay on course for your target score.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className={`${cardBg} border ${cardBorder} rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:-translate-y-1 group`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-${f.color}-500/10 border border-${f.color}-500/20`}>
                {f.icon}
              </div>
              <h3 className={`font-[family-name:var(--font-syne)] font-bold text-base mb-2 ${text}`}>{f.title}</h3>
              <p className={`text-sm ${sub} leading-relaxed`}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── STATS BAND ── */}
      <section className={`${sectionBg} border-y ${cardBorder} py-14 px-6`}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500+", label: "Questions" },
            { value: "5", label: "DECA Events" },
            { value: "90%", label: "Avg Score Gain" },
            { value: "Free", label: "Forever" },
          ].map((s) => (
            <div key={s.label}>
              <div className={`font-[family-name:var(--font-syne)] text-3xl font-extrabold text-blue-400 mb-1`}>{s.value}</div>
              <div className={`text-sm ${sub}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className={`text-sm font-semibold uppercase tracking-widest text-blue-500 mb-3`}>How it works</motion.p>
          <motion.h2 variants={fadeUp} className={`font-[family-name:var(--font-syne)] text-4xl font-extrabold ${text}`}>
            From zero to exam-ready
            <br />in three steps
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            {
              step: "01",
              icon: <Target className="w-7 h-7 text-blue-400" />,
              title: "Choose a Category",
              desc: "Pick the DECA event and instructional area you want to drill — Marketing, Finance, Entrepreneurship, and more.",
            },
            {
              step: "02",
              icon: <BookOpen className="w-7 h-7 text-purple-400" />,
              title: "Answer Questions",
              desc: "Tackle exam-style, multiple-choice questions and get instant right/wrong feedback on every attempt.",
            },
            {
              step: "03",
              icon: <TrendingUp className="w-7 h-7 text-green-400" />,
              title: "Get AI Feedback",
              desc: "Receive personalised coaching, real-world examples, and follow-up practice questions from your AI coach.",
            },
          ].map((s, i) => (
            <motion.div key={s.step} variants={fadeUp} className="relative flex flex-col items-center text-center">
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-0 h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
              )}
              <div className={`w-16 h-16 ${cardBg} border ${cardBorder} rounded-2xl flex items-center justify-center mb-5 shadow-sm relative`}>
                {s.icon}
                <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center font-[family-name:var(--font-syne)]">
                  {i + 1}
                </span>
              </div>
              <div className={`text-xs font-bold tracking-widest text-blue-500 mb-1`}>{s.step}</div>
              <h3 className={`font-[family-name:var(--font-syne)] font-bold text-lg mb-2 ${text}`}>{s.title}</h3>
              <p className={`text-sm ${sub} leading-relaxed max-w-xs`}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={`${sectionBg} border-y ${cardBorder} py-20 px-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500 mb-3">Testimonials</p>
            <h2 className={`font-[family-name:var(--font-syne)] text-4xl font-extrabold ${text}`}>
              What DECA students say
            </h2>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { quote: "The AI coaching explained every question I got wrong. I went from 65% to 90% accuracy in one week.", name: "Marcus T.", role: "DECA State Finalist" },
              { quote: "This is the only DECA prep tool that actually explains the WHY behind each answer. Total game changer.", name: "Priya K.", role: "DECA Competitor" },
              { quote: "I used this every night before States. The practice questions are spot on to the real exam format.", name: "Jordan M.", role: "DECA State Qualifier" },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp} className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className={`${sub} text-sm leading-relaxed mb-5`}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className={`${text} font-semibold text-sm`}>{t.name}</div>
                    <div className={`${sub} text-xs`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500 mb-4">Get Started</p>
          <h2 className={`font-[family-name:var(--font-syne)] text-5xl font-extrabold mb-4 ${text}`}>
            Ready to ace
            <br />your DECA exam?
          </h2>
          <p className={`${sub} text-lg mb-10`}>Free forever. No credit card needed. Start in 30 seconds.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-2xl shadow-blue-600/30 hover:-translate-y-1 hover:shadow-blue-600/40"
          >
            Create Your Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`${isDark ? "bg-[#060a11]" : "bg-gray-900"} text-gray-400 py-14 px-6 border-t border-white/5`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-[family-name:var(--font-syne)] font-bold text-white">DECA Coach</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Free AI-powered exam prep for DECA Business Administration Core events — PEN, PBM, PFN, PHT, and PMK.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <div className="text-gray-300 font-semibold text-sm mb-3">Product</div>
                {["Practice", "Dashboard", "Pricing", "About"].map(l => (
                  <div key={l} className="text-gray-500 text-sm mb-2 hover:text-gray-300 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
              <div>
                <div className="text-gray-300 font-semibold text-sm mb-3">Account</div>
                {["Sign In", "Sign Up", "Privacy Policy", "Contact"].map(l => (
                  <div key={l} className="text-gray-500 text-sm mb-2 hover:text-gray-300 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-gray-600 text-xs">© 2026 DECA Coach. All rights reserved.</div>
            <div className="text-gray-600 text-xs">Not affiliated with DECA Inc.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

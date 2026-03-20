"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("NEXT_REDIRECT")) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white">
              DECA <span className="text-blue-400">Prep Master</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-2">Free forever. No credit card needed.</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full name
              </label>
              <input
                name="full_name"
                type="text"
                required
                placeholder="Alex Johnson"
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="At least 6 characters"
                minLength={6}
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-base"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

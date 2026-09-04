"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  // If already authenticated, redirect
  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Small delay for UX feel
    setTimeout(() => {
      const success = login(password);
      if (success) {
        router.replace("/admin");
      } else {
        setError("Invalid password. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center px-4">
      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #A16207 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          {/* Crown icon */}
          <svg
            width="28"
            height="20"
            viewBox="0 0 20 14"
            fill="none"
            className="mx-auto mb-3 text-[#D4A853]"
          >
            <path
              d="M1 12L4 4L7 8L10 1L13 8L16 4L19 12H1Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="4" cy="3.5" r="1" fill="currentColor" />
            <circle cx="10" cy="0.5" r="1" fill="currentColor" />
            <circle cx="16" cy="3.5" r="1" fill="currentColor" />
          </svg>
          <h1 className="font-heading text-2xl font-semibold text-white tracking-wide">
            Radha Rani
          </h1>
          <p className="font-body text-[9px] tracking-[0.35em] uppercase text-[#D4A853] mt-0.5">
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="font-body text-sm font-medium text-white/80 mb-6 text-center">
            Enter your admin password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block font-body text-[11px] uppercase tracking-[0.15em] text-white/40 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 font-body text-sm text-white placeholder:text-white/20 outline-none focus:border-[#A16207]/50 focus:ring-1 focus:ring-[#A16207]/20 transition-all duration-200"
              />
            </div>

            {error && (
              <p className="font-body text-xs text-red-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A16207] hover:bg-[#7C4D05] disabled:opacity-50 text-white font-body text-sm uppercase tracking-widest py-3.5 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-[10px] text-white/20 mt-6">
          Protected area · Unauthorized access prohibited
        </p>
      </div>
    </div>
  );
}

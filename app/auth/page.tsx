"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../lib/superbaseClient"

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();

  const initialMode = params.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  async function handleEmailAuth() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoadingEmail(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      router.push("/newday");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingEmail(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoadingGoogle(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/newday`,
        },
      });

      if (error) {
        throw error;
      }

      // User will be redirected to Google then back to /newday
    } catch (err: any) {
      alert("Google sign-in error: " + err.message);
      setLoadingGoogle(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-6 rounded-xl max-w-sm w-full border border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
          {mode === "login" ? "Welcome Back 👋" : "Create Your Account 🏋️‍♂️"}
        </h1>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-slate-700 rounded text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-slate-700 rounded text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Email auth button */}
        <button
          onClick={handleEmailAuth}
          disabled={loadingEmail}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded mb-3 disabled:opacity-60"
        >
          {loadingEmail
            ? "Please wait..."
            : mode === "login"
            ? "Login with Email"
            : "Sign Up with Email"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-slate-600" />
          <span className="px-2 text-xs text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-600" />
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded disabled:opacity-60"
        >
          {loadingGoogle ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}

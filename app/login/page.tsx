"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, Clock3, Mail, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!otpSent || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail.endsWith("@rvce.edu.in")) {
      setError("Please use a valid RVCE email ending with @rvce.edu.in.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email: cleanedEmail });
    if (error) {
      setError(error.message);
      return;
    }

    setEmail(cleanedEmail);
    setOtpSent(true);
    setTimeLeft(30);
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (otp.length !== 8 || !/^\d{8}$/.test(otp)) {
      setError("Please enter a valid 8-digit OTP.");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (error) {
      setError(error.message);
      return;
    }

    setVerified(true);
    
    // Fetch the user session
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      // Check if they already finished the onboarding wizard
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.user.id)
        .maybeSingle();

      setTimeout(() => {
        if (profile?.full_name) {
          router.push("/projects"); // Returning user
        } else {
          router.push("/onboarding"); // Brand new user
        }
      }, 1500);
    }
  };

  const resendOtp = async () => {
    setOtp("");
    setError("");
    setTimeLeft(30);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-700">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-950/5 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
              <Zap size={28} />
            </div>
            <h1 className="mt-5 text-3xl font-black text-blue-950">
              {verified ? "You’re verified!" : otpSent ? "Check your email" : "Welcome to Nexora"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {verified ? "Redirecting securely..." : otpSent ? `Enter the 8-digit OTP sent to ${email}.` : "Sign in using your RVCE college email to connect, create and collaborate."}
            </p>
          </div>

          {verified ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-emerald-50 p-5 text-center">
                <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
                <h2 className="mt-3 text-lg font-black text-emerald-900">Email verified</h2>
              </div>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">College email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@rvce.edu.in" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 caret-blue-700 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>
              </div>
              {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
              <div className="rounded-xl bg-blue-50 p-4 flex gap-3">
                <ShieldCheck className="shrink-0 text-blue-700" size={20} />
                <p className="text-xs leading-5 text-blue-900">Only RVCE college email addresses can continue.</p>
              </div>
              <button type="submit" className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-blue-800">
                Continue with email
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Enter OTP</label>
                <input type="text" inputMode="numeric" maxLength={8} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 8-digit OTP" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-center text-xl font-black text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
              </div>
              {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
              <button type="submit" className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-blue-800">
                Verify OTP
              </button>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock3 size={16} className="text-slate-400" />
                {timeLeft > 0 ? <span className="text-slate-500">Resend OTP in <span className="font-bold text-blue-700">{timeLeft}s</span></span> : <button type="button" onClick={resendOtp} className="font-bold text-blue-700 hover:text-blue-900">Resend OTP</button>}
              </div>
              <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }} className="w-full text-sm font-bold text-slate-500 hover:text-blue-700">Use a different email</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
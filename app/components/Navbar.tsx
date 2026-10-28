"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Zap, User, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Zap size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-950">Nexora</h1>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">CONNECT. CREATE. COLLABORATE.</p>
          </div>
        </Link>

        <div className="hidden items-center gap-10 text-lg font-semibold text-slate-700 md:flex">
          <Link href="/" className="transition hover:text-blue-600">Home</Link>
          <Link href="/projects" className="transition hover:text-blue-600">Explore Projects</Link>
          <Link href="/teammates" className="transition hover:text-blue-600">Find Teammates</Link>
          <Link href="/about" className="transition hover:text-blue-600">About</Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/profile" className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
                <User size={18} />
                My Profile
              </Link>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50 hover:border-red-200">
                <LogOut size={18} />
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-md transition hover:bg-blue-700">
              Get Started
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
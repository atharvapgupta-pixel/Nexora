"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, Code2, Grid2X2, Users } from "lucide-react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 -z-0 h-96 w-96 rounded-full bg-yellow-100/60 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <SparkleIcon /> Built for ambitious students
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight text-blue-950 sm:text-6xl lg:text-7xl">
              Turn your ideas into <span className="text-blue-700">real projects.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Nexora is a student collaboration platform where you can discover teammates, showcase projects, share skills and build something meaningful together.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={isLoggedIn ? "/projects" : "/login"} className="inline-flex items-center gap-3 rounded-xl bg-blue-700 px-6 py-4 font-black text-white shadow-lg transition hover:bg-blue-800">
                {isLoggedIn ? "Go to Projects" : "Explore Nexora"} <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-xl sm:p-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Your workspace</p>
                  <h2 className="mt-2 text-2xl font-black text-blue-950 sm:text-3xl">Project overview</h2>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700"><Grid2X2 size={28} /></div>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm font-bold text-blue-700">Projects</p><p className="mt-2 text-3xl font-black text-blue-950">12</p>
                </div>
                <div className="rounded-2xl bg-yellow-50 p-4">
                  <p className="text-sm font-bold text-yellow-700">Teammates</p><p className="mt-2 text-3xl font-black text-blue-950">48</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-sm font-bold text-slate-500">Skills</p><p className="mt-2 text-3xl font-black text-blue-950">24</p>
                </div>
              </div>
              <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white"><Code2 size={28} /></div>
                  <div><h3 className="text-lg font-black text-blue-950">Campus Connect</h3><p className="text-sm text-slate-500">Web Development</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" /><path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" />
    </svg>
  );
}
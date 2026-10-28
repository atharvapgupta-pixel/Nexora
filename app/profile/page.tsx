"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BookOpen, Calendar, Lightbulb, Mail, Zap } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" /></div>;
  
  if (!profile || !profile.full_name) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="mb-4 text-2xl font-black text-blue-950">Profile Incomplete</h2>
        <p className="mb-6 text-slate-600">Please complete the setup wizard to view your profile.</p>
        <button onClick={() => router.push("/onboarding")} className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800">Go to Setup</button>
      </div>
    );
  }

  const initials = profile.full_name ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "ST";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-700 text-3xl font-black text-white">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-blue-950">{profile.full_name}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${profile.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {profile.is_available ? 'Available for Teams' : 'Currently in a Team'}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2"><Mail size={16} /> {profile.email}</div>
                <div className="flex items-center gap-2"><BookOpen size={16} /> {profile.course}</div>
                <div className="flex items-center gap-2"><Calendar size={16} /> {profile.year}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700"><Zap size={20} /></div><h2 className="text-xl font-black text-blue-950">Skills</h2></div>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.skills?.length ? profile.skills.map((skill: string) => <span key={skill} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{skill}</span>) : <p className="text-sm text-slate-500">No skills added yet.</p>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Lightbulb size={20} /></div><h2 className="text-xl font-black text-blue-950">Project Interests</h2></div>
            <div className="mt-6">{profile.interests ? <p className="leading-7 text-slate-600">{profile.interests}</p> : <p className="text-sm text-slate-500">No specific interests provided.</p>}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
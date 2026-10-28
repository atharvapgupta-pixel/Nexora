"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, Plus, Sparkles } from "lucide-react";

const POPULAR_SKILLS = ["React", "Next.js", "Node.js", "C", "Python", "Cybersecurity", "IoT / ESP32", "UI/UX", "Hardware"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [interests, setInterests] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setUserEmail(data.user.email || "");
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const toggleSkill = (skill: string) => {
    setSkills(skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill]);
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const finishOnboarding = async () => {
    if (!userId) return;
    setLoading(true);
    
    const { error } = await supabase.from("profiles").upsert({
      id: userId, 
      email: userEmail,
      full_name: fullName, 
      course, 
      year, 
      skills, 
      interests, 
      is_available: isAvailable,
    });
    
    setLoading(false);

    if (error) {
      alert("Failed to save profile: " + error.message);
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div className="flex flex-col items-center rounded-3xl bg-white p-10 shadow-2xl animate-in zoom-in-95">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mt-6 text-3xl font-black text-blue-950">Saved Successfully!</h2>
          <p className="mt-2 text-slate-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition-colors ${step >= num ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > num ? <CheckCircle2 size={20} /> : num}
              </div>
              {num !== 3 && <div className={`h-1 w-24 mx-2 rounded-full ${step > num ? 'bg-blue-700' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div><h2 className="text-3xl font-black text-blue-950">Who are you?</h2><p className="mt-2 text-sm text-slate-600">Let teammates know your basics.</p></div>
              <div><label className="mb-2 block text-sm font-bold text-slate-700">Full Name</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Aarav Sharma" className="w-full rounded-xl border border-slate-300 py-3 px-4 outline-none focus:border-blue-700" /></div>
              <div><label className="mb-2 block text-sm font-bold text-slate-700">Course / Major</label><input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Computer Science and Engineering" className="w-full rounded-xl border border-slate-300 py-3 px-4 outline-none focus:border-blue-700" /></div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Current Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-xl border border-slate-300 py-3 px-4 outline-none focus:border-blue-700">
                  <option value="" disabled>Select your year</option><option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option><option value="3rd Year">3rd Year</option><option value="4th Year">4th Year</option>
                </select>
              </div>
              <button onClick={() => setStep(2)} disabled={!fullName || !course || !year} className="mt-6 w-full rounded-xl bg-blue-700 py-3.5 font-black text-white hover:bg-blue-800 disabled:opacity-50">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div><h2 className="text-3xl font-black text-blue-950">What can you do?</h2></div>
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700">Your Skills</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {POPULAR_SKILLS.map((skill) => (
                    <button key={skill} onClick={() => toggleSkill(skill)} className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${skills.includes(skill) ? 'bg-blue-700 text-white' : 'bg-slate-100'}`}>{skill}</button>
                  ))}
                  {skills.filter(s => !POPULAR_SKILLS.includes(s)).map(skill => (
                     <button key={skill} onClick={() => toggleSkill(skill)} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white">{skill}</button>
                  ))}
                </div>
                <form onSubmit={addCustomSkill} className="flex gap-2">
                  <input type="text" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} placeholder="Type a skill..." className="flex-1 rounded-xl border border-slate-300 py-2 px-4 text-sm outline-none focus:border-blue-700" />
                  <button type="submit" className="rounded-xl bg-slate-200 p-2"><Plus size={20} /></button>
                </form>
              </div>
              <div><label className="mb-2 text-sm font-bold text-slate-700">Project Interests</label><textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Optional interests..." className="h-24 w-full resize-none rounded-xl border border-slate-300 py-3 px-4 outline-none focus:border-blue-700" /></div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded-xl border border-slate-300 px-5 py-3.5 font-bold">Back</button>
                <button onClick={() => setStep(3)} disabled={skills.length === 0} className="flex-1 rounded-xl bg-blue-700 py-3.5 font-black text-white disabled:opacity-50">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div><h2 className="text-3xl font-black text-blue-950">Team Status</h2></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex justify-between">
                <div><p className="font-bold text-blue-950">Available for teams</p><p className="text-sm text-slate-500">Show my profile to users looking for teammates.</p></div>
                <button onClick={() => setIsAvailable(!isAvailable)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="rounded-xl border border-slate-300 px-5 py-3.5 font-bold">Back</button>
                <button onClick={finishOnboarding} disabled={loading} className="flex-1 rounded-xl bg-yellow-400 py-3.5 font-black text-blue-950">{loading ? "Saving..." : "Complete Profile"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
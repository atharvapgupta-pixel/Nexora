"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, Check, Clock, Search } from "lucide-react";

export default function TeammatesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [teammates, setTeammates] = useState<any[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTeammatesAndFriends = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || null;
    setUserId(currentUserId);

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .not("full_name", "is", null)
      .order("full_name", { ascending: true });

    if (profilesData) {
      setTeammates(
        currentUserId
          ? profilesData.filter((p) => p.id !== currentUserId)
          : profilesData
      );
    }

    if (currentUserId) {
      const { data: friendsData } = await supabase
        .from("friendships")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
      setFriendships(friendsData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTeammatesAndFriends();
  }, []);

  const handleProfileButton = () => {
    if (userId) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  const handleConnect = async (receiverId: string) => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const existing = friendships.find(
      (f) =>
        (f.sender_id === userId && f.receiver_id === receiverId) ||
        (f.sender_id === receiverId && f.receiver_id === userId)
    );

    if (existing) {
      router.push("/profile");
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      sender_id: userId,
      receiver_id: receiverId,
      status: "pending",
    });

    if (error) {
      alert("Could not send connection request: " + error.message);
      return;
    }

    await fetchTeammatesAndFriends();
    router.push("/teammates");
  };

  // Case-insensitive search across Name, Skill, or Course
  const filteredTeammates = teammates.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchName = t.full_name?.toLowerCase().includes(q);
    const matchCourse = t.course?.toLowerCase().includes(q);
    const matchSkills = (t.skills || []).some((skill: string) =>
      skill.toLowerCase().includes(q)
    );
    return matchName || matchCourse || matchSkills;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-blue-700">
                Build your team
              </p>

              <h1 className="text-4xl font-black tracking-tight text-blue-950 sm:text-5xl">
                Find your next teammate
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Discover students with different skills, interests and ideas.
                Find people who can help turn your project into reality.
              </p>
            </div>

            <button
              onClick={handleProfileButton}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-blue-950 transition hover:bg-yellow-300"
            >
              Create your profile
              <ArrowRight size={19} />
            </button>
          </div>

          {/* Search */}
          <div className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
            <Search size={22} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill or course..."
              className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-blue-950">
              Students looking for teammates
            </h2>
            <p className="mt-1 text-slate-500">
              Connect with students and explore possible collaborations.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            {filteredTeammates.length} profiles
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeammates.map((teammate) => {
              const initials = teammate.full_name
                ? teammate.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "ST";

              const relation = friendships.find(
                (f) =>
                  (f.sender_id === userId && f.receiver_id === teammate.id) ||
                  (f.sender_id === teammate.id && f.receiver_id === userId)
              );

              return (
                <article
                  key={teammate.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                        teammate.avatar_color || "bg-blue-700"
                      } text-xl font-black text-white`}
                    >
                      {initials}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        teammate.is_available !== false
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {teammate.is_available !== false ? "Available" : "In a Team"}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-blue-950">
                    {teammate.full_name}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-blue-700">
                    {teammate.year || "Student"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {teammate.course}
                  </p>

                  <p className="mt-5 flex-1 leading-7 text-slate-600">
                    {teammate.bio ||
                      teammate.interests ||
                      "Interested in collaborating on innovative student projects."}
                  </p>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-black text-slate-700">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(teammate.skills || []).map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-yellow-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">
                      Looking for
                    </p>
                    <p className="mt-1 text-sm font-bold text-blue-950">
                      {teammate.looking_for ||
                        teammate.interests ||
                        "Project collaboration"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleConnect(teammate.id)}
                    className={`mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 font-black transition ${
                      relation?.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : relation?.status === "pending"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                  >
                    {relation?.status === "accepted" ? (
                      <>
                        Friends <Check size={17} />
                      </>
                    ) : relation?.status === "pending" ? (
                      <>
                        {relation.sender_id === userId
                          ? "Request Sent"
                          : "Respond in Profile"}{" "}
                        <Clock size={17} />
                      </>
                    ) : (
                      <>
                        Connect with {teammate.full_name.split(" ")[0]}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom Information */}
      <section className="border-t border-slate-200 bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 rounded-2xl bg-blue-950 p-8 text-white md:flex-row">
          <div>
            <h2 className="text-2xl font-black">Ready to find your team?</h2>
            <p className="mt-2 text-blue-100">
              Create your profile and let other students discover your skills.
            </p>
          </div>

          <button
            onClick={handleProfileButton}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-blue-950 hover:bg-yellow-300"
          >
            Join Nexora
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
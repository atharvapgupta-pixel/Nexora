"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  Lock,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

const POPULAR_PROJECT_SKILLS = [
  "React", "Next.js", "Node.js", "Python", "C", "C++", "Tailwind", "UI/UX", "IoT", "Cybersecurity", "Machine Learning", "Firebase"
];

export default function ProjectsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [myMemberships, setMyMemberships] = useState<any[]>([]);
  const [myCreatedCount, setMyCreatedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [isPublic, setIsPublic] = useState(true);
  const [updatesText, setUpdatesText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // View/Join Modal State
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const fetchProjectsAndUser = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || null;
    setUserId(currentUserId);

    // Fetch all public projects with creator info and accepted members
    const { data: projectsData } = await supabase
      .from("projects")
      .select(`
        *,
        creator:profiles!projects_creator_id_fkey(id, full_name, email),
        project_members(id, user_id, role, status, profile:profiles(full_name))
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (projectsData) {
      setProjects(projectsData);
    }

    if (currentUserId) {
      const { data: memberData } = await supabase
        .from("project_members")
        .select("*")
        .eq("user_id", currentUserId)
        .eq("status", "accepted");
      setMyMemberships(memberData || []);

      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", currentUserId);
      setMyCreatedCount(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProjectsAndUser();
  }, []);

  const handleOpenCreate = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (myCreatedCount >= 2) {
      alert("Limit Reached: You can only create a maximum of 2 projects.");
      return;
    }
    if (myMemberships.length >= 3) {
      alert("Limit Reached: You can only be part of 3 projects total (including created ones).");
      return;
    }
    setShowCreateModal(true);
  };

  const toggleSkill = (skill: string) => {
    setSkillsRequired(
      skillsRequired.includes(skill)
        ? skillsRequired.filter((s) => s !== skill)
        : [...skillsRequired, skill]
    );
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skillsRequired.includes(customSkill.trim())) {
      setSkillsRequired([...skillsRequired, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (skillsRequired.length === 0) {
      alert("Please select at least one required skill.");
      return;
    }

    setSubmitting(true);

    // 1. Insert Project
    const { data: newProject, error: projectError } = await supabase
      .from("projects")
      .insert({
        creator_id: userId,
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        skills_required: skillsRequired,
        max_members: Number(maxMembers),
        is_public: isPublic,
        updates_text: updatesText.trim(),
        color_class: "bg-blue-100 text-blue-700",
      })
      .select()
      .single();

    if (projectError || !newProject) {
      alert("Error creating project: " + projectError?.message);
      setSubmitting(false);
      return;
    }

    // 2. Add creator to project_members
    await supabase.from("project_members").insert({
      project_id: newProject.id,
      user_id: userId,
      role: "creator",
      status: "accepted",
    });

    // Reset form & refresh Explore Projects page
    setTitle("");
    setDescription("");
    setSkillsRequired([]);
    setMaxMembers(4);
    setIsPublic(true);
    setUpdatesText("");
    setSubmitting(false);
    setShowCreateModal(false);

    await fetchProjectsAndUser();
    router.push("/projects");
  };

  const handleJoinProject = async (project: any) => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const acceptedMembers = (project.project_members || []).filter(
      (m: any) => m.status === "accepted"
    );

    const alreadyInProject = acceptedMembers.some((m: any) => m.user_id === userId);
    if (alreadyInProject) {
      alert("You are already a member of this project!");
      return;
    }

    if (acceptedMembers.length >= project.max_members) {
      alert("This project is already full.");
      return;
    }

    if (myMemberships.length >= 3) {
      alert("Limit Reached: You can only join up to 3 projects total (including created ones).");
      return;
    }

    const { error } = await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: userId,
      role: "member",
      status: "accepted",
    });

    if (error) {
      alert("Could not join project: " + error.message);
      return;
    }

    setSelectedProject(null);
    await fetchProjectsAndUser();
    router.push("/projects");
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchTitle = p.title?.toLowerCase().includes(q);
    const matchCategory = p.category?.toLowerCase().includes(q);
    const matchDesc = p.description?.toLowerCase().includes(q);
    const matchSkills = (p.skills_required || []).some((s: string) =>
      s.toLowerCase().includes(q)
    );
    return matchTitle || matchCategory || matchDesc || matchSkills;
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
                Discover and collaborate
              </p>

              <h2 className="text-4xl font-black tracking-tight text-blue-950 sm:text-5xl">
                Explore student projects
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Find interesting ideas, discover new technologies and connect
                with students who are building something exciting.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-blue-950 transition hover:bg-yellow-300"
            >
              Start a project
              <ArrowRight size={19} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
            <Search size={22} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, technologies or interests..."
              className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-blue-950">
              Featured projects
            </h3>
            <p className="mt-1 text-slate-500">
              Explore public ideas created by students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userId && (
              <span className="rounded-full bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700">
                Created: {myCreatedCount}/2 • Joined: {myMemberships.length}/3
              </span>
            )}
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              {filteredProjects.length} projects
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const acceptedMembers = (project.project_members || []).filter(
                (m: any) => m.status === "accepted"
              );
              const isMember = acceptedMembers.some((m: any) => m.user_id === userId);
              const isFull = acceptedMembers.length >= project.max_members;

              return (
                <article
                  key={project.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Icon and Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        project.color_class || "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <Layers size={25} />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isMember
                          ? "bg-blue-100 text-blue-700"
                          : isFull
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isMember ? "Joined" : isFull ? "Full" : "Open"}
                    </span>
                  </div>

                  {/* Project Information */}
                  <p className="mt-6 text-sm font-bold text-blue-700">
                    {project.category}
                  </p>

                  <h4 className="mt-2 text-2xl font-black text-blue-950">
                    {project.title}
                  </h4>

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    By {project.creator?.full_name || "Student Creator"}
                  </p>

                  <p className="mt-3 flex-1 leading-7 text-slate-600">
                    {project.description}
                  </p>

                  {/* Skills */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(project.skills_required || []).map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Users size={17} />
                      {acceptedMembers.length} / {project.max_members} members
                    </div>

                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex cursor-pointer items-center gap-2 font-black text-blue-700 hover:text-blue-900"
                    >
                      {isMember ? "View details" : "View project"}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-blue-950">Create a Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Project Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart Campus Tracker"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Web Development, AI/ML..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Max Members</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    required
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project goal and what teammates will build..."
                  className="h-24 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Skills Required</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {POPULAR_PROJECT_SKILLS.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        skillsRequired.includes(skill)
                          ? "bg-blue-700 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                  {skillsRequired
                    .filter((s) => !POPULAR_PROJECT_SKILLS.includes(s))
                    .map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="rounded-xl bg-blue-700 px-3 py-1.5 text-xs font-bold text-white"
                      >
                        {skill}
                      </button>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add custom skill..."
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="rounded-xl bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Update Space <span className="text-xs font-normal text-slate-400">(Optional - GitHub links, WhatsApp links, notes)</span>
                </label>
                <textarea
                  value={updatesText}
                  onChange={(e) => setUpdatesText(e.target.value)}
                  placeholder="Paste GitHub repo URL, WhatsApp group link, or instructions for members..."
                  className="h-20 w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-700"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-bold text-blue-950">
                    {isPublic ? "Public Project" : "Private Project"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isPublic
                      ? "Visible to everyone in Explore Projects"
                      : "Hidden from Explore Projects; only visible to invited members"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    isPublic ? "bg-blue-700" : "bg-slate-400"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      isPublic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-700 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW / JOIN PROJECT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  {selectedProject.category}
                </span>
                <h3 className="mt-1 text-2xl font-black text-blue-950">
                  {selectedProject.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Created by {selectedProject.creator?.full_name || "Student"}
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-5 leading-7 text-slate-600">
              {selectedProject.description}
            </p>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase text-slate-400">
                Skills Required
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.skills_required || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase text-slate-400">
                Current Teammates
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.project_members || [])
                  .filter((m: any) => m.status === "accepted")
                  .map((m: any) => (
                    <span
                      key={m.id}
                      className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"
                    >
                      {m.profile?.full_name || "Member"}{" "}
                      {m.role === "creator" ? "(Creator)" : ""}
                    </span>
                  ))}
              </div>
            </div>

            {selectedProject.updates_text && (
              <div className="mt-5 rounded-2xl bg-yellow-50 p-4">
                <p className="text-xs font-bold uppercase text-yellow-800">
                  Project Updates / Links
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {selectedProject.updates_text}
                </p>
              </div>
            )}

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
              >
                Close
              </button>
              {!(selectedProject.project_members || []).some(
                (m: any) => m.user_id === userId && m.status === "accepted"
              ) ? (
                <button
                  onClick={() => handleJoinProject(selectedProject)}
                  className="flex-1 rounded-xl bg-blue-700 py-3 text-sm font-black text-white hover:bg-blue-800"
                >
                  Join Project
                </button>
              ) : (
                <Link
                  href="/profile"
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-center text-sm font-black text-white hover:bg-emerald-700"
                >
                  Manage in My Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
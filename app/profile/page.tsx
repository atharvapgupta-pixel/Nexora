"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  Calendar,
  Check,
  Edit3,
  FolderGit2,
  Globe,
  Lightbulb,
  Lock,
  LogOut,
  Mail,
  Plus,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [projectInvites, setProjectInvites] = useState<any[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Project Editing & Teammate Invite State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUpdatesText, setEditUpdatesText] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [editMaxMembers, setEditMaxMembers] = useState(4);
  const [selectedInviteUser, setSelectedInviteUser] = useState<{ [key: string]: string }>({});

  const fetchProfileDashboard = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 1. Fetch User Profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileData || !profileData.full_name) {
      setLoading(false);
      return;
    }
    setProfile(profileData);

    // 2. Fetch User's Project Memberships & Invites
    const { data: memberRows } = await supabase
      .from("project_members")
      .select(`
        id,
        role,
        status,
        project_id,
        project:projects (
          *,
          creator:profiles!projects_creator_id_fkey(id, full_name, email),
          project_members (
            id,
            user_id,
            role,
            status,
            profile:profiles(id, full_name, email, course, year)
          )
        )
      `)
      .eq("user_id", user.id);

    if (memberRows) {
      setMyProjects(memberRows.filter((m: any) => m.status === "accepted" && m.project));
      setProjectInvites(memberRows.filter((m: any) => m.status === "invited" && m.project));
    }

    // 3. Fetch Friendships (Incoming, Outgoing, Accepted)
    const { data: friendRows } = await supabase
      .from("friendships")
      .select(`
        *,
        sender:profiles!friendships_sender_id_fkey(id, full_name, course, year, email),
        receiver:profiles!friendships_receiver_id_fkey(id, full_name, course, year, email)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    setFriendships(friendRows || []);

    // 4. Fetch All Students for Creator Teammate Invites
    const { data: studentsData } = await supabase
      .from("profiles")
      .select("id, full_name, course, year")
      .neq("id", user.id)
      .not("full_name", "is", null);

    setAllStudents(studentsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileDashboard();
  }, [router]);

  const toggleAvailability = async () => {
    if (!profile) return;
    const newStatus = !profile.is_available;
    await supabase
      .from("profiles")
      .update({ is_available: newStatus })
      .eq("id", profile.id);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  // PROJECT ACTIONS
  const startEditingProject = (proj: any) => {
    setEditingProjectId(proj.id);
    setEditTitle(proj.title);
    setEditDescription(proj.description);
    setEditUpdatesText(proj.updates_text || "");
    setEditIsPublic(proj.is_public);
    setEditMaxMembers(proj.max_members);
  };

  const handleSaveProjectUpdates = async (projectId: string) => {
    const { error } = await supabase
      .from("projects")
      .update({
        title: editTitle.trim(),
        description: editDescription.trim(),
        updates_text: editUpdatesText.trim(),
        is_public: editIsPublic,
        max_members: Number(editMaxMembers),
      })
      .eq("id", projectId);

    if (error) {
      alert("Error updating project: " + error.message);
      return;
    }
    setEditingProjectId(null);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleInviteTeammate = async (project: any) => {
    const targetUserId = selectedInviteUser[project.id];
    if (!targetUserId) {
      alert("Please select a student to invite.");
      return;
    }

    const acceptedCount = (project.project_members || []).filter(
      (m: any) => m.status === "accepted"
    ).length;

    if (acceptedCount >= project.max_members) {
      alert("Project is already at maximum member capacity.");
      return;
    }

    // Check if target is a sample user (starts with 00000000-) -> auto-accept sample users for instant testing, or set 'invited' for real users
    const isSampleUser = targetUserId.startsWith("00000000-");

    const { error } = await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: targetUserId,
      role: "member",
      status: isSampleUser ? "accepted" : "invited",
    });

    if (error) {
      alert("Student is already invited or in this project.");
      return;
    }

    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleRemoveTeammate = async (membershipId: string) => {
    await supabase.from("project_members").delete().eq("id", membershipId);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleLeaveProject = async (membershipId: string) => {
    await supabase.from("project_members").delete().eq("id", membershipId);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleDeleteProject = async (projectId: string) => {
    await supabase.from("projects").delete().eq("id", projectId);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleAcceptProjectInvite = async (inviteRow: any) => {
    if (myProjects.length >= 3) {
      alert("Limit Reached: You can only be part of 3 projects total.");
      return;
    }
    await supabase
      .from("project_members")
      .update({ status: "accepted" })
      .eq("id", inviteRow.id);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleRejectProjectInvite = async (inviteId: string) => {
    await supabase.from("project_members").delete().eq("id", inviteId);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  // FRIENDSHIP ACTIONS
  const handleAcceptFriend = async (friendshipId: string) => {
    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  const handleRemoveOrRejectFriend = async (friendshipId: string) => {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    await fetchProfileDashboard();
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    );
  }

  if (!profile || !profile.full_name) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="mb-4 text-2xl font-black text-blue-950">Profile Incomplete</h2>
        <p className="mb-6 text-slate-600">Please complete the setup wizard to view your profile.</p>
        <button
          onClick={() => router.push("/onboarding")}
          className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
        >
          Go to Setup
        </button>
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "ST";

  const incomingRequests = friendships.filter(
    (f) => f.receiver_id === profile.id && f.status === "pending"
  );
  const outgoingRequests = friendships.filter(
    (f) => f.sender_id === profile.id && f.status === "pending"
  );
  const acceptedFriends = friendships.filter((f) => f.status === "accepted");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-blue-700 text-3xl font-black text-white">
                {initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-blue-950">
                    {profile.full_name}
                  </h1>
                  <button
                    onClick={toggleAvailability}
                    title="Click to toggle availability"
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition ${
                      profile.is_available
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {profile.is_available
                      ? "Available for Teams"
                      : "Currently in a Team"}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} /> {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} /> {profile.course}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> {profile.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Project Interests Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <Zap size={20} />
              </div>
              <h2 className="text-xl font-black text-blue-950">Skills</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.skills?.length ? (
                profile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No skills added yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Lightbulb size={20} />
              </div>
              <h2 className="text-xl font-black text-blue-950">
                Project Interests
              </h2>
            </div>
            <div className="mt-6">
              {profile.interests ? (
                <p className="leading-7 text-slate-600">{profile.interests}</p>
              ) : (
                <p className="text-sm text-slate-500">
                  No specific interests provided.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MY PROJECTS & MY FRIENDS SECTION */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* LEFT 2 COLUMNS: MY PROJECTS & MY TEAMMATES */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <FolderGit2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-blue-950">
                      My Projects
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      Active Projects: {myProjects.length} / 3 max (Max 2 created)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/projects")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-800"
                >
                  <Plus size={16} /> Explore / Create Project
                </button>
              </div>

              {/* Pending Project Invitations */}
              {projectInvites.length > 0 && (
                <div className="mt-6 space-y-3 rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-yellow-800">
                    Pending Project Invitations ({projectInvites.length})
                  </p>
                  {projectInvites.map((inv: any) => (
                    <div
                      key={inv.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm"
                    >
                      <div>
                        <h4 className="font-black text-blue-950">
                          {inv.project?.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Invited by {inv.project?.creator?.full_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptProjectInvite(inv)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          Accept & Join
                        </button>
                        <button
                          onClick={() => handleRejectProjectInvite(inv.id)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Projects List */}
              <div className="mt-6 space-y-6">
                {myProjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <p className="font-bold text-slate-600">
                      You have not joined or created any projects yet.
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Head over to Explore Projects to start a project or join an existing team!
                    </p>
                  </div>
                ) : (
                  myProjects.map((membership: any) => {
                    const proj = membership.project;
                    const isCreator = proj.creator_id === profile.id;
                    const isEditing = editingProjectId === proj.id;
                    const allMembers = proj.project_members || [];
                    const acceptedMembers = allMembers.filter(
                      (m: any) => m.status === "accepted"
                    );

                    return (
                      <div
                        key={proj.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
                      >
                        {/* Project Top Bar */}
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-800">
                                {isCreator ? "Creator" : "Teammate"}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                  proj.is_public
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {proj.is_public ? (
                                  <>
                                    <Globe size={12} /> Public
                                  </>
                                ) : (
                                  <>
                                    <Lock size={12} /> Private
                                  </>
                                )}
                              </span>
                              <span className="text-xs font-bold text-slate-400">
                                {proj.category}
                              </span>
                            </div>
                            <h3 className="mt-2 text-2xl font-black text-blue-950">
                              {proj.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCreator ? (
                              <>
                                <button
                                  onClick={() =>
                                    isEditing
                                      ? setEditingProjectId(null)
                                      : startEditingProject(proj)
                                  }
                                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                >
                                  <Edit3 size={14} />
                                  {isEditing ? "Cancel" : "Edit Project"}
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleLeaveProject(membership.id)}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                              >
                                <LogOut size={14} /> Leave Project
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Creator Edit Form vs Standard Display */}
                        {isEditing ? (
                          <div className="mt-4 space-y-4 rounded-2xl border border-blue-200 bg-white p-5">
                            <div>
                              <label className="mb-1 block text-xs font-bold text-slate-700">
                                Project Name
                              </label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-bold text-slate-700">
                                Description
                              </label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="h-20 w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-bold text-slate-700">
                                Update Space (GitHub repo, WhatsApp links, announcements)
                              </label>
                              <textarea
                                value={editUpdatesText}
                                onChange={(e) => setEditUpdatesText(e.target.value)}
                                placeholder="Share GitHub links, WhatsApp group links, or project tasks..."
                                className="h-20 w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-700">
                                  Max Members:
                                </label>
                                <input
                                  type="number"
                                  min={2}
                                  max={10}
                                  value={editMaxMembers}
                                  onChange={(e) =>
                                    setEditMaxMembers(Number(e.target.value))
                                  }
                                  className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => setEditIsPublic(!editIsPublic)}
                                className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                              >
                                Visibility: {editIsPublic ? "Public" : "Private"} (Click to toggle)
                              </button>

                              <button
                                onClick={() => handleSaveProjectUpdates(proj.id)}
                                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-black text-white hover:bg-blue-800"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {proj.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {(proj.skills_required || []).map((skill: string) => (
                                <span
                                  key={skill}
                                  className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Project Update Space (GitHub, WhatsApp links, etc.) */}
                            <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-wider text-yellow-800">
                                  Project Update Space (Links & Notes)
                                </p>
                                {isCreator && (
                                  <button
                                    onClick={() => startEditingProject(proj)}
                                    className="text-xs font-bold text-blue-700 hover:underline"
                                  >
                                    Update links
                                  </button>
                                )}
                              </div>
                              <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-700">
                                {proj.updates_text ||
                                  "No updates or links posted yet. Creator can add GitHub or WhatsApp links here."}
                              </p>
                            </div>
                          </>
                        )}

                        {/* MY TEAMMATES SUB-SECTION */}
                        <div className="mt-6 border-t border-slate-200 pt-5">
                          <div className="flex items-center justify-between">
                            <h4 className=" flex items-center gap-2 text-sm font-black text-blue-950">
                              <Users size={16} className="text-blue-700" />
                              My Teammates ({acceptedMembers.length} / {proj.max_members})
                            </h4>
                          </div>

                          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                            {allMembers.map((m: any) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5"
                              >
                                <div>
                                  <p className="text-sm font-bold text-blue-950">
                                    {m.profile?.full_name || "Student"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {m.role === "creator"
                                      ? "Project Creator"
                                      : m.status === "invited"
                                      ? "Pending Invite"
                                      : m.profile?.course || "Teammate"}
                                  </p>
                                </div>

                                {isCreator && m.user_id !== profile.id && (
                                  <button
                                    onClick={() => handleRemoveTeammate(m.id)}
                                    title="Remove from project"
                                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Creator Invite Teammate Control */}
                          {isCreator && acceptedMembers.length < proj.max_members && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <select
                                value={selectedInviteUser[proj.id] || ""}
                                onChange={(e) =>
                                  setSelectedInviteUser({
                                    ...selectedInviteUser,
                                    [proj.id]: e.target.value,
                                  })
                                }
                                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                              >
                                <option value="">
                                  Select a student or friend to invite to this project...
                                </option>
                                {allStudents
                                  .filter(
                                    (s) =>
                                      !allMembers.some((m: any) => m.user_id === s.id)
                                  )
                                  .map((student) => (
                                    <option key={student.id} value={student.id}>
                                      {student.full_name} ({student.course} - {student.year})
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => handleInviteTeammate(proj)}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-black text-white hover:bg-blue-800"
                              >
                                <UserPlus size={14} /> Send Invite
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MY FRIENDS SECTION */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-blue-950">My Friends</h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Connections & Requests
                  </p>
                </div>
              </div>

              {/* Incoming Friend Requests */}
              <div className="mt-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Incoming Requests ({incomingRequests.length})
                </h3>
                {incomingRequests.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">
                    No pending incoming requests.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {incomingRequests.map((req: any) => (
                      <div
                        key={req.id}
                        className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
                      >
                        <p className="font-black text-blue-950">
                          {req.sender?.full_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {req.sender?.course} • {req.sender?.year}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleAcceptFriend(req.id)}
                            className="flex-1 rounded-xl bg-blue-700 py-2 text-xs font-black text-white hover:bg-blue-800"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRemoveOrRejectFriend(req.id)}
                            className="flex-1 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accepted Friends List */}
              <div className="mt-7 border-t border-slate-200 pt-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Connected Friends ({acceptedFriends.length})
                </h3>
                {acceptedFriends.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">
                    No connected friends yet. Connect with students in Find Teammates!
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {acceptedFriends.map((f: any) => {
                      const friend =
                        f.sender_id === profile.id ? f.receiver : f.sender;
                      return (
                        <div
                          key={f.id}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5"
                        >
                          <div>
                            <p className="text-sm font-black text-blue-950">
                              {friend?.full_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {friend?.course} • {friend?.year}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveOrRejectFriend(f.id)}
                            title="Remove friend"
                            className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <UserMinus size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Outgoing Requests (with Solo-Testing helper for Sample Profiles) */}
              {outgoingRequests.length > 0 && (
                <div className="mt-7 border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Sent Requests ({outgoingRequests.length})
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    {outgoingRequests.map((req: any) => {
                      const isSample = req.receiver_id?.startsWith("00000000-");
                      return (
                        <div
                          key={req.id}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">
                              {req.receiver?.full_name}
                            </p>
                            <p className="text-slate-400">Pending response</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSample && (
                              <button
                                onClick={() => handleAcceptFriend(req.id)}
                                className="rounded-lg bg-emerald-100 px-2.5 py-1 font-bold text-emerald-700 hover:bg-emerald-200"
                              >
                                Simulate Accept
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveOrRejectFriend(req.id)}
                              className="text-red-500 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
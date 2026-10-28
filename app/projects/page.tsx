import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Database,
  Globe,
  Layers,
  Search,
  Users,
  Zap,
} from "lucide-react";

const projects = [
  {
    title: "Campus Connect",
    description:
      "A platform that helps students discover campus events, clubs and activities.",
    category: "Web Development",
    skills: ["React", "Next.js", "Tailwind"],
    members: 4,
    status: "Looking for teammates",
    icon: Globe,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "EcoTrack",
    description:
      "A sustainability dashboard that helps users track their environmental impact.",
    category: "Sustainability",
    skills: ["Python", "Data Science", "UI/UX"],
    members: 3,
    status: "Open for collaboration",
    icon: Layers,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "StudySync",
    description:
      "A collaborative study planner where students can share notes and manage tasks.",
    category: "Education",
    skills: ["JavaScript", "Firebase", "Design"],
    members: 5,
    status: "Looking for teammates",
    icon: Users,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "HealthVault",
    description:
      "A secure personal health record interface for organizing important information.",
    category: "HealthTech",
    skills: ["Python", "Database", "Backend"],
    members: 2,
    status: "Open for collaboration",
    icon: Database,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "CodeArena",
    description:
      "A practice platform where students can solve coding problems together.",
    category: "Programming",
    skills: ["C++", "Algorithms", "Next.js"],
    members: 4,
    status: "Looking for teammates",
    icon: Code2,
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "SmartServe",
    description:
      "A digital platform connecting volunteers with community service opportunities.",
    category: "Social Impact",
    skills: ["React", "Node.js", "MongoDB"],
    members: 3,
    status: "Open for collaboration",
    icon: Zap,
    color: "bg-orange-100 text-orange-700",
  },
];

export default function ProjectsPage() {
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

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-blue-950 hover:bg-yellow-300"
            >
              Start a project
              <ArrowRight size={19} />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
            <Search size={22} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search projects, technologies or interests..."
              className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-blue-950">
              Featured projects
            </h3>

            <p className="mt-1 text-slate-500">
              Explore ideas created by students.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            {projects.length} projects
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const Icon = project.icon;

            return (
              <article
                key={project.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${project.color}`}
                  >
                    <Icon size={25} />
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Open
                  </span>
                </div>

                {/* Project Information */}
                <p className="mt-6 text-sm font-bold text-blue-700">
                  {project.category}
                </p>

                <h4 className="mt-2 text-2xl font-black text-blue-950">
                  {project.title}
                </h4>

                <p className="mt-3 flex-1 leading-7 text-slate-600">
                  {project.description}
                </p>

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
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
                    {project.members} members
                  </div>

                  <button className="inline-flex items-center gap-2 font-black text-blue-700 hover:text-blue-900">
                    View project
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
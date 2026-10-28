import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Search,
} from "lucide-react";

const teammates = [
  {
    name: "Aarav Sharma",
    initials: "AS",
    course: "Computer Science and Engineering",
    year: "2nd Year",
    bio: "Interested in building useful web applications and working on innovative student projects.",
    skills: ["React", "Next.js", "JavaScript"],
    lookingFor: "Frontend projects",
    color: "bg-blue-700",
  },
  {
    name: "Riya Mehta",
    initials: "RM",
    course: "Information Science",
    year: "2nd Year",
    bio: "Passionate about product design, user experience and creating beautiful interfaces.",
    skills: ["UI/UX", "Figma", "Research"],
    lookingFor: "Design collaboration",
    color: "bg-yellow-500",
  },
  {
    name: "Kabir Rao",
    initials: "KR",
    course: "Computer Science and Engineering",
    year: "3rd Year",
    bio: "Enjoys solving challenging problems and developing reliable backend systems.",
    skills: ["Python", "Node.js", "Databases"],
    lookingFor: "Backend projects",
    color: "bg-indigo-700",
  },
  {
    name: "Ananya Iyer",
    initials: "AI",
    course: "Artificial Intelligence and Machine Learning",
    year: "2nd Year",
    bio: "Exploring machine learning, data analysis and real-world technology solutions.",
    skills: ["Python", "Machine Learning", "Pandas"],
    lookingFor: "AI/ML projects",
    color: "bg-emerald-600",
  },
  {
    name: "Vihaan Nair",
    initials: "VN",
    course: "Electronics and Communication",
    year: "3rd Year",
    bio: "Interested in combining software, electronics and automation to solve problems.",
    skills: ["C++", "Arduino", "IoT"],
    lookingFor: "Hardware-software projects",
    color: "bg-orange-600",
  },
  {
    name: "Meera Joshi",
    initials: "MJ",
    course: "Computer Science and Engineering",
    year: "2nd Year",
    bio: "Loves working on social-impact ideas and building simple solutions for users.",
    skills: ["Java", "HTML", "CSS"],
    lookingFor: "Social-impact projects",
    color: "bg-purple-600",
  },
];

export default function TeammatesPage() {
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

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-blue-950 hover:bg-yellow-300"
            >
              Create your profile
              <ArrowRight size={19} />
            </Link>
          </div>

          {/* Search */}
          <div className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
            <Search size={22} className="text-slate-400" />

            <input
              type="text"
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
            {teammates.length} profiles
          </span>
        </div>

        {/* Teammate Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teammates.map((teammate) => (
            <article
              key={teammate.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${teammate.color} text-xl font-black text-white`}
                >
                  {teammate.initials}
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  Available
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-black text-blue-950">
                {teammate.name}
              </h3>

              <p className="mt-1 text-sm font-bold text-blue-700">
                {teammate.year}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {teammate.course}
              </p>

              <p className="mt-5 flex-1 leading-7 text-slate-600">
                {teammate.bio}
              </p>

              <div className="mt-5">
                <p className="mb-2 text-sm font-black text-slate-700">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {teammate.skills.map((skill) => (
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
                  {teammate.lookingFor}
                </p>
              </div>

              <Link
                href="#"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800"
              >
                Connect with {teammate.name.split(" ")[0]}
                <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Information */}
      <section className="border-t border-slate-200 bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 rounded-2xl bg-blue-950 p-8 text-white md:flex-row">
          <div>
            <h2 className="text-2xl font-black">
              Ready to find your team?
            </h2>

            <p className="mt-2 text-blue-100">
              Create your profile and let other students discover your skills.
            </p>
          </div>

          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-blue-950 hover:bg-yellow-300"
          >
            Join Nexora
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
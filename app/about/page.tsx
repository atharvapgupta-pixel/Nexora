
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: Compass,
    title: "Discover Projects",
    description:
      "Explore project ideas shared by students and find opportunities that match your interests.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Users,
    title: "Find Teammates",
    description:
      "Connect with students who have the skills, interests, and motivation to build with you.",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Lightbulb,
    title: "Analyze Ideas",
    description:
      "Understand the skills, complexity, requirements, and possible development path of an idea.",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: Wrench,
    title: "Collaborate",
    description:
      "Create teams, share project information, and work together toward a common goal.",
    color: "bg-green-100 text-green-700",
  },
];

const steps = [
  {
    number: "01",
    title: "Sign in with your college email",
    description:
      "Use your verified college email to access a student-focused collaboration space.",
  },
  {
    number: "02",
    title: "Explore or create a project",
    description:
      "Find interesting project ideas or share your own idea with the student community.",
  },
  {
    number: "03",
    title: "Find students with matching skills",
    description:
      "Discover teammates based on their technical skills, interests, and project goals.",
  },
  {
    number: "04",
    title: "Build something meaningful",
    description:
      "Connect with your team and turn your idea into a working project.",
  },
];

const benefits = [
  "Designed for academic projects, EL projects, and hackathons",
  "Helps students find teammates with complementary skills",
  "Provides one place to discover and showcase project ideas",
  "Encourages peer learning and technical collaboration",
  "Makes team formation easier and more organized",
  "Supports students from idea discovery to project execution",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-[#172554]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-yellow-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                <Sparkles size={17} />
                About Nexora
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
                Build better projects,
                <span className="block text-blue-700">together.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                Nexora is a student collaboration platform that helps students
                discover project ideas, find teammates with complementary
                skills, and turn ideas into meaningful projects.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  Explore Projects
                  <ArrowRight size={19} />
                </Link>

                <Link
                  href="/teammates"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  Find Teammates
                  <Users size={19} />
                </Link>
              </div>
            </div>

            {/* Visual Illustration */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-200/60">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Nexora Community
                      </p>
                      <h2 className="mt-2 text-2xl font-black">
                        Ideas become teams.
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-700">
                      <Users size={28} />
                    </div>
                  </div>

                  <div className="mt-7 space-y-4">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-700 p-3 text-white">
                          <Lightbulb size={22} />
                        </div>

                        <div>
                          <p className="font-bold text-blue-950">
                            Project idea
                          </p>
                          <p className="text-sm text-blue-700">
                            Smart Campus Platform
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight
                        className="rotate-90 text-slate-400"
                        size={23}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
                          K
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-700">
                          Developer
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 font-bold text-yellow-950">
                          R
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-700">
                          Designer
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                          A
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-700">
                          Researcher
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-yellow-100 p-4 text-center">
                      <p className="font-bold text-yellow-900">
                        One idea. Different skills. One team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg sm:block">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" size={23} />
                  <div>
                    <p className="text-sm font-bold">Student-focused</p>
                    <p className="text-xs text-slate-500">
                      Made for collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nexora */}
      <section className="bg-slate-50 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-blue-700">
              Why Nexora?
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Great ideas become stronger when students work together.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              Finding the right teammates, choosing a suitable project idea,
              and organizing collaboration can be difficult. Project ideas are
              often scattered across different platforms, while team formation
              usually happens through informal groups or personal contacts.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Nexora brings these activities into one organized platform so
              students can connect, share ideas, discover skills, and build
              projects together.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-bold uppercase tracking-[0.2em] text-blue-700">
              What you can do
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Everything students need to get started
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              From discovering an idea to finding the right team, Nexora
              supports the early stages of project collaboration.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}
                  >
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-700 px-6 py-24 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-bold uppercase tracking-[0.2em] text-yellow-300">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              From an idea to a project team.
            </h2>

            <p className="mt-5 text-lg leading-8 text-blue-100">
              Nexora makes the process simple and organized for students.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-blue-500 bg-blue-800/60 p-6"
              >
                <p className="text-4xl font-black text-yellow-300">
                  {step.number}
                </p>

                <h3 className="mt-7 text-xl font-black">{step.title}</h3>

                <p className="mt-3 leading-7 text-blue-100">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-blue-700">
              Built for students
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              More than a project listing platform.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Nexora is designed to support students throughout the early
              stages of project discovery, team formation, and collaboration.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="space-y-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-blue-700"
                    size={22}
                  />
                  <p className="leading-7 text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-yellow-300 px-6 py-14 text-center sm:px-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <Workflow size={32} />
          </div>

          <h2 className="mt-7 text-4xl font-black text-blue-950 sm:text-5xl">
            Have an idea?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-900">
            Find the people to build it with. Explore projects, discover
            teammates, and start your next collaboration with Nexora.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white transition hover:bg-blue-800"
            >
              Explore Projects
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-700 px-6 py-3.5 font-bold text-blue-900 transition hover:bg-blue-100"
            >
              Get Started
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-xl font-black text-blue-700">Nexora</p>
            <p className="mt-1 text-sm text-slate-500">
              Connect. Create. Collaborate.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Built for students and meaningful collaboration.
          </p>
        </div>
      </footer>
    </main>
  );
}
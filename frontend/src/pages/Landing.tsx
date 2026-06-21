import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBell,
  FaCalculator,
  FaCheckCircle,
  FaCloudDownloadAlt,
  FaLeaf,
  FaMobileAlt,
  FaRobot,
  FaSeedling,
  FaTint,
  FaTractor,
} from "react-icons/fa";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const features = [
  {
    title: "Water Management",
    description:
      "Track irrigation hours and monitor water expenses across every field.",
    icon: <FaTint />,
  },
  {
    title: "AI Crop Doctor",
    description:
      "Upload crop images and get disease analysis with treatment guidance.",
    icon: <FaRobot />,
  },
  {
    title: "Expense Tracking",
    description:
      "Monitor fertilizer, labour, equipment, and operational costs in one place.",
    icon: <FaCalculator />,
  },
  {
    title: "Field Management",
    description:
      "Organize farms, crops, field history, and seasonal activity records.",
    icon: <FaSeedling />,
  },
  {
    title: "Smart Reminders",
    description:
      "Stay on top of irrigation cycles, crop tasks, and critical farm updates.",
    icon: <FaBell />,
  },
  {
    title: "Offline PWA Support",
    description:
      "Keep working in low-connectivity areas and sync records when online.",
    icon: <FaCloudDownloadAlt />,
  },
];

const steps = [
  "Add farm details",
  "Record water and expenses",
  "Get AI insights",
  "Improve productivity",
];

const benefits = [
  {
    title: "Save Time",
    description: "Reduce manual bookkeeping and repeat data entry.",
    icon: <FaTint />,
    className: "bg-emerald-100/80 border-emerald-200",
  },
  {
    title: "Reduce Costs",
    description: "Identify waste in irrigation, fertilizer, and equipment use.",
    icon: <FaTractor />,
    className: "bg-teal-100/80 border-teal-200",
  },
  {
    title: "Improve Health",
    description: "Catch crop stress early with image-based diagnosis.",
    icon: <FaLeaf />,
    className: "bg-lime-100/80 border-lime-200",
  },
  {
    title: "Increase Yield",
    description: "Use field records to make better seasonal decisions.",
    icon: <FaCheckCircle />,
    className: "bg-sky-100/80 border-sky-200",
  },
];

const techStack = [
  "React",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Gemini AI",
  "PWA",
  "Cloudinary",
];

const dashboardPreviews = [
  {
    title: "Main Dashboard",
    description: "A quick mobile overview of farm modules and daily activity.",
    image: "/landing-dashboard-phone.png",
    className: "md:col-span-1",
  },
  {
    title: "Water Records",
    description: "Detailed irrigation, earnings, and tubewell analytics.",
    image: "/landing-water-dashboard.png",
    className: "md:col-span-2",
  },
  {
    title: "Field Management",
    description: "Field-level expenses, crop modules, and farm history.",
    image: "/landing-fields-phone.png",
    className: "md:col-span-1",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);

  const token = localStorage.getItem("token");
  const appPath = token ? "/dashboard" : "/login";

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      navigate(appPath);
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a
            href="#home"
            className="font-bold text-emerald-800"
          >
            Smart Kisan
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="text-emerald-800" href="#home">
              Home
            </a>
            <a className="hover:text-emerald-800" href="#features">
              Features
            </a>
            <a className="hover:text-emerald-800" href="#ai-doctor">
              AI Crop Doctor
            </a>
            <a className="hover:text-emerald-800" href="#how-it-works">
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={appPath}
              className="hidden rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:inline-flex"
            >
              {token ? "Dashboard" : "Login"}
            </Link>
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-emerald-700"
            >
              Install App
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section
          id="home"
          className="relative overflow-hidden px-4 py-16 md:px-8 md:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
            <div className="relative z-10">
              <span className="mb-5 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800">
                Revolutionizing Agri-Tech
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                Smart Kisan -{" "}
                <span className="text-emerald-700">
                  Digital Farm Management
                </span>{" "}
                Made Easy
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Manage irrigation, expenses, fields, crop health, and farm
                operations from a single platform built for the modern Indian
                farmer.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={appPath}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Get Started <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-800 bg-white/70 px-6 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="relative mx-auto flex min-h-[420px] w-full max-w-[560px] items-center justify-center">
              <div className="absolute inset-10 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="relative h-[350px] w-[350px] overflow-hidden rounded-full border-8 border-white/60 shadow-2xl md:h-[470px] md:w-[470px]">
                <img
                  src="/tubewell.jpg"
                  alt="Green farm field with irrigation water pump"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute left-0 top-10 rounded-xl border border-white/70 bg-white/75 p-4 shadow-xl backdrop-blur-md">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Water Management
                </p>
                <p className="font-bold text-slate-950">12h irrigation today</p>
              </div>

              <div className="absolute bottom-10 right-0 rounded-xl border border-white/70 bg-white/75 p-4 shadow-xl backdrop-blur-md">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Expense Tracking
                </p>
                <p className="font-bold text-slate-950">Rs. 12,450 fertilizer</p>
              </div>

              <div className="absolute bottom-32 left-3 rounded-xl border border-white/70 bg-white/75 p-4 shadow-xl backdrop-blur-md">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  AI Insights
                </p>
                <p className="font-bold text-emerald-700">Health 98% optimal</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#eff4ff] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="text-3xl font-black text-slate-950 md:text-5xl">
                Everything You Need to Scale
              </h2>
              <p className="mt-3 text-slate-600">
                Advanced technology simplified for everyday farming, from water
                management to AI disease detection.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-lg border border-emerald-900/10 bg-white/65 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 inline-flex rounded-lg bg-emerald-100 p-3 text-xl text-emerald-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-doctor" className="overflow-hidden px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-5 inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                Advanced AI Diagnostics
              </span>
              <h2 className="text-3xl font-black text-slate-950 md:text-5xl">
                Instant Healing for Your Crops
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Identify plant stress and diseases before they spread. The AI
                Crop Doctor analyzes leaf patterns and gives treatment guidance
                tailored to your crop.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <FaCheckCircle className="mt-1 shrink-0 text-emerald-700" />
                  <div>
                    <h3 className="font-bold">Fast crop analysis</h3>
                    <p className="text-sm text-slate-600">
                      Upload a crop image and review the issue, symptoms, and
                      next action.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaCheckCircle className="mt-1 shrink-0 text-emerald-700" />
                  <div>
                    <h3 className="font-bold">Treatment history</h3>
                    <p className="text-sm text-slate-600">
                      Keep reports connected to farm records for better
                      decisions next season.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[360px]">
              <div className="absolute inset-10 rounded-full bg-emerald-300/25 blur-3xl" />
              <div className="relative rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 p-3 shadow-2xl">
                <div className="overflow-hidden rounded-[1.8rem] bg-white">
                  <div className="flex items-center justify-between bg-emerald-800 px-5 py-4 text-white">
                    <span className="text-sm">Back</span>
                    <span className="font-bold">AI Crop Doctor</span>
                    <span>...</span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-emerald-950">
                      <img
                        src="/field.jpg"
                        alt="Healthy green field crop"
                        className="h-full w-full object-cover opacity-90"
                      />
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-bold uppercase text-red-600">
                        Disease Detected
                      </p>
                      <h3 className="mt-1 font-bold">Powdery Mildew</h3>
                      <p className="mt-1 text-xs text-slate-600">
                        Likely cause: humidity and low air circulation.
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="font-bold">Recommended Treatment</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Apply organic neem oil spray every 7 days and improve
                        spacing between plants.
                      </p>
                      <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-emerald-800 py-2 text-sm font-semibold text-white"
                      >
                        Save Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-slate-950 px-4 py-16 text-white md:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-black md:text-5xl">
              Everything About Your Farm in One Place
            </h2>
            <p className="mt-3 text-slate-300">
              Dashboards designed for clarity, quick action, and practical farm
              decisions.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
            {dashboardPreviews.map(
              (preview) => (
                <article
                  key={preview.title}
                  className="overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md"
                >
                  <div className="bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.28),_transparent_42%),linear-gradient(135deg,_#052e2b,_#0f172a)] p-3">
                    <img
                      src={preview.image}
                      alt={`${preview.title} preview`}
                      className=" w-full rounded-lg  object-fill shadow-xl"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold">{preview.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">
                      {preview.description}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black text-slate-950 md:text-5xl">
                Simple to Start,
                <br />
                Powerful to Run
              </h2>
              <div className="mt-10 space-y-7">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{step}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Build a useful record system without slowing down daily
                        farm work.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className={`rounded-lg border p-6 ${benefit.className}`}
                >
                  <div className="mb-5 text-2xl text-emerald-800">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-12 md:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="font-bold text-slate-950">
              Built with Modern technologies
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-emerald-800 px-6 py-14 text-center text-white shadow-xl md:px-12 md:py-20">
            <FaMobileAlt className="mx-auto mb-5 text-4xl text-emerald-100" />
            <h2 className="text-3xl font-black md:text-5xl">
              Install Smart Kisan on Your Mobile Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-emerald-50">
              No Play Store required. Use the Progressive Web App to manage your
              farm anywhere, even offline.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleInstall}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Install Now
              </button>
              <Link
                to={appPath}
                className="rounded-lg bg-emerald-950/35 px-6 py-3 font-semibold text-white transition hover:bg-emerald-950/50"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-xl font-black text-emerald-800">
              Smart Kisan
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Empowering farmers with next-gen digital tools.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-600">
            <a href="#features" className="hover:text-emerald-800">
              Features
            </a>
            <a href="#ai-doctor" className="hover:text-emerald-800">
              AI Doctor
            </a>
            <Link to="/login" className="hover:text-emerald-800">
              Login
            </Link>
            <Link to="/register" className="hover:text-emerald-800">
              Register
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            (c) 2026 Smart Kisan SoamAgriTech.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

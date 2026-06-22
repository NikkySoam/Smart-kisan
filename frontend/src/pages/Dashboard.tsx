import { useTranslation } from "react-i18next";
import WeatherCard from "../components/WeatherCard";
import AnalyticsChart from "../components/AnalyticsChart";

import {
  FaArrowRight,
  FaLeaf,
  FaStethoscope,
  FaTint,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const modules = [
    {
      title: t("cropDoctor"),
      description: t("cropDoctorDescription"),
      path: "/crop-doctor",
      icon: <FaStethoscope />,
      image: "/ai-bg.jpeg",
      label: "AI",
    },
    {
      title: t("tubewellWater"),
      description: t("tubewellWaterDescription"),
      path: "/water-management",
      icon: <FaTint />,
      image: "/tubewell.jpg",
      label: t("water"),
    },
    {
      title: t("apnaKhet"),
      description: t("apnaKhetDescription"),
      path: "/fields",
      icon: <FaLeaf />,
      image: "/field.jpg",
      label: t("fields"),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 lg:px-8">
      
      <section className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {modules.map((module) => (
          <button
            key={module.path}
            type="button"
            onClick={() => navigate(module.path)}
            className="
              group
              overflow-hidden
              rounded-lg
              border
              border-emerald-900/10
              bg-white/75
              text-left
              shadow-sm
              backdrop-blur-xl
              transition-all
              hover:-translate-y-1
              hover:shadow-xl
              cursor-pointer
            "
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={module.image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-xl text-white backdrop-blur-md">
                {module.icon}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {module.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {module.description}
                  </p>
                </div>

                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">
                  <FaArrowRight className="text-sm" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <WeatherCard />
        <AnalyticsChart />
      </section>
    </div>
  );
};

export default Dashboard;

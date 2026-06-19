import { useTranslation } from "react-i18next";
import { useEffect, useState,} from "react";

import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import { cacheWaterStats } from "../../utils/cacheWaterStats";

import { getCachedWaterStats } from "../../utils/getCachedWaterStats";

import API from "../../api/axios";

import {
  FaUsers,
  FaTint,
  FaChartBar,
  FaArrowRight,
} from "react-icons/fa";

interface Stats {
  totalFarmers: number;

  totalEntries: number;

  totalHours: number;

  totalEarnings: number;

  waterRate: number;
}



const WaterManagement = () => {
  const { t } = useTranslation();
  const navigate =
    useNavigate();

  const token =
    localStorage.getItem("token");

  const [stats, setStats] =
    useState<Stats>({
      totalFarmers: 0,

      totalEntries: 0,

      totalHours: 0,

      totalEarnings: 0,

      waterRate: 0,
    });

  // FETCH STATS

  const fetchStats =
  async () => {

    try {

      const res =
        await API.get(
          "/dashboard/stats",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setStats(res.data.data);
      await cacheWaterStats(res.data.data);

    } catch {

      const cached = await getCachedWaterStats();

      if (cached) {
          setStats(cached);
      }
    }
};

  useEffect(() => {

  const loadData = async () => {
      const cached = await getCachedWaterStats();

      if (cached) {
        setStats(cached);
      }
      fetchStats();
    };
  loadData();
}, []);

  const cards = [
    {
      title: t("farmers"),
      description:
        t("manageTubewellFarmers"),
      path: "/farmers",
      icon: <FaUsers />,
    },
    {
      title: t("waterEntries"),
      description:
        t("addManageWaterUsage"),
      path: "/water",
      icon: <FaTint />,
    },
    {
      title: t("reports"),
      description:
        t("viewMonthlyReports"),
      path: "/reports",
      icon: <FaChartBar />,
    },
  ];

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-10">

        <h1
          className="
            text-4xl
            sm:text-5xl
            font-bold
            bg-linear-to-r
            from-green-500
            to-green-800
            bg-clip-text
            text-transparent py-2"
        >{t("waterManagement")}</h1>

        <p className="text-gray-500 mt-2">{t("tubewellBusinessDashboard")}</p>

      </div>

      {/* ACTION CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-10
        "
      >

        {cards.map(
          (card) => (
            <button
              key={card.path}
              onClick={() =>
                navigate(card.path)
              }
              className="
                bg-white
                rounded-3xl
                p-6
                shadow
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                text-left
                cursor-pointer
                border
                border-green-100
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-green-100
                    text-green-700
                    flex
                    items-center
                    justify-center
                    text-3xl
                  "
                >
                  {card.icon}
                </div>

                <FaArrowRight className="text-green-700 mt-2" />

              </div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-green-900
                  mt-6 py-2"
              >
                {card.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {card.description}
              </p>

            </button>
          )
        )}

      </div>

      {/* STATS */}

      
      <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-5
          gap-6
        "
      >

        {/* FARMERS */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500 py-2">{t("totalFarmers")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalFarmers
            }
          </p>

        </div>

        {/* ENTRIES */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500 py-2">{t("waterEntries")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalEntries
            }
          </p>

        </div>

        {/* HOURS */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500 py-2">{t("totalHours")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalHours
            }
          </p>

        </div>

        {/* EARNINGS */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500 py-2">{t("earnings")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            ₹
            {
              stats.totalEarnings
            }
          </p>

        </div>

        {/* WATER RATE */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500 py-2">{t("waterRate")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            ₹
            {
              stats.waterRate
            }
          </p>

        </div>

      </div>

    </div>
  );
};

export default WaterManagement;

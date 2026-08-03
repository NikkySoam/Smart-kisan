import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { cacheWaterStats } from "../../utils/cacheWaterStats";

import { getCachedWaterStats } from "../../utils/getCachedWaterStats";

import AnalyticsChart from "../../components/AnalyticsChart";

import API from "../../api/axios";

import {
  FaUsers,
  FaTint,
  FaChartBar,
  FaArrowRight,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

interface Stats {
  totalFarmers: number;

  totalEntries: number;

  totalHours: number;

  totalEarnings: number;

  waterRate: number;

  topConsumer?: {
    farmerName: string;
    totalHours: number;
    totalAmount: number;
    entries: number;
  } | null;
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

      topConsumer: null,
    });

  const [isEditingRate, setIsEditingRate] = useState(false);
  const [newRate, setNewRate] = useState("");
  const [rateLoading, setRateLoading] = useState(false);

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

  const handleUpdateRate = async () => {
    const rateNum = Number(newRate);
    if (!newRate || rateNum <= 0) {
      toast.error(t("enterValidRate") || "Enter a valid positive number");
      return;
    }
    setRateLoading(true);
    try {
      await API.put(
        "/settings/water-rate",
        { waterRate: rateNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("waterRateUpdated") || "Water rate updated successfully");
      setStats(prev => ({ ...prev, waterRate: rateNum }));
      cacheWaterStats({ ...stats, waterRate: rateNum });
      setIsEditingRate(false);
    } catch (error) {
      toast.error(t("waterRateUpdateFailed") || "Failed to update water rate");
    } finally {
      setRateLoading(false);
    }
  };

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
    <div className="p-4 sm:py-2 sm:px-8 mb-10">

      {/* HEADER & WATER RATE */}

      <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
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

        {/* WATER RATE SECTION */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 flex items-center gap-4 min-w-[250px] w-full md:w-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <FaTint className="text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">{t("waterRate")}</p>
            {isEditingRate ? (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-20 border-b-2 border-green-500 focus:outline-none text-lg font-bold text-gray-800"
                  min="1"
                  autoFocus
                />
                <span className="text-gray-500 text-sm">/hr</span>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-800 mt-1">
                ₹{stats.waterRate}<span className="text-sm font-normal text-gray-500">/hr</span>
              </p>
            )}
          </div>
          <div>
            {isEditingRate ? (
              <div className="flex gap-2">
                 <button 
                   onClick={handleUpdateRate} 
                   disabled={rateLoading} 
                   className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                 >
                   <FaSave />
                 </button>
                 <button 
                   onClick={() => setIsEditingRate(false)} 
                   disabled={rateLoading} 
                   className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                 >
                   <FaTimes />
                 </button>
              </div>
            ) : (
              <button 
                onClick={() => { setNewRate(stats.waterRate.toString()); setIsEditingRate(true); }} 
                className="p-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer font-medium text-sm flex items-center gap-2 px-3"
              >
                <FaEdit /> {t("edit") || "Edit"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ACTION CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
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
          lg:grid-cols-3
          xl:grid-cols-5
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

        {/* TOP CONSUMER */}
        
        <div className="bg-white rounded-3xl p-6 shadow flex flex-col justify-between">
          <h2 className="text-gray-500 py-2">Top Water Consumer</h2>
          {stats.topConsumer ? (
             <div className="mt-2 space-y-2">
                <p className="text-xl font-bold text-gray-800">👨‍🌾 {stats.topConsumer.farmerName}</p>
                <p className="text-lg font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">💧 {stats.topConsumer.totalHours} Hours</p>
                <p className="text-gray-600 font-semibold">💰 ₹{stats.topConsumer.totalAmount}</p>
                <p className="text-gray-500 text-sm">📅 {stats.topConsumer.entries} Entries</p>
             </div>
          ) : (
             <p className="mt-4 text-gray-400 font-medium">No Water Data Available</p>
          )}
        </div>

      </div>

       <AnalyticsChart />

    </div>
  );
};

export default WaterManagement;

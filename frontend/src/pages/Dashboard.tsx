import {
  useEffect,
  useState,
} from "react";

import WeatherCard from "../components/WeatherCard";
import AnalyticsChart from "../components/AnalyticsChart";

import { FaLeaf } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

interface Stats {
  totalFarmers: number;

  totalEntries: number;

  totalHours: number;

  totalEarnings: number;

  waterRate: number;
}

const Dashboard = () => {

  const navigate = useNavigate();

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

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome to Smart Kisan
        </p>

      </div>

      {/* STATS CARDS */}

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

          <h2 className="text-gray-500">
            Total Farmers
          </h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalFarmers
            }
          </p>

        </div>

        {/* ENTRIES */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Water Entries
          </h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalEntries
            }
          </p>

        </div>

        {/* HOURS */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Total Hours
          </h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalHours
            }
          </p>

        </div>

        {/* EARNINGS */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Earnings
          </h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            ₹
            {
              stats.totalEarnings
            }
          </p>

        </div>

        {/* WATER RATE */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Water Rate
          </h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            ₹
            {
              stats.waterRate
            }
          </p>

        </div>


        {/* APNA KHET */}

        <div
        onClick={() =>
            navigate("/fields")
        }
        className="
            relative
            overflow-hidden
            rounded-3xl
            shadow-lg
            cursor-pointer
            group
            min-h-[260px]
            bg-cover
            bg-center
            hover:scale-[1.02]
            transition-all
        "
        style={{
            backgroundImage:
            "url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop)",
        }}
        >

        {/* OVERLAY */}

        <div
            className="
            absolute
            inset-0
            bg-black/45
            group-hover:bg-black/35
            transition-all
            "
        ></div>

        {/* CONTENT */}

        <div
            className="
            relative
            z-10
            h-full
            p-6
            flex
            flex-col
            justify-between
            text-white
            "
        >

            {/* TOP */}

            <div
            className="
                w-16
                h-16
                rounded-2xl
                bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
            "
            >

            <FaLeaf className="text-3xl" />

            </div>

            {/* BOTTOM */}

            <div>

            <h2 className="text-4xl font-bold">
                Apna Khet
            </h2>

            <p className="mt-3 text-gray-200">
                Manage your fields,
                fertilizer, water,
                labour and equipment
            </p>

            </div>

        </div>

        </div>

      </div>


      <div className="mt-8">
        <WeatherCard />
      </div>

      <div className="mt-8">
        <AnalyticsChart />
      </div>

    </div>
  );
};

export default Dashboard;
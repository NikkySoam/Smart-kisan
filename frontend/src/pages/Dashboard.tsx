import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

interface Stats {
  totalFarmers: number;

  totalEntries: number;

  totalHours: number;

  totalEarnings: number;

  waterRate: number;
}

const Dashboard = () => {
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

        <h1 className="text-3xl sm:text-5xl font-bold text-green-900">
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

          <p className="text-4xl font-bold text-green-700 mt-4">
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

          <p className="text-4xl font-bold text-green-700 mt-4">
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

          <p className="text-4xl font-bold text-green-700 mt-4">
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

          <p className="text-4xl font-bold text-green-700 mt-4">
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

          <p className="text-4xl font-bold text-green-700 mt-4">
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

export default Dashboard;
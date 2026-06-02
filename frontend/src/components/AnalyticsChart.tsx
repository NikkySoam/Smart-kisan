import {
  useCallback,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface Entry {
  _id: string;
  totalAmount: number;
  hours: number;
  date: string;
}

interface ChartData {
  month: string;
  earnings: number;
  hours: number;
}

const AnalyticsChart = () => {
  const token = localStorage.getItem("token");

  const [chartData, setChartData] =
    useState<ChartData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/water", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const entries: Entry[] = res.data.data || [];

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const currentYear = new Date().getFullYear();

      const monthlyData: ChartData[] = months.map(
        (month) => ({
          month,
          earnings: 0,
          hours: 0,
        })
      );

      entries.forEach((entry) => {
        const entryDate = new Date(entry.date);

        if (Number.isNaN(entryDate.getTime())) {
          return;
        }

        if (entryDate.getFullYear() !== currentYear) {
          return;
        }

        const monthIndex = entryDate.getMonth();

        monthlyData[monthIndex].earnings +=
          Number(entry.totalAmount) || 0;

        monthlyData[monthIndex].hours +=
          Number(entry.hours) || 0;
      });

      setChartData(monthlyData);
    } catch (error) {
      console.log(error);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-900">
          Monthly Analytics
        </h2>

        <p className="text-gray-500 mt-1">
          Earnings & water usage overview
        </p>
      </div>

      {loading && (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          Loading analytics...
        </div>
      )}

      {!loading && error && (
        <div className="h-[400px] flex items-center justify-center text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="earnings"
                name="Earnings"
                fill="#15803d"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                dataKey="hours"
                name="Hours"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
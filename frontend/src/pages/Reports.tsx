import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

interface Farmer {
  _id: string;
  name: string;
}

interface ReportEntry {
  _id: string;

  farmer?: {
    name: string;
  };

  hours: number;

  totalAmount: number;

  date: string;
}

const Reports = () => {
  const token =
    localStorage.getItem("token");

  const currentDate =
    new Date();

  // STATES

  const [farmers, setFarmers] =
    useState<Farmer[]>([]);

  const [entries, setEntries] =
    useState<ReportEntry[]>([]);

  const [stats, setStats] =
    useState({
      totalEntries: 0,

      totalHours: 0,

      totalEarnings: 0,
    });

  const [filters, setFilters] =
    useState({
      month:
        currentDate.getMonth() + 1,

      year:
        currentDate.getFullYear(),

      farmer: "",
    });

  // FETCH FARMERS

  const fetchFarmers = async () => {
    try {
      const res = await API.get(
        "/farmers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFarmers(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  // FETCH REPORTS

  const fetchReports = async () => {
    try {
      const res = await API.get(
        "/reports/monthly",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          params: filters,
        }
      );

      setEntries(res.data.data);

      setStats({
        totalEntries:
          res.data.totalEntries,

        totalHours:
          res.data.totalHours,

        totalEarnings:
          res.data.totalEarnings,
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl sm:text-5xl font-bold text-green-900">
          Monthly Reports
        </h1>

        <p className="text-gray-600 mt-2">
          Analyze monthly water usage
        </p>

      </div>

      {/* FILTERS */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow
          p-6
          mb-8
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >

        {/* MONTH */}

        <select
          value={filters.month}
          onChange={(e) =>
            setFilters({
              ...filters,
              month:
                Number(
                  e.target.value
                ),
            })
          }
          className="
            border
            p-4
            rounded-2xl
          "
        >

          {Array.from(
            { length: 12 },
            (_, i) => (
              <option
                key={i + 1}
                value={i + 1}
              >
                Month {i + 1}
              </option>
            )
          )}

        </select>

        {/* YEAR */}

        <input
          type="number"
          value={filters.year}
          onChange={(e) =>
            setFilters({
              ...filters,
              year:
                Number(
                  e.target.value
                ),
            })
          }
          className="
            border
            p-4
            rounded-2xl
          "
        />

        {/* FARMER */}

        <select
          value={filters.farmer}
          onChange={(e) =>
            setFilters({
              ...filters,
              farmer:
                e.target.value,
            })
          }
          className="
            border
            p-4
            rounded-2xl
          "
        >

          <option value="">
            All Farmers
          </option>

          {farmers.map(
            (farmer) => (
              <option
                key={farmer._id}
                value={
                  farmer._id
                }
              >
                {farmer.name}
              </option>
            )
          )}

        </select>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-6
          mb-8
        "
      >

        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-gray-500">
            Total Entries
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            {
              stats.totalEntries
            }
          </p>

        </div>

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

      </div>

      {/* TABLE */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow
          p-6
          overflow-x-auto
        "
      >

        <table className="w-full min-w-[700px]">

          <thead>

            <tr className="bg-green-700 text-white">

              <th className="p-4 text-left rounded-l-xl">
                Farmer
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Hours
              </th>

              <th className="p-4 text-left rounded-r-xl">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {entries.map(
              (item) => (
                <tr
                  key={item._id}
                  className="border-b"
                >

                  <td className="p-4">
                    {
                      item.farmer
                        ?.name
                    }
                  </td>

                  <td className="p-4">
                    {new Date(
                      item.date
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {item.hours}
                  </td>

                  <td
                    className="
                      p-4
                      font-bold
                      text-green-700
                    "
                  >
                    ₹
                    {
                      item.totalAmount
                    }
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Reports;
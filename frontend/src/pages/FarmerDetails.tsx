import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Entry {
  _id: string;

  hours: number;

  totalAmount: number;

  date: string;

  farmer: {
    name: string;
  };
}

const FarmerDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const token =
    localStorage.getItem("token");

  const [entries, setEntries] =
    useState<Entry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalHours: 0,

      totalAmount: 0,
    });

  // FETCH DATA

  const fetchFarmerDetails =
    async () => {
      try {
        const res = await API.get(
          `/water/farmer/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEntries(res.data.data);

        setStats({
          totalHours:
            res.data.totalHours,

          totalAmount:
            res.data.totalAmount,
        });

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchFarmerDetails();
  }, []);

  // LOADING

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">
          Loading...
        </h1>
      </div>
    );
  }

  // FARMER NAME

  const farmerName =
    entries[0]?.farmer?.name ||
    "Farmer";

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8 flex justify-between items-center">
        <div>
        <h1 className="text-3xl sm:text-5xl font-bold text-green-900">
          {farmerName}
        </h1>

        <p className="text-gray-600 mt-2">
          Farmer Water Details
        </p>
        </div>
        <button
                onClick={() =>
                    navigate(
                    `/water`
                    )
                }
                className="
                    bg-green-700
                    hover:bg-green-800
                    text-white
                    px-6
                    py-1
                    md:py-3
                    sm:py-2
                    rounded-2xl
                    font-semibold
                    shadow-lg
                    cursor-pointer
                "
                >
                Add Water
                </button>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-6
          mb-8
        "
      >

        {/* TOTAL HOURS */}

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-gray-500">
            Total Water Hours
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            {
              stats.totalHours
            }
          </p>

        </div>

        {/* TOTAL AMOUNT */}

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-gray-500">
            Total Earnings
          </h2>

          <p className="text-4xl font-bold text-green-700 mt-4">
            ₹
            {
              stats.totalAmount
            }
          </p>

        </div>

      </div>

      {/* HISTORY TABLE */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow
          p-6
          overflow-x-auto
        "
      >

        <h2 className="text-2xl font-bold text-green-800 mb-6">
          Water History
        </h2>

        <table className="w-full min-w-[700px]">

          <thead>

            <tr className="bg-green-700 text-white">

              <th className="p-4 text-left rounded-l-xl">
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

export default FarmerDetails;
import { useTranslation } from "react-i18next";
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import generateBill from "../../utils/generateBill";

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
  const { t } = useTranslation();

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

  const [waterRate, setWaterRate] =
  useState(0);

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

        // FETCH WATER RATE
        const settingsRes =
            await API.get(
                "/settings",
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            setWaterRate(
            settingsRes.data.data
                .waterRate
            );

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
        <h1 className="text-2xl font-bold py-2">{t("loading")}</h1>
      </div>
    );
  }

  // FARMER NAME

  const farmerName =
    entries[0]?.farmer?.name ||
    t("farmer");

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8 flex justify-between items-center">
        <div>
        <h1 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent py-2">
          {farmerName}
        </h1>

        <p className="text-gray-600 mt-2">{t("farmerWaterDetails")}</p>
        </div>
        <button
                onClick={() =>
                    navigate(
                    `/water`
                    )
                }
                className="
                    bg-linear-to-r from-green-500 to-green-800 
                    hover:from-green-600 hover:to-green-900
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
                >{t("addWater")}</button>

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

          <h2 className="text-gray-500 py-2">{t("totalWaterHours")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            {
              stats.totalHours
            }
          </p>

        </div>

        {/* TOTAL AMOUNT */}

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-gray-500 py-2">{t("totalEarnings")}</h2>

          <p className="text-4xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-4">
            ₹
            {
              stats.totalAmount
            }
          </p>

        </div>

      </div>


            {/* GENERATE BILL */}

      <div className="mb-6">

        <button
            onClick={() =>
            generateBill({
                farmerName,

                entries,

                totalHours:
                stats.totalHours,

                totalAmount:
                stats.totalAmount,

                waterRate,
            })
            }
            className="
            bg-linear-to-r from-green-500 to-green-800 
            hover:from-green-600 hover:to-green-900
            text-white
            px-6
            py-3
            rounded-2xl
            font-semibold
            transition-all
            cursor-pointer
            "
        >{t("previewPdfBill")}</button>

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

        <h2 className="text-2xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mb-6 py-2">{t("waterHistory")}</h2>

        <table className="w-full min-w-[700px]">

          <thead>

            <tr className="bg-linear-to-r from-green-500 to-green-800 text-white">

              <th className="p-4 text-left rounded-l-xl">{t("date")}</th>

              <th className="p-4 text-left">{t("hours")}</th>

              <th className="p-4 text-left rounded-r-xl">{t("amount")}</th>

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
                      bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent
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

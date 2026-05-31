import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

const Settings = () => {
  const token =
    localStorage.getItem("token");

  const [waterRate, setWaterRate] =
    useState("");

  // FETCH SETTINGS

  const fetchSettings = async () => {
    try {
      const res = await API.get(
        "/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWaterRate(
        res.data.data.waterRate
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // UPDATE RATE

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await API.put(
        "/settings/water-rate",
        {
          waterRate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Water Rate Updated"
      );

    } catch (error) {
      toast.error(
        "Failed to update rate"
      );
    }
  };

  return (
    <div className="p-4 sm:p-8">

      <div className="max-w-3xl">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl sm:text-5xl font-bold text-green-900">
            Settings
          </h1>

          <p className="text-gray-600 mt-2">
            Manage application settings
          </p>

        </div>

        {/* SETTINGS CARD */}

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow">

          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Water Rate Settings
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-gray-700 mb-2 font-medium">
                Water Rate Per Hour
              </label>

              <input
                type="number"
                value={waterRate}
                onChange={(e) =>
                  setWaterRate(
                    e.target.value
                  )
                }
                placeholder="Enter water rate"
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                  outline-none
                  focus:border-green-600
                "
              />

            </div>

            <button
              className="
                bg-green-700
                hover:bg-green-800
                text-white
                px-6
                py-4
                rounded-2xl
                font-semibold
                transition-all
                cursor-pointer
              "
            >
              Update Water Rate
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Settings;
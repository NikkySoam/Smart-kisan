import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

import {
  FaCity,
  FaSave,
  FaTint,
  FaUser,
} from "react-icons/fa";

const Settings = () => {
  const token =
    localStorage.getItem("token");

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [waterRateLoading, setWaterRateLoading] =
    useState(false);

  const [cityLoading, setCityLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      waterRate: "",
      city: "",
    });

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

      setFormData({
        name:
          res.data.data.name || "",
        phone:
          res.data.data.phone || "",
        waterRate:
          res.data.data.waterRate || "",
        city:
          res.data.data.city || "",
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const updateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setProfileLoading(true);

    try {
      await API.put(
        "/settings/update-profile",
        {
          name: formData.name,
          phone: formData.phone,
        },
        {
          headers,
        }
      );

      toast.success(
        "Profile updated"
      );

    } catch (error) {
      toast.error(
        "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const updateWaterRate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setWaterRateLoading(true);

    try {
      await API.put(
        "/settings/water-rate",
        {
          waterRate:
            formData.waterRate,
        },
        {
          headers,
        }
      );

      toast.success(
        "Water rate updated"
      );

    } catch (error) {
      toast.error(
        "Failed to update water rate"
      );
    } finally {
      setWaterRateLoading(false);
    }
  };

  const updateCity = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setCityLoading(true);

    try {
      await API.put(
        "/settings/city",
        {
          city: formData.city,
        },
        {
          headers,
        }
      );

      toast.success(
        "City updated"
      );

    } catch (error) {
      toast.error(
        "Failed to update city"
      );
    } finally {
      setCityLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-8">

        <h1 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
          Settings
        </h1>

        <p className="text-gray-600 mt-2">
          Manage profile, billing rate,
          and weather location
        </p>

      </div>

      <div
        className="
          max-w-6xl
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        <div
          className="
            xl:col-span-3
            bg-linear-to-r
            from-green-500
            to-green-800
            rounded-3xl
            p-6
            sm:p-8
            text-white
            shadow-lg
          "
        >

          <div className="flex items-center gap-5">

            <div
              className="
                w-20
                h-20
                rounded-3xl
                bg-white
                text-green-800
                flex
                items-center
                justify-center
                text-3xl
                font-bold
              "
            >
              {formData.name
                ?.charAt(0)
                ?.toUpperCase() || "F"}
            </div>

            <div>

              <p className="text-green-100 text-sm">
                Account Overview
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {formData.name ||
                  "Farmer"}
              </h2>

              <p className="text-green-100 mt-1">
                {formData.phone ||
                  "No phone number"}
              </p>

            </div>

          </div>

        </div>

        <form
          onSubmit={updateProfile}
          className="
            xl:col-span-2
            bg-white
            rounded-3xl
            shadow-lg
            p-6
            sm:p-8
          "
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="bg-green-100 text-green-700 p-4 rounded-2xl">
              <FaUser />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-900">
                Profile Details
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Name and phone number
                update together
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                  focus:border-green-700
                "
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                  focus:border-green-700
                "
                placeholder="Enter phone number"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="
              mt-6
              bg-linear-to-r
              from-green-500
              to-green-800
              hover:from-green-600
              hover:to-green-900
              disabled:opacity-60
              text-white
              px-6
              py-4
              rounded-2xl
              font-semibold
              flex
              items-center
              gap-3
              cursor-pointer
            "
          >
            <FaSave />
            {profileLoading
              ? "Saving..."
              : "Save Profile"}
          </button>

        </form>

        <form
          onSubmit={updateWaterRate}
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-6
            sm:p-8
          "
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="bg-green-100 text-green-700 p-4 rounded-2xl">
              <FaTint />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-900">
                Water Rate
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Applied to future
                entries
              </p>
            </div>

          </div>

          <label className="block mb-2 text-gray-700 font-medium">
            Rate Per Hour
          </label>

          <input
            type="number"
            name="waterRate"
            value={formData.waterRate}
            onChange={handleChange}
            className="
              w-full
              border
              border-gray-300
              p-4
              rounded-2xl
              outline-none
              focus:border-green-700
            "
            placeholder="Enter water rate"
          />

          <button
            type="submit"
            disabled={waterRateLoading}
            className="
              mt-6
              w-full
              bg-green-700
              hover:bg-green-800
              disabled:opacity-60
              text-white
              p-4
              rounded-2xl
              font-semibold
              cursor-pointer
            "
          >
            {waterRateLoading
              ? "Saving..."
              : "Update Rate"}
          </button>

        </form>

        <form
          onSubmit={updateCity}
          className="
            xl:col-span-3
            bg-white
            rounded-3xl
            shadow-lg
            p-6
            sm:p-8
          "
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="bg-green-100 text-green-700 p-4 rounded-2xl">
              <FaCity />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-900">
                Weather City
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Used by the dashboard
                weather card
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                p-4
                rounded-2xl
                outline-none
                focus:border-green-700
              "
              placeholder="Enter city"
            />

            <button
              type="submit"
              disabled={cityLoading}
              className="
                bg-green-700
                hover:bg-green-800
                disabled:opacity-60
                text-white
                px-8
                py-4
                rounded-2xl
                font-semibold
                cursor-pointer
              "
            >
              {cityLoading
                ? "Saving..."
                : "Update City"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Settings;

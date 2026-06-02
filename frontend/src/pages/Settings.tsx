import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

const Settings = () => {
  const token =
    localStorage.getItem("token");

  // STATES

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      waterRate: "",
      city: "",
    });

  // FETCH USER SETTINGS

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
          res.data.data.waterRate ||
          "",
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

  // HANDLE CHANGE

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // UPDATE SETTINGS

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      await API.put(
        "/settings/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Settings Updated"
      );

    } catch (error) {
      toast.error(
        "Failed to update settings"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
          Settings
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your profile and
          water settings
        </p>

      </div>

      {/* SETTINGS CARD */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          overflow-hidden
          max-w-4xl
        "
      >

        {/* TOP SECTION */}

        <div
          className="
            bg-linear-to-r from-green-500 to-green-800 
            p-6
            sm:p-8
            text-white
          "
        >

          <div className="flex items-center gap-5">

            {/* PROFILE IMAGE */}

            <div
              className="
                w-20
                h-20
                rounded-full
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
                ?.toUpperCase()}
            </div>

            {/* USER INFO */}

            <div>

              <h2 className="text-3xl font-bold">
                {formData.name ||
                  "Farmer"}
              </h2>

              <p className="text-green-100 mt-1">
                {formData.phone}
              </p>

            </div>

          </div>

        </div>

        {/* FORM SECTION */}

        <div className="p-6 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* PROFILE SETTINGS */}

            <div>

              <h2 className="text-2xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mb-5">
                Profile Settings
              </h2>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
              >

                {/* NAME */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-gray-700
                      font-medium
                    "
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      p-4
                      rounded-2xl
                      outline-none
                      focus:border-green-700
                    "
                    placeholder="Enter name"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-gray-700
                      font-medium
                    "
                  >
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      p-4
                      rounded-2xl
                      outline-none
                      focus:border-green-700
                    "
                    placeholder="Enter phone"
                  />

                </div>

              </div>

            </div>

            {/* WATER SETTINGS */}

            <div className="flex flex-col gap-2">

              <h2 className="text-2xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mb-5">
                Settings
              </h2>

              <div
                className="
                  bg-green-50
                  rounded-3xl
                  p-5
                "
              >

                <label
                  className="
                    block
                    mb-2
                    text-gray-700
                    font-medium
                  "
                >
                  Water Rate Per Hour
                </label>

                <input
                  type="number"
                  name="waterRate"
                  value={
                    formData.waterRate
                  }
                  onChange={
                    handleChange
                  }
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

                <p className="text-gray-500 text-sm mt-3">
                  This rate will apply
                  to future water
                  entries.
                </p>

              </div>

              <div
               className="
                  bg-green-50
                  rounded-3xl
                  p-5
                "
                >

            <label
                className="
                block
                mb-2
                text-gray-700
                font-medium
                "
            >
                City
            </label>

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

            </div>

            </div>

            {/* SAVE BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                bg-linear-to-r from-green-500 to-green-800 
                hover:from-green-600 hover:to-green-900
                disabled:bg-green-400
                text-white
                px-8
                py-4
                rounded-2xl
                font-semibold
                transition-all
                cursor-pointer
              "
            >
              {loading
                ? "Saving..."
                : "Save Settings"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Settings;
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import {cacheSettings} from "../utils/cacheSettings";

import { getCachedSettings } from "../utils/getCachedSettings";

import toast from "react-hot-toast";

import {
  FaCity,
  FaSave,
  FaSignOutAlt,
  FaTint,
  FaUser,
} from "react-icons/fa";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

const fetchSettings =
  async () => {

    try {

      const res =
        await API.get(
          "/settings",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const settings =
        res.data.data;

      setFormData({
        name:
          settings.name || "",
        phone:
          settings.phone || "",
        waterRate:
          settings.waterRate || "",
        city:
          settings.city || "",
      });

      await cacheSettings(
        settings
      );

    } catch {

      const cached =
        await getCachedSettings();

      if (cached) {

        setFormData({
          name:
            cached.name || "",
          phone:
            cached.phone || "",
          waterRate:
            cached.waterRate || "",
          city:
            cached.city || "",
        });

      }
    }
};

  useEffect(() => {

  const loadData =
    async () => {

      const cached =
        await getCachedSettings();

      if (cached) {

        setFormData({
          name:
            cached.name || "",
          phone:
            cached.phone || "",
          waterRate:
            cached.waterRate || "",
          city:
            cached.city || "",
        });
      }

      fetchSettings();
    };

  loadData();

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

  const logoutHandler = () => {
    const confirmLogout =
      window.confirm(t("logoutConfirm"));

    if (!confirmLogout) return;

    localStorage.removeItem(
      "token"
    );

    navigate("/");
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
        t("profileUpdated")
      );

    } catch (error) {
      toast.error(
        t("profileUpdateFailed")
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
        t("waterRateUpdated")
      );

    } catch (error) {
      toast.error(
        t("waterRateUpdateFailed")
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
        t("cityUpdated")
      );

    } catch (error) {
      toast.error(
        t("cityUpdateFailed")
      );
    } finally {
      setCityLoading(false);
    }
  };

  const inputClassName = `
    w-full
    rounded-lg
    border
    border-emerald-900/10
    bg-white/80
    px-4
    py-3.5
    text-slate-900
    outline-none
    transition-all
    placeholder:text-slate-400
    focus:border-emerald-700
    focus:ring-4
    focus:ring-emerald-700/10
  `;

  const cardClassName = `
    rounded-lg
    border
    border-emerald-900/10
    bg-white/75
    p-6
    shadow-sm
    backdrop-blur-xl
    sm:p-8
  `;

  const primaryButtonClassName = `
    inline-flex
    items-center
    justify-center
    gap-3
    rounded-lg
    bg-emerald-800
    px-5
    py-3.5
    font-semibold
    text-white
    shadow-sm
    transition-all
    hover:bg-emerald-700
    disabled:cursor-not-allowed
    disabled:opacity-60
    cursor-pointer
  `;

  return (
    <div className="px-3 py-4 sm:px-5 lg:px-8">

      {/* HEADER */}

      <div
        className="
          mx-auto
          max-w-6xl
          flex
          flex-col
          gap-4
          mb-6
        "
      >
        <div>
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800">
            {t("account")}
          </span>

          <h1
            className="
              mt-4
              text-3xl
              font-black
              leading-tight
              text-slate-950
              sm:text-5xl
            "
          >
            {t("settings")}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">{t("manageProfile")}</p>
        </div>
      </div>

      <div
        className="
          mx-auto
          max-w-6xl
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
          mb-10
        "
      >

        <div
          className="
            xl:col-span-3
            overflow-hidden
            rounded-lg
            bg-[radial-gradient(circle_at_top_right,_rgba(104,219,169,0.35),_transparent_36%),linear-gradient(135deg,_#006948,_#002114)]
            p-6
            text-white
            shadow-xl
            sm:p-8
          "
        >

          <div
            className="
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div
                className="
                  h-20
                  w-20
                  shrink-0
                  rounded-lg
                  bg-white
                  flex
                  items-center
                  justify-center
                  text-3xl
                  font-black
                  text-emerald-800
                  shadow-lg
                "
              >
                {formData.name
                  ?.charAt(0)
                  ?.toUpperCase() || "F"}
              </div>

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">{t("accountOverview")}</p>

                <h2 className="mt-1 py-1 text-3xl font-black">
                  {formData.name ||
                    t("farmer")}
                </h2>

                <p className="text-emerald-100">
                  {formData.phone ||
                    t("noPhoneNumber")}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                    {t("waterRate")}: {formData.waterRate || "-"}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                    {t("weatherCity")}: {formData.city || "-"}
                  </span>
                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={logoutHandler}
              className="
                flex
                items-center
                justify-center
                gap-3
                rounded-lg
                border
                border-white/15
                bg-white/10
                px-5
                py-3.5
                font-semibold
                text-white
                transition-all
                hover:bg-red-600
                cursor-pointer
              "
            >
              <FaSignOutAlt />
              {t("logout")}
            </button>

          </div>

        </div>

        <form
          onSubmit={updateProfile}
          className={`xl:col-span-2 ${cardClassName}`}
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <FaUser />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950 py-1">{t("profileDetails")}</h2>

              <p className="text-slate-500 text-sm">{t("namePhoneUpdate")}</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">{t("fullName")}</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClassName}
                placeholder={t("enterFullName")}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">{t("phoneNumber")}</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClassName}
                placeholder={t("enterPhoneNumber")}
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className={`mt-6 ${primaryButtonClassName}`}
          >
            <FaSave />
            {profileLoading
              ? t("saving")
              : t("saveProfile")}
          </button>

        </form>

        <form
          onSubmit={updateWaterRate}
          className={cardClassName}
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <FaTint />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950 py-1">{t("waterRate")}</h2>

              <p className="text-slate-500 text-sm">{t("appliedFutureEntries")}</p>
            </div>

          </div>

          <label className="block mb-2 text-sm font-semibold text-slate-700">{t("ratePerHour")}</label>

          <input
            type="number"
            name="waterRate"
            value={formData.waterRate}
            onChange={handleChange}
            className={inputClassName}
            placeholder={t("enterWaterRate")}
          />

          <button
            type="submit"
            disabled={waterRateLoading}
            className={`mt-6 w-full ${primaryButtonClassName}`}
          >
            {waterRateLoading
              ? t("saving")
              : t("updateRate")}
          </button>

        </form>

        <form
          onSubmit={updateCity}
          className={`xl:col-span-3 ${cardClassName}`}
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <FaCity />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950 py-1">{t("weatherCity")}</h2>

              <p className="text-slate-500 text-sm">{t("dashboardWeatherCard")}</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
                className={inputClassName}
              placeholder={t("enterCity")}
            />

            <button
              type="submit"
              disabled={cityLoading}
              className={primaryButtonClassName}
            >
              {cityLoading
                ? t("saving")
                : t("updateCity")}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Settings;

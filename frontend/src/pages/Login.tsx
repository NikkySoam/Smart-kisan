import { useTranslation } from "react-i18next";
import { useState } from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

import {
  useNavigate,
  Link,
} from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      phone: "",
      pin: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.success(t("loginSuccessful"));

      navigate("/dashboard");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          t("loginFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        justify-center
        items-center
        px-4
        bg-[#f8f9ff]
        relative
        overflow-hidden
      "
    >
      <div className="absolute right-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl"></div>
      <div className="absolute bottom-[-10rem] left-[-10rem] h-80 w-80 rounded-full bg-blue-100/80 blur-3xl"></div>

      <div
        className="
          relative
          w-full
          max-w-[420px]
          bg-white/80
          backdrop-blur-xl
          border
          border-emerald-900/10
          rounded-lg
          shadow-xl
          p-6
          sm:p-8
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-800 py-2">{t("appName")}</h1>

          <p className="text-slate-600 mt-2 text-sm sm:text-base">{t("loginToContinue")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="text-slate-700 text-sm block mb-3 font-semibold">{t("phoneNumber")}</label>

            <input
              type="text"
              name="phone"
              placeholder={t("enterPhoneNumber")}
              className="
                w-full
                p-3
                rounded-lg
                bg-white/90
                border
                border-emerald-900/10
                outline-none
                text-slate-900
                focus:ring-2
                focus:ring-emerald-700/20
                transition-all
              "
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm block mb-3 font-semibold">{t("pin")}</label>

            <input
              type="password"
              name="pin"
              placeholder={t("enterPin")}
              className="
                w-full
                p-3
                rounded-lg
                bg-white/90
                border
                border-emerald-900/10
                outline-none
                text-slate-900
                focus:ring-2
                focus:ring-emerald-700/20
                transition-all
              "
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-emerald-800
              hover:bg-emerald-700
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-all
              duration-300
              text-white
              font-semibold
              p-3
              rounded-lg
              text-base
              cursor-pointer
              mt-6
            "
          >{loading ? t("loading") : t("login")}</button>
        </form>

        <p className="text-center text-slate-600 mt-6 text-sm sm:text-base">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-emerald-800 font-semibold hover:text-emerald-700 transition-all"
          >{t("register")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

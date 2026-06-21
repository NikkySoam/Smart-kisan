import { useTranslation } from "react-i18next";
import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pin: "",
    confirmPin: "",
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

    try {
      if (formData.pin !== formData.confirmPin) {
        return toast.error(t("pinDoesNotMatch"));
      }

      setLoading(true);

      const res = await API.post(
        "/auth/register",
        {
          name: formData.name,
          phone: formData.phone,
          pin: formData.pin,
          confirmPin: formData.confirmPin,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.success(t("registrationSuccessful"));

      navigate("/dashboard");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          t("registrationFailed")
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
            sm:py-6
            sm:px-8
            mt-2
        "
        >
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-800 py-2">{t("appName")}</h1>

          <p className="text-slate-600 mt-1 text-sm sm:text-base">{t("createFarmerAccount")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-slate-700 text-sm block mb-2 font-semibold">{t("fullName")}</label>

            <input
              type="text"
              name="name"
              placeholder={t("enterYourName")}
              className="w-full p-3 rounded-lg bg-white/90 border border-emerald-900/10 outline-none text-slate-900 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm block mb-2 font-semibold">{t("phoneNumber")}</label>

            <input
              type="text"
              name="phone"
              placeholder={t("enterPhoneNumber")}
              className="w-full p-3 rounded-lg bg-white/90 border border-emerald-900/10 outline-none text-slate-900 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm block mb-2 font-semibold">{t("sixDigitPin")}</label>

            <input
              type="password"
              name="pin"
              placeholder={t("enterPin")}
              className="w-full p-3 rounded-lg bg-white/90 border border-emerald-900/10 outline-none text-slate-900 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm block mb-2 font-semibold">{t("confirmPin")}</label>

            <input
              type="password"
              name="confirmPin"
              placeholder={t("confirmPin")}
              className="w-full p-3 rounded-lg bg-white/90 border border-emerald-900/10 outline-none text-slate-900 focus:ring-2 focus:ring-emerald-700/20 transition-all"
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
          >
            {loading ? t("loading") : t("register")}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6 text-sm sm:text-base">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-emerald-800 font-semibold hover:text-emerald-700 transition-all"
          >{t("login")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

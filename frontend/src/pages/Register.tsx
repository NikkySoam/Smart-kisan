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

    try {
      if (formData.pin !== formData.confirmPin) {
        return toast.error(t("pinDoesNotMatch"));
      }

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
    }
  };

  return (
        <div
        className="
          min-h-screen
          bg-cover
          bg-center
          bg-no-repeat
          flex
          justify-center
          items-center
          px-4
        "
        style={{
            backgroundImage:
            "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop')",
        }}
        >
      <div className="absolute inset-0 bg-black/40"></div>

            <div
        className="
            relative
            w-full
            max-w-[420px]
            bg-white/15
            backdrop-blur-lg
            border
            border-white/20
            rounded-3xl
            shadow-2xl
            p-5
            sm:p-6
        "
        >
        <div className="text-center mb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-white py-2">{t("appName")}</h1>

          <p className="text-gray-200 mt-2 text-sm sm:text-base">{t("createFarmerAccount")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-white text-sm block mb-2">{t("fullName")}</label>

            <input
              type="text"
              name="name"
              placeholder={t("enterYourName")}
              className="w-full p-2.5 rounded-xl bg-white/90 outline-none text-black"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">{t("phoneNumber")}</label>

            <input
              type="text"
              name="phone"
              placeholder={t("enterPhoneNumber")}
              className="w-full p-2.5 rounded-xl bg-white/90 outline-none text-black"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">{t("sixDigitPin")}</label>

            <input
              type="password"
              name="pin"
              placeholder={t("enterPin")}
              className="w-full p-2.5 rounded-xl bg-white/90 outline-none text-black"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">{t("confirmPin")}</label>

            <input
              type="password"
              name="confirmPin"
              placeholder={t("confirmPin")}
              className="w-full p-2.5 rounded-xl bg-white/90 outline-none text-black"
              onChange={handleChange}
              required
            />
          </div>

          <button className="w-full bg-linear-to-r from-green-500 to-green-800  hover:from-green-600 hover:to-green-900 transition-all duration-300 text-white font-semibold p-2.5 rounded-xl text-base cursor-pointer">{t("register")}</button>
        </form>

        <p className="text-center text-gray-200 mt-6 text-sm sm:text-base">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-yellow-300 font-semibold"
          >{t("login")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

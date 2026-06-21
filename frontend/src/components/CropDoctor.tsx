import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCamera } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

import toast from "react-hot-toast";

import API from "../api/axios";


interface CropAnalysis {
  crop: string;
  problem: string;
  symptoms: string[];
  medicines: string[];
  advice: string[];
}

const CropDoctor = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string>("");

  const [loading, setLoading] =
  useState(false);

  const [result, setResult] =
  useState<CropAnalysis | null>(
    null
  );

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };


  const handleAnalyze =
    async () => {
        if (loading) return;

        try {
        if (!image) return;

        setLoading(true);

        const formData = new FormData();

        formData.append("image", image );

        const token = localStorage.getItem("token");

        const res = await API.post('/ai/detect-pest',
            formData,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":"multipart/form-data"
                },
            }
            );

        const aiData = res.data.data;

        const parsedResult: CropAnalysis = {
          crop: aiData?.crop || "",
          problem: aiData?.problem || "",
          symptoms: Array.isArray(aiData?.symptoms)
            ? aiData.symptoms
            : [],
          medicines: Array.isArray(aiData?.medicine)
            ? aiData.medicine
            : [],
          advice: Array.isArray(aiData?.advice)
            ? aiData.advice
            : [],
        };

        setResult(parsedResult);
        toast.success(t("analysisCompleted"));
      } catch (error) {
      
        toast.error(t("analysisFailed"));
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
        w-full
        max-w-6xl
        mx-auto
        p-3
        sm:px-5
      "
    >
      {/* HEADER */}

      <div
        className="
          rounded-3xl
          bg-linear-to-r
          from-green-500
          to-green-800
          p-4
          sm:p-6
          text-white
          shadow-xl
          flex
          items-start justify-between
        "
      >
       <div className="flex items-center gap-4">
        <GiPlantRoots
          className="
            text-4xl
            sm:text-5xl
          "
        />

        <div>
          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
            "
          >
            {t("cropDoctor")}
          </h1>

          <p
            className="
              text-green-100
              text-sm
              sm:text-base
              mt-2
            "
          >
            {t("cropDoctorUploadDescription")}
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          navigate("/crop-history")
        }
        className="
          cursor-pointer
          flex
          items-center
          gap-2

          bg-white/20
          hover:bg-white/30

          backdrop-blur-sm

          px-4
          py-2

          rounded-xl

          text-white
          text-sm
          sm:text-base

          transition-all
        "
      >
        <FaHistory />
        <span className="hidden sm:block">
          History
        </span>
      </button>
      </div>

      {/* UPLOAD CARD */}

      <div
        className="
          mt-6
          bg-white
          rounded-3xl
          shadow-lg
          p-5
          sm:p-8
        "
      >
        <label
          className="
            cursor-pointer
            flex
            flex-col
            items-center
            justify-center
            border-2
            border-dashed
            border-green-300
            rounded-3xl
            h-64
            sm:h-80
            overflow-hidden
          "
        >
          {preview ? (
            <img
              src={preview}
              alt={t("cropImage")}
              className="
                w-full
                h-full
                object-contain
              "
            />
          ) : (
            <>
              <FaCamera
                className="
                  text-5xl
                  text-green-600
                  mb-4
                "
              />

              <p
                className="
                  text-center
                  text-gray-600
                  px-4
                "
              >
                {t("tapToUploadCropImage")}
              </p>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={
              handleImageChange
            }
          />
        </label>

      
        <button
        onClick={handleAnalyze}
        disabled={
            !image || loading
        }
        className="
            mt-5
            w-full

            bg-linear-to-r
            from-green-500
            to-green-800

            text-white
            font-semibold

            py-4

            rounded-2xl

            transition-all

            hover:scale-[1.01]

            disabled:opacity-50
            disabled:cursor-not-allowed

            cursor-pointer
          "
        >
        {loading
            ? t("analyzing")
            : t("analyzeCrop")}
        </button>
      </div>

      {/* AI RESULT CARD */}

      <div
        className="
          mt-6
          bg-white
          rounded-3xl
          shadow-lg
          p-5
          sm:p-8
        "
      >
        <h2
          className="
            text-xl
            sm:text-2xl
            font-bold
            mb-5
          "
        >
          {t("analysisResult")}
        </h2>

        <div className="space-y-4">
          <div className="bg-green-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{t("crop")}</p>
            <p className="font-semibold">{result?.crop || "-"}</p>
          </div>

          <div className="bg-red-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{t("problem")}</p>
            <p className="font-semibold">{result?.problem || "-"}</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{t("symptoms")}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
              {result?.symptoms?.length ? (
                result.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{t("medicines")}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
              {result?.medicines?.length ? (
                result.medicines.map((medicine, index) => (
                  <li key={index}>{medicine}</li>
                ))
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{t("advice")}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
              {result?.advice?.length ? (
                result.advice.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDoctor;

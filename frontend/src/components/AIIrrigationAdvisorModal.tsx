import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import API from "../api/axios";
// import toast from "react-hot-toast";
import { FaTimes, FaSync, FaTint, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

interface AIIrrigationAdvisorModalProps {
  fieldId: string;
  fieldName: string;
  onClose: () => void;
}

interface AIResult {
  needsWater: boolean;
  urgency: string; // "Low", "Medium", "High", "Critical"
  recommendedWithinHours: number;
  waterRequirement: string;
  reason: string;
  recommendation: string;
  tips: string[];
}

interface WeatherSnapshot {
  temp: number;
  humidity: number;
  condition: string;
  windSpeed: number;
}

interface AdviceData {
  weatherSnapshot: WeatherSnapshot;
  aiResult: AIResult;
}

const AIIrrigationAdvisorModal = ({ fieldId, fieldName, onClose }: AIIrrigationAdvisorModalProps) => {
  // const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdviceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const fetchAdvice = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/irrigation/${fieldId}${forceRefresh ? "?refresh=true" : ""}`;
      const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setData(res.data.data);
      } else {
        setError("Failed to load advice.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "इस समय AI सलाह उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [fieldId]);

  const getUrgencyColor = (urgency: string, needsWater: boolean) => {
    if (!needsWater) return "bg-green-100 text-green-800 border-green-300";
    switch (urgency) {
      case "Critical":
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getUrgencyBadgeText = (urgency: string, needsWater: boolean) => {
    if (!needsWater) return "सिंचाई की आवश्यकता नहीं";
    switch (urgency) {
      case "Critical":
        return "तुरंत सिंचाई करें";
      case "High":
        return "जल्द सिंचाई करें";
      case "Medium":
        return "अगले 2 दिनों में सिंचाई करें";
      case "Low":
        return "सामान्य";
      default:
        return urgency;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-green-800 p-5 text-white flex justify-between items-center relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 opacity-10">
            <FaTint className="text-9xl -mt-4 -mr-4" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🌱</span> AI सिंचाई सलाह
            </h2>
            <p className="text-green-100 mt-1 opacity-90">{fieldName}</p>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-48 space-y-4">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium animate-pulse">AI आपके खेत का विश्लेषण कर रहा है...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl flex flex-col items-center text-center border border-red-100">
              <FaExclamationTriangle className="text-4xl mb-3 text-red-400" />
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => fetchAdvice(false)}
                className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold"
              >
                पुनः प्रयास करें
              </button>
            </div>
          ) : data && data.aiResult ? (
            <div className="space-y-6">
              
              {/* Weather & Urgency Summary */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getUrgencyColor(data.aiResult.urgency, data.aiResult.needsWater)}`}>
                    {getUrgencyBadgeText(data.aiResult.urgency, data.aiResult.needsWater)}
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{data.weatherSnapshot.temp}°C</span> | {data.weatherSnapshot.condition}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {data.aiResult.recommendation}
                </h3>
              </div>

              {/* Reason */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                  <FaInfoCircle /> कारण
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {data.aiResult.reason}
                </p>
              </div>

              {/* Tips */}
              {data.aiResult.tips && data.aiResult.tips.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 px-1">सुझाव</h4>
                  <div className="space-y-2">
                    {data.aiResult.tips.map((tip, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-start">
                        <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            सलाह केवल मार्गदर्शन के लिए है
          </p>
          <button 
            onClick={() => fetchAdvice(true)}
            disabled={loading}
            className="flex items-center gap-2 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-all font-semibold disabled:opacity-50 cursor-pointer text-sm"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            {loading ? "रिफ्रेश हो रहा है..." : "नया विश्लेषण"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIIrrigationAdvisorModal;

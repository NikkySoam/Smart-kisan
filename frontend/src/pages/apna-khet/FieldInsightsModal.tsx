import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldInsights } from '../../hooks/queries/useFieldInsightsQuery';
import { generateFieldInsightsPDF } from '../../utils/generateFieldInsightsPDF';



interface FieldInsightRecord {
  _id: string;
  name: string;
  crop: string;
  area: number;
  totalRevenue: number;
  totalExpense: number;
  waterExpense: number;
  fertilizerExpense: number;
  labourExpense: number;
  equipmentExpense: number;
  netProfit: number;
  profitPerArea: number;
}

interface FieldInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FieldInsightsModal: React.FC<FieldInsightsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { data: insightsData, isLoading } = useFieldInsights();
  const data: FieldInsightRecord[] = insightsData || [];
  const loading = isLoading;
  
  // Filters
  const [selectedCrop, setSelectedCrop] = useState("All");

  const cropsList = useMemo(() => {
    const crops = new Set<string>();
    data.forEach((f: FieldInsightRecord) => crops.add(f.crop));
    return Array.from(crops).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedCrop === "All") return data;
    return data.filter((f: FieldInsightRecord) => f.crop === selectedCrop);
  }, [data, selectedCrop]);

  const analytics = useMemo(() => {
    if (filteredData.length === 0) return null;

    let totalRevenue = 0;
    let totalExpenses = 0;
    
    let waterTotal = 0;
    let fertTotal = 0;
    let labourTotal = 0;
    let equipTotal = 0;

    const cropStats: Record<string, {count: number, revenue: number, expenses: number, profit: number}> = {};

    filteredData.forEach((f: FieldInsightRecord) => {
      totalRevenue += f.totalRevenue;
      totalExpenses += f.totalExpense;
      
      waterTotal += f.waterExpense;
      fertTotal += f.fertilizerExpense;
      labourTotal += f.labourExpense;
      equipTotal += f.equipmentExpense;

      if (!cropStats[f.crop]) cropStats[f.crop] = { count: 0, revenue: 0, expenses: 0, profit: 0 };
      cropStats[f.crop].count += 1;
      cropStats[f.crop].revenue += f.totalRevenue;
      cropStats[f.crop].expenses += f.totalExpense;
      cropStats[f.crop].profit += f.netProfit;
    });

    const netProfit = totalRevenue - totalExpenses;
    
    const leaderboard = [...filteredData].sort((a, b) => b.netProfit - a.netProfit);
    const bestField = leaderboard.length > 0 ? leaderboard[0] : null;
    const lowestField = leaderboard.length > 0 ? leaderboard[leaderboard.length - 1] : null;

    // Recommendations logic
    const recommendations: string[] = [];
    if (bestField && bestField.netProfit > 0) {
      recommendations.push(t("highestProfitRec", { name: bestField.name, crop: bestField.crop }));
    }
    
    if (lowestField && lowestField.netProfit < 0) {
      const dominantExpense = [
        { key: "labour", value: lowestField.labourExpense },
        { key: "water", value: lowestField.waterExpense },
        { key: "fertilizer", value: lowestField.fertilizerExpense },
        { key: "equipment", value: lowestField.equipmentExpense },
      ].sort((a, b) => b.value - a.value)[0];

      recommendations.push(t("lossRec", {
        name: lowestField.name,
        expType: t(dominantExpense.key),
      }));
    }

    if (fertTotal > totalRevenue * 0.4 && totalRevenue > 0) {
       recommendations.push(t("highFertilizerRec"));
    }

    return {
      overview: { totalFields: filteredData.length, totalRevenue, totalExpenses, netProfit },
      bestField,
      lowestField,
      leaderboard,
      expenses: { water: waterTotal, fertilizer: fertTotal, labour: labourTotal, equipment: equipTotal },
      cropStats,
      recommendations
    };
  }, [filteredData]);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    if (analytics) {
      generateFieldInsightsPDF(analytics);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-4 sm:p-6 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-slate-50 w-full max-w-6xl h-[95vh] rounded-4xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              {t("fieldInsightsTitle")}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{t("fieldInsightsDesc")}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All">{t("allCrops")}</option>
              {cropsList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button 
              onClick={handleDownloadPDF}
              disabled={!analytics || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {t("downloadPDF")}
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : !analytics ? (
             <div className="h-full flex items-center justify-center">
               <div className="text-center p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
                 <p className="text-slate-500">{t("noFieldData")}</p>
               </div>
             </div>
          ) : (
            <div className="space-y-6">
              
              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium">{t("totalFields")}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{analytics.overview.totalFields}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium">{t("totalRevenue")}</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium">{t("totalExpenses")}</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">₹{analytics.overview.totalExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute right-0 top-0 w-2 h-full ${analytics.overview.netProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm text-slate-500 font-medium">{t("netProfit")}</p>
                  <p className={`text-2xl font-bold mt-1 ${analytics.overview.netProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    ₹{analytics.overview.netProfit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best / Lowest */}
                <div className="flex flex-col gap-4">
                  {analytics.bestField && (
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-100 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🏆</span>
                          <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">{t("topPerformer")}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{analytics.bestField.name}</h3>
                        <p className="text-sm text-slate-600">{t("crop")}: {analytics.bestField.crop}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">{t("netProfit")}</p>
                        <p className="text-2xl font-black text-green-600">₹{analytics.bestField.netProfit.toLocaleString()}</p>
                        {analytics.bestField.area > 0 && (
                          <p className="text-xs text-green-700 mt-1 font-medium">₹{analytics.bestField.profitPerArea.toFixed(2)}{t("unitArea")}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {analytics.lowestField && (
                    <div className="bg-linear-to-br from-red-50 to-rose-50 p-6 rounded-3xl border border-red-100 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">⚠️</span>
                          <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">{t("needsAttention")}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{analytics.lowestField.name}</h3>
                        <p className="text-sm text-slate-600">{t("crop")}: {analytics.lowestField.crop}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">{t("netProfitLoss")}</p>
                        <p className={`text-2xl font-black ${analytics.lowestField.netProfit < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                          ₹{analytics.lowestField.netProfit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    {t("smartRecommendations")}
                  </h3>
                  {analytics.recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">{t("noRecommendations")}</p>
                  )}
                </div>
              </div>

              {/* Leaderboard & Expenses */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Leaderboard */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("fieldLeaderboard")}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
                          <th className="py-3 font-semibold">{t("rank")}</th>
                          <th className="py-3 font-semibold">{t("field")}</th>
                          <th className="py-3 font-semibold">{t("crop")}</th>
                          <th className="py-3 font-semibold text-right">{t("netProfit")}</th>
                          <th className="py-3 font-semibold text-right">{t("profitPerArea")}</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {analytics.leaderboard.map((field, idx) => (
                          <tr key={field._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-3">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="text-slate-400 font-mono ml-1">#{idx + 1}</span>}
                            </td>
                            <td className="py-3 font-medium text-slate-700">{field.name}</td>
                            <td className="py-3 text-slate-500">{field.crop}</td>
                            <td className={`py-3 text-right font-bold ${field.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              ₹{field.netProfit.toLocaleString()}
                            </td>
                            <td className="py-3 text-right text-slate-500">
                              {field.area > 0 ? `₹${field.profitPerArea.toFixed(2)}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expenses Breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("expenseBreakdown")}</h3>
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    
                    {[
                      { label: t("water"), value: analytics.expenses.water, color: "bg-blue-400" },
                      { label: t("fertilizer"), value: analytics.expenses.fertilizer, color: "bg-emerald-400" },
                      { label: t("labour"), value: analytics.expenses.labour, color: "bg-amber-400" },
                      { label: t("equipment"), value: analytics.expenses.equipment, color: "bg-purple-400" },
                    ].map(item => {
                      const percentage = analytics.overview.totalExpenses > 0 
                        ? (item.value / analytics.overview.totalExpenses) * 100 
                        : 0;
                        
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1 text-slate-600 font-medium">
                            <span>{item.label}</span>
                            <span>₹{item.value.toLocaleString()} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>

              </div>

              {/* Crop Profitability */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("cropProfitability")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Object.entries(analytics.cropStats).map(([crop, stats]) => (
                    <div key={crop} className="border border-slate-100 bg-slate-50 p-4 rounded-2xl flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-700 flex items-center gap-1">🌾 {crop}</h4>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">{stats.count} {t("fieldsCount")}</span>
                      </div>
                      
                      <div className="space-y-1 mt-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">{t("revenue")}</span>
                          <span className="font-medium text-slate-700">₹{stats.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">{t("expenses")}</span>
                          <span className="font-medium text-slate-700">₹{stats.expenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 mt-1 border-t border-slate-200">
                          <span className="font-bold text-slate-600">{t("profit")}</span>
                          <span className={`font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            ₹{stats.profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldInsightsModal;

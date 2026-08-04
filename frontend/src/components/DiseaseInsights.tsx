import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export interface CropScanInterface {
  _id: string;
  imageUrl: string;
  crop: string;
  problem: string;
  symptoms: string[];
  medicine: string[];
  advice: string[];
  createdAt: string;
}

interface DiseaseInsightsProps {
  scans: CropScanInterface[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DiseaseInsights: React.FC<DiseaseInsightsProps> = ({ scans }) => {
  const { t } = useTranslation();
  // State for filters
  const [selectedCrop, setSelectedCrop] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedDisease, setSelectedDisease] = useState<string>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const crops = new Set<string>();
    const years = new Set<string>();
    const diseases = new Set<string>();
    const months = new Set<string>();

    scans.forEach((scan) => {
      if (scan.crop) crops.add(scan.crop);
      if (scan.problem) diseases.add(scan.problem);
      if (scan.createdAt) {
        const d = new Date(scan.createdAt);
        if (!isNaN(d.getTime())) {
          years.add(d.getFullYear().toString());
          months.add(MONTHS[d.getMonth()]);
        }
      }
    });

    return {
      crops: Array.from(crops).sort(),
      years: Array.from(years).sort((a, b) => b.localeCompare(a)),
      diseases: Array.from(diseases).sort(),
      months: MONTHS.filter(m => months.has(m)),
    };
  }, [scans]);

  // Apply filters
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const d = new Date(scan.createdAt);
      const isDateValid = !isNaN(d.getTime());
      
      const matchCrop = selectedCrop === "All" || scan.crop === selectedCrop;
      const matchYear = selectedYear === "All" || (isDateValid && d.getFullYear().toString() === selectedYear);
      const matchDisease = selectedDisease === "All" || scan.problem === selectedDisease;
      const matchMonth = selectedMonth === "All" || (isDateValid && MONTHS[d.getMonth()] === selectedMonth);

      return matchCrop && matchYear && matchDisease && matchMonth;
    });
  }, [scans, selectedCrop, selectedYear, selectedDisease, selectedMonth]);

  // Analytics Calculations
  const analytics = useMemo(() => {
    if (filteredScans.length === 0) return null;

    // 1. Top Diseases
    const diseaseCounts: Record<string, number> = {};
    filteredScans.forEach(scan => {
      if (!scan.problem || scan.problem === "Unable to Identify") return;
      diseaseCounts[scan.problem] = (diseaseCounts[scan.problem] || 0) + 1;
    });

    const topDiseases = Object.entries(diseaseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / filteredScans.length) * 100)
      }));

    // 2. Sensitive Months
    const diseaseMonths: Record<string, Record<string, number>> = {};
    filteredScans.forEach(scan => {
      if (!scan.problem || scan.problem === "Unable to Identify") return;
      const d = new Date(scan.createdAt);
      if (isNaN(d.getTime())) return;
      
      const month = MONTHS[d.getMonth()];
      if (!diseaseMonths[scan.problem]) diseaseMonths[scan.problem] = {};
      diseaseMonths[scan.problem][month] = (diseaseMonths[scan.problem][month] || 0) + 1;
    });

    const sensitiveMonths = Object.entries(diseaseMonths).map(([disease, monthsMap]) => {
      const topMonths = Object.entries(monthsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([m]) => m);
      return { disease, topMonths, monthsMap };
    });

    // 3. Crop-wise Statistics
    const cropStats: Record<string, Record<string, number>> = {};
    filteredScans.forEach(scan => {
      if (!scan.crop || !scan.problem || scan.problem === "Unable to Identify") return;
      if (!cropStats[scan.crop]) cropStats[scan.crop] = {};
      cropStats[scan.crop][scan.problem] = (cropStats[scan.crop][scan.problem] || 0) + 1;
    });

    // 4. Monthly Distribution (for charts)
    const monthlyDistribution = MONTHS.map(month => {
      let count = 0;
      filteredScans.forEach(scan => {
        const d = new Date(scan.createdAt);
        if (!isNaN(d.getTime()) && MONTHS[d.getMonth()] === month) count++;
      });
      return { month, count };
    });
    const maxMonthlyCount = Math.max(...monthlyDistribution.map(m => m.count), 1);

    // 5. Timeline
    const timeline = [...filteredScans]
      .filter(s => s.problem && s.problem !== "Unable to Identify")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5); // Just show the latest 5 for a brief timeline

    return {
      topDiseases,
      sensitiveMonths,
      cropStats,
      monthlyDistribution,
      maxMonthlyCount,
      timeline
    };
  }, [filteredScans]);

  // Prediction & AI Suggestions logic
  const predictionsAndSuggestions = useMemo(() => {
    if (!analytics || analytics.topDiseases.length === 0) return null;
    
    const topDisease = analytics.topDiseases[0].name;
    const sensitiveMonthData = analytics.sensitiveMonths.find(sm => sm.disease === topDisease);
    const topMonth = sensitiveMonthData?.topMonths[0];
    
    // Find a crop that frequently has this disease
    let associatedCrop = "";
    let highestCount = 0;
    Object.entries(analytics.cropStats).forEach(([crop, diseases]) => {
      if (diseases[topDisease] && diseases[topDisease] > highestCount) {
        highestCount = diseases[topDisease];
        associatedCrop = crop;
      }
    });

    if (topMonth && associatedCrop) {
      // Calculate previous month for preventive measures
      const monthIndex = MONTHS.indexOf(topMonth);
      const prevMonth = monthIndex === 0 ? "December" : MONTHS[monthIndex - 1];

      return {
        seasonalAlert: `Based on previous records, ${topDisease} frequently affects ${associatedCrop} during ${topMonth}. Prepare preventive measures before ${topMonth}.`,
        aiSuggestion: `Your ${associatedCrop} crop has repeatedly suffered from ${topDisease} around ${topMonth}. Before ${topMonth} next season:\n• Inspect leaves weekly.\n• Avoid excessive irrigation.\n• Apply preventive fungicide.\n• Remove infected plants immediately.`,
        prediction: `There is a high chance of ${topDisease} appearing again during ${topMonth}. Take preventive measures in ${prevMonth}.`
      };
    }
    return null;
  }, [analytics]);

  if (scans.length < 3) {
    return (
      <div className="bg-green-50 rounded-3xl border border-green-200 p-8 text-center shadow-sm mb-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">{t("diseaseInsightsTitle")}</h2>
        <p className="text-green-700">
          {t("noHistoricalData")}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            {t("diseaseInsightsTitle")}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select 
            value={selectedCrop} 
            onChange={e => setSelectedCrop(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-green-500"
          >
            <option value="All">{t("allCrops")}</option>
            {filterOptions.crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-green-500"
          >
            <option value="All">{t("allYears")}</option>
            {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={selectedDisease} 
            onChange={e => setSelectedDisease(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-green-500"
          >
            <option value="All">{t("allDiseases")}</option>
            {filterOptions.diseases.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-green-500"
          >
            <option value="All">{t("allMonths")}</option>
            {filterOptions.months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {!analytics ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <p className="text-gray-500">No data matches the selected filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Top 3 Most Common Diseases */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("mostCommonDiseases")}</h3>
              {analytics.topDiseases.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topDiseases.map((d, idx) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-700 flex items-center gap-2">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '•'} {d.name}
                        </p>
                        <p className="text-xs text-slate-500">{t("detectedNTimes", { count: d.count })}</p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {d.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No disease data found.</p>
              )}
            </div>

            {/* Card 2: Sensitive Months */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("sensitiveMonths")}</h3>
              {analytics.sensitiveMonths.slice(0, 3).length > 0 ? (
                <div className="space-y-4">
                  {analytics.sensitiveMonths.slice(0, 3).map((sm) => (
                    <div key={sm.disease}>
                      <p className="font-semibold text-sm text-slate-700 mb-1">{sm.disease}</p>
                      <div className="flex flex-wrap gap-2">
                        {sm.topMonths.map(m => (
                          <span key={m} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-lg border border-red-100">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No monthly data available.</p>
              )}
            </div>

            {/* Card 3: Crop-wise Statistics */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("cropWiseStats")}</h3>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {Object.entries(analytics.cropStats).length > 0 ? (
                  Object.entries(analytics.cropStats).map(([crop, diseases]) => (
                    <div key={crop}>
                      <p className="font-semibold text-slate-700 flex items-center gap-1">🌾 {crop}</p>
                      <ul className="text-sm text-slate-600 mt-1 space-y-1">
                        {Object.entries(diseases).map(([disease, count]) => (
                          <li key={disease} className="flex justify-between border-b border-slate-50 pb-1">
                            <span>{disease}</span>
                            <span className="font-medium text-slate-400">{count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                   <p className="text-sm text-slate-500">No crop data found.</p>
                )}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Left Column: Alerts & Suggestions */}
            <div className="lg:col-span-2 space-y-6">
              {predictionsAndSuggestions && (
                <>
                  <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 shadow-sm hover:-translate-y-1 transition-transform">
                    <h3 className="font-bold text-lg text-amber-800 mb-2 flex items-center gap-2">
                      ⚠️ {t("seasonalAlert")}
                    </h3>
                    <p className="text-amber-700">{predictionsAndSuggestions.seasonalAlert}</p>
                  </div>

                  <div className="bg-green-50 rounded-3xl border border-green-200 p-6 shadow-sm hover:-translate-y-1 transition-transform">
                    <h3 className="font-bold text-lg text-green-800 mb-3 flex items-center gap-2">
                      💡 Smart AI Suggestions
                    </h3>
                    <p className="text-green-700 mb-3 whitespace-pre-line leading-relaxed">
                      {predictionsAndSuggestions.aiSuggestion}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6 shadow-sm hover:-translate-y-1 transition-transform">
                    <h3 className="font-bold text-lg text-blue-800 mb-2 flex items-center gap-2">
                      🔮 {t("futurePrediction")}
                    </h3>
                    <p className="text-blue-700">{predictionsAndSuggestions.prediction}</p>
                  </div>
                </>
              )}

              {/* Monthly Disease Distribution Chart */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Monthly Disease Distribution</h3>
                <div className="space-y-3">
                  {analytics.monthlyDistribution.map((md) => {
                    if (md.count === 0) return null;
                    const widthPercent = (md.count / analytics.maxMonthlyCount) * 100;
                    return (
                      <div key={md.month} className="flex items-center gap-3 text-sm">
                        <div className="w-10 text-right text-slate-500 font-medium">{md.month.substring(0, 3)}</div>
                        <div className="flex-1 h-6 bg-slate-100 rounded-r-full overflow-hidden flex items-center">
                          <div 
                            className="h-full bg-green-500 rounded-r-full transition-all duration-500 ease-out flex items-center justify-end pr-2 text-xs font-bold text-white shadow-inner"
                            style={{ width: `${Math.max(widthPercent, 5)}%` }}
                          >
                            {md.count > 0 ? md.count : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">{t("diseaseTimeline")}</h3>
              <div className="space-y-0">
                {analytics.timeline.length > 0 ? (
                  analytics.timeline.map((scan, idx) => {
                    const d = new Date(scan.createdAt);
                    const monthYear = !isNaN(d.getTime()) ? `${MONTHS[d.getMonth()]} ${d.getFullYear()}` : 'Unknown Date';
                    
                    return (
                      <div key={scan._id} className="relative pl-6 pb-6 last:pb-0">
                        {/* Timeline line */}
                        {idx !== analytics.timeline.length - 1 && (
                          <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-slate-200"></div>
                        )}
                        {/* Timeline dot */}
                        <div className="absolute left-[3px] top-1.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
                        
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 mb-1">{monthYear}</p>
                          <p className="text-sm font-semibold text-slate-700">{scan.problem}</p>
                          <p className="text-xs text-slate-500">on {scan.crop}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No recent records to show.</p>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default DiseaseInsights;

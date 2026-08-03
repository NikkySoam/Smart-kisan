import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { cacheWaterStats } from "../../utils/cacheWaterStats";
import { getCachedWaterStats } from "../../utils/getCachedWaterStats";
import { cacheFarmers } from "../../utils/cacheFarmers";
import { getCachedFarmers } from "../../utils/getCachedFarmers";
import { saveOfflineWater } from "../../utils/saveOfflineWater";

import AnalyticsChart from "../../components/AnalyticsChart";
import API from "../../api/axios";

import {
  FaTint,
  FaSearch,
  FaCalendarAlt,
  FaSortAmountDown,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaBoxOpen,
  FaUsers,
  FaDownload
} from "react-icons/fa";

import generateFarmerReportPDF from "../../utils/generateFarmerReportPDF";
import type { FarmerReportData } from "../../utils/generateFarmerReportPDF";

interface Stats {
  totalFarmers: number;
  totalEntries: number;
  totalHours: number;
  totalEarnings: number;
  waterRate: number;
  topConsumer?: {
    farmerName: string;
    totalHours: number;
    totalAmount: number;
    entries: number;
  } | null;
}

interface Farmer {
  _id: string;
  name: string;
  phone?: string;
  village?: string;
}

interface WaterEntry {
  _id: string;
  farmer: {
    _id: string;
    name: string;
  };
  hours: number;
  totalAmount: number;
  date: string;
  waterRate?: number;
  notes?: string;
}

const INITIAL_VISIBLE_ENTRIES = 15;

const WaterManagement = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // LOADING STATES
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // DATA STATES
  const [stats, setStats] = useState<Stats>({
    totalFarmers: 0,
    totalEntries: 0,
    totalHours: 0,
    totalEarnings: 0,
    waterRate: 0,
    topConsumer: null,
  });
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [entries, setEntries] = useState<WaterEntry[]>([]);

  // RATE EDIT STATE
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [newRate, setNewRate] = useState("");
  const [rateLoading, setRateLoading] = useState(false);

  // ADD FORM STATE
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmer: "",
    hours: "",
    date: new Date().toISOString().split("T")[0],
  });

  // EDIT ENTRY STATE
  const [editModal, setEditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editFormData, setEditFormData] = useState({
    farmer: "",
    hours: "",
    date: "",
  });

  // FILTER & SORT STATE
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', '7days', '30days'
  const [sortType, setSortType] = useState("latest"); // 'latest', 'oldest', 'highest'
  const [visibleEntriesCount, setVisibleEntriesCount] = useState(INITIAL_VISIBLE_ENTRIES);

  // SUMMARY MODAL STATE
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summarySearch, setSummarySearch] = useState("");

  // EDIT FARMER STATE
  const [editFarmerModal, setEditFarmerModal] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [updatingFarmer, setUpdatingFarmer] = useState(false);
  const [editFarmerData, setEditFarmerData] = useState({
    name: "",
    phone: ""
  });
  // --- DATA FETCHING ---
  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.data);
      await cacheWaterStats(res.data.data);
    } catch {
      const cached = await getCachedWaterStats();
      if (cached) setStats(cached);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchFarmers = async () => {
    if (!navigator.onLine) {
      const cached = await getCachedFarmers();
      setFarmers(cached);
      return;
    }
    try {
      const res = await API.get("/farmers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data.data);
      await cacheFarmers(res.data.data);
    } catch {
      const cached = await getCachedFarmers();
      setFarmers(cached);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await API.get("/water", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFarmers();
    fetchEntries();
  }, []);

  // --- HANDLERS ---
  const handleUpdateRate = async () => {
    const rateNum = Number(newRate);
    if (!newRate || rateNum <= 0) {
      toast.error(t("enterValidRate") || "Enter a valid positive number");
      return;
    }
    setRateLoading(true);
    try {
      await API.put(
        "/settings/water-rate",
        { waterRate: rateNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("waterRateUpdated") || "Water rate updated successfully");
      setStats((prev) => ({ ...prev, waterRate: rateNum }));
      cacheWaterStats({ ...stats, waterRate: rateNum });
      setIsEditingRate(false);
    } catch (error) {
      toast.error(t("waterRateUpdateFailed") || "Failed to update water rate");
    } finally {
      setRateLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (!navigator.onLine) {
        await saveOfflineWater(formData);
        toast.success("Saved Offline");
        setFormData({ farmer: "", hours: "", date: new Date().toISOString().split("T")[0] });
        return;
      }
      await API.post("/water", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("waterEntryAdded"));
      setFormData({ farmer: "", hours: "", date: new Date().toISOString().split("T")[0] });
      await fetchEntries();
      await fetchStats(); // Refresh dashboard stats
    } catch (error) {
      toast.error(t("entryAddFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntryHandler = async (id: string) => {
    if (!window.confirm(t("deleteEntryConfirm"))) return;
    if (deletingId) return;
    setDeletingId(id);
    try {
      await API.delete(`/water/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("entryDeleted"));
      await fetchEntries();
      await fetchStats();
    } catch (error) {
      toast.error(t("entryDeleteFailed"));
    } finally {
      setDeletingId("");
    }
  };

  const updateEntryHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      await API.put(`/water/${selectedEntry._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("entryUpdated"));
      setEditModal(false);
      await fetchEntries();
      await fetchStats();
    } catch (error) {
      toast.error(t("entryUpdateFailed"));
    } finally {
      setUpdating(false);
    }
  };

  const deleteFarmerHandler = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this farmer? All their water entries will also be permanently deleted.")) return;
    try {
      await API.delete(`/farmers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Farmer and associated entries deleted");
      await fetchFarmers();
      await fetchEntries();
      await fetchStats();
    } catch (error) {
      toast.error("Failed to delete farmer");
    }
  };

  const updateFarmerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingFarmer || !selectedFarmerId) return;
    setUpdatingFarmer(true);
    try {
      await API.put(`/farmers/${selectedFarmerId}`, editFarmerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Farmer updated successfully");
      setEditFarmerModal(false);
      await fetchFarmers();
      await fetchStats();
    } catch (error) {
      toast.error("Failed to update farmer");
    } finally {
      setUpdatingFarmer(false);
    }
  };

  const openEditFarmerModal = (farmer: any) => {
    setSelectedFarmerId(farmer._id);
    setEditFarmerData({
      name: farmer.name,
      phone: farmer.phone || ""
    });
    setEditFarmerModal(true);
  };

  const openEditModal = (entry: any) => {
    setSelectedEntry(entry);
    setEditFormData({
        farmer: entry.farmer._id,
        hours: entry.hours,
        date: entry.date.split("T")[0],
    });
    setEditModal(true);
  };

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    // Search
    if (search) {
      result = result.filter((e) =>
        e.farmer?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Date Filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((e) => {
        const entryDate = new Date(e.date);
        const diffTime = Math.abs(now.getTime() - entryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (dateFilter === "today") return diffDays <= 1;
        if (dateFilter === "7days") return diffDays <= 7;
        if (dateFilter === "30days") return diffDays <= 30;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortType === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortType === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortType === "highest") {
        return b.hours - a.hours;
      }
      return 0;
    });

    return result;
  }, [entries, search, dateFilter, sortType]);

  const visibleEntries = filteredAndSortedEntries.slice(0, visibleEntriesCount);
  const hasMoreEntries = visibleEntriesCount < filteredAndSortedEntries.length;

  // --- SUMMARY MODAL LOGIC ---
  const farmerSummaries = useMemo<FarmerReportData[]>(() => {
    let result = farmers.map((farmer) => {
      const farmerEntries = entries.filter((e) => e.farmer?._id === farmer._id);
      const totalHours = farmerEntries.reduce((acc, curr) => acc + curr.hours, 0);
      const totalAmount = farmerEntries.reduce((acc, curr) => acc + curr.totalAmount, 0);
      return {
        farmer: { _id: farmer._id, name: farmer.name, phone: farmer.phone },
        totalHours,
        totalAmount,
        totalEntries: farmerEntries.length,
        entries: farmerEntries.map(e => ({
          ...e,
          waterRate: e.waterRate,
          notes: e.notes
        }))
      };
    }).filter(s => s.totalEntries > 0 || stats.totalFarmers > 0);

    if (summarySearch) {
      result = result.filter(s => s.farmer.name.toLowerCase().includes(summarySearch.toLowerCase()));
    }

    return result;
  }, [farmers, entries, stats.totalFarmers, summarySearch]);

  // --- RENDER HELPERS ---
  const renderSkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 animate-pulse">
      <div className="h-4 bg-emerald-100 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-emerald-100 rounded w-3/4"></div>
    </div>
  );

  const inputClass = "w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-emerald-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 flex items-center gap-3">
            <FaTint className="text-emerald-500" /> {t("waterManagement")}
          </h1>
          <p className="text-emerald-700/70 font-medium">
            Manage irrigation records and water costs.
          </p>
        </div>
        <button
          onClick={() => setShowSummaryModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl font-bold transition-colors cursor-pointer"
        >
          <FaUsers /> Farmer Statistics
        </button>
      </div>

      {/* SECTION 1: DASHBOARD SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {loadingStats ? (
          <>
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
            {renderSkeletonCard()}
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow group">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">{t("totalFarmers")}</h2>
              <p className="text-3xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">{stats.totalFarmers}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow group">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">{t("waterEntries")}</h2>
              <p className="text-3xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">{stats.totalEntries}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow group">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">{t("totalHours")}</h2>
              <p className="text-3xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">{stats.totalHours}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow group">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">{t("earnings")}</h2>
              <p className="text-3xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">₹{stats.totalEarnings}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow flex flex-col justify-between group">
              <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Top Consumer</h2>
              {stats.topConsumer ? (
                <div>
                  <p className="text-lg font-bold text-emerald-950 truncate" title={stats.topConsumer.farmerName}>
                    {stats.topConsumer.farmerName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">💧 {stats.topConsumer.totalHours}h</span>
                    <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">💰 ₹{stats.topConsumer.totalAmount}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-emerald-400 font-medium">No Data Available</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* SECTION 2: WATER RATE WIDGET */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <FaTint className="text-2xl" />
          </div>
          <div>
            <p className="text-emerald-600 font-medium text-sm">{t("waterRate")}</p>
            {isEditingRate ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-900 font-bold">₹</span>
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-24 bg-slate-50 border border-emerald-200 rounded-lg px-2 py-1 text-xl font-bold text-emerald-950 outline-none focus:border-emerald-500 transition-all"
                  min="1"
                  autoFocus
                />
                <span className="text-slate-500 text-sm">/ Hour</span>
              </div>
            ) : (
              <p className="text-2xl font-black text-emerald-950 mt-1">
                ₹{loadingStats ? "..." : stats.waterRate} <span className="text-base font-normal text-slate-500">/ Hour</span>
              </p>
            )}
          </div>
        </div>
        <div>
          {isEditingRate ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleUpdateRate}
                disabled={rateLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={() => setIsEditingRate(false)}
                disabled={rateLoading}
                className="flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                title="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setNewRate(stats.waterRate.toString()); setIsEditingRate(true); }} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              <FaEdit /> Edit Rate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* SECTION 3: ADD WATER ENTRY FORM */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 sm:p-8 xl:sticky xl:top-6">
            <h2 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
              <FaPlus className="text-emerald-500" /> {t("addWaterEntry")}
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2">{t("farmer")}</label>
                <select
                  name="farmer"
                  value={formData.farmer}
                  onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>{t("selectFarmer")}</option>
                  {farmers.map((f) => (
                    <option key={f._id} value={f._id}>{f.name} {f.village ? `(${f.village})` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2">{t("hours")}</label>
                <input
                  type="number"
                  name="hours"
                  placeholder="e.g. 2.5"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className={inputClass}
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2">{t("date")}</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {submitting ? t("saving") : t("addEntry")}
              </button>
            </form>
          </div>
        </div>

        {/* SECTION 4 & 5: HISTORY TABLE & FILTERS */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* SEARCH & FILTER TOOLBAR */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4 sm:p-5 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                placeholder="Search farmer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-950 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all placeholder:text-emerald-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:w-auto">
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-auto pl-11 pr-8 py-2.5 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-900 font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
              <div className="relative">
                <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="w-full sm:w-auto pl-11 pr-8 py-2.5 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-900 font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] relative">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-emerald-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-emerald-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-emerald-900 text-sm">{t("farmer")}</th>
                    <th className="px-6 py-4 font-semibold text-emerald-900 text-sm">{t("date")}</th>
                    <th className="px-6 py-4 font-semibold text-emerald-900 text-sm">{t("hours")}</th>
                    <th className="px-6 py-4 font-semibold text-emerald-900 text-sm">{t("totalAmount")}</th>
                    <th className="px-6 py-4 font-semibold text-emerald-900 text-sm text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {loadingEntries ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-emerald-100 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-emerald-100 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-emerald-100 rounded w-12"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-emerald-100 rounded w-16"></div></td>
                        <td className="px-6 py-4 text-right"><div className="h-8 bg-emerald-100 rounded w-32 inline-block"></div></td>
                      </tr>
                    ))
                  ) : visibleEntries.length > 0 ? (
                    visibleEntries.map((item, idx) => (
                      <tr key={item._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/40 transition-colors group`}>
                        <td className="px-6 py-4 font-bold text-emerald-950">{item.farmer?.name}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">{item.hours} h</td>
                        <td className="px-6 py-4 font-bold text-emerald-700">₹{item.totalAmount}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                            <button
                              disabled={!!deletingId || updating || submitting}
                              onClick={() => openEditModal(item)}
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              disabled={!!deletingId || updating || submitting}
                              onClick={() => deleteEntryHandler(item._id)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              {deletingId === item._id ? "..." : <FaTrash />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-emerald-300">
                          <FaBoxOpen className="text-6xl mb-4 opacity-50" />
                          <p className="text-xl font-bold text-emerald-800">No Water Entries Found</p>
                          <p className="text-emerald-600 mt-2">Adjust your filters or add a new entry.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {hasMoreEntries && !loadingEntries && (
              <div className="p-4 border-t border-emerald-50 bg-emerald-50/30 flex justify-center">
                <button
                  onClick={() => setVisibleEntriesCount(c => c + INITIAL_VISIBLE_ENTRIES)}
                  className="px-6 py-2 bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Load More Entries
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 6: ANALYTICS CHART (FULL WIDTH) */}
      <div className="pt-4 w-full">
         <AnalyticsChart />
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-emerald-950 mb-6 flex items-center gap-2">
              <FaEdit className="text-emerald-500" /> {t("editWaterEntry")}
            </h2>
            <form onSubmit={updateEntryHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">{t("farmer")}</label>
                <select
                  value={editFormData.farmer}
                  onChange={(e) => setEditFormData({ ...editFormData, farmer: e.target.value })}
                  className={inputClass}
                >
                  {farmers.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">{t("hours")}</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.hours}
                  onChange={(e) => setEditFormData({ ...editFormData, hours: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">{t("date")}</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FARMER SUMMARY MODAL */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-50 rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-white p-5 sm:px-8 border-b border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                <FaUsers className="text-emerald-500" /> Farmer Management
              </h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* Sticky Search */}
              <div className="sticky top-0 z-10 bg-slate-50 pb-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    placeholder="Search farmers..."
                    value={summarySearch}
                    onChange={(e) => setSummarySearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white text-emerald-950 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-emerald-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Expandable Management Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {farmerSummaries.map((summary) => {
                  return (
                    <div key={summary.farmer._id} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-200 transition-all flex flex-col">
                      {/* Line 1: Name and Phone */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-black text-emerald-950 truncate max-w-[70%]" title={summary.farmer.name}>
                          👨‍🌾 {summary.farmer.name}
                        </h3>
                        {summary.farmer.phone && (
                          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            📞 {summary.farmer.phone}
                          </span>
                        )}
                      </div>

                      {/* Line 2: Hours, Cost */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">💧 {summary.totalHours.toFixed(1)} h</span>
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">💰 ₹{summary.totalAmount.toFixed(2)}</span>
                      </div>

                      {/* Line 3: Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-auto border-t border-slate-100 pt-3">
                        <button
                          onClick={() => generateFarmerReportPDF(summary)}
                          className="flex-1 text-sm flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          <FaDownload /> PDF
                        </button>
                        <button
                          onClick={() => openEditFarmerModal(summary.farmer)}
                          className="flex-1 text-sm flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => deleteFarmerHandler(summary.farmer._id)}
                          className="flex-1 text-sm flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>

                      {/* Expand Toggle */}
                      <div className="mt-3 text-center">
                        <button
                          onClick={() => navigate(`/farmers/${summary.farmer._id}`)}
                          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer w-full py-1"
                        >
                          View Water History →
                        </button>
                      </div>
                    </div>
                  );
                })}
                {farmerSummaries.length === 0 && (
                  <div className="col-span-full py-12 text-center text-emerald-400">
                    <FaBoxOpen className="text-5xl mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-bold text-emerald-800">No farmers found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FARMER MODAL */}
      {editFarmerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-emerald-950 mb-6 flex items-center gap-2">
              <FaEdit className="text-emerald-500" /> Edit Farmer
            </h2>
            <form onSubmit={updateFarmerHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">Name</label>
                <input
                  type="text"
                  value={editFarmerData.name}
                  onChange={(e) => setEditFarmerData({ ...editFarmerData, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={editFarmerData.phone}
                  onChange={(e) => setEditFarmerData({ ...editFarmerData, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditFarmerModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingFarmer}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {updatingFarmer ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WaterManagement;

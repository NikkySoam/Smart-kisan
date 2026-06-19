import { useEffect, useState } from "react";
import API from "../api/axios";

import toast from "react-hot-toast";

interface CropScanInterface {
  _id: string;
  imageUrl: string;
  crop: string;
  problem: string;
  symptoms: string[];
  medicine: string[];
  advice: string[];
  createdAt: string;
}

const CropHistory = () => {
  const [scans, setScans] = useState<CropScanInterface[]>([]);
  const [selectedScan, setSelectedScan] =
    useState<CropScanInterface | null>(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/ai/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setScans(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const deleteScan = async ( id: string ) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

        if (!window.confirm("Delete this scan?")) {
            return;
            }

      await API.delete(
        `/ai/history/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Scan deleted"
      );

      setScans(
        scans.filter(
          (scan) =>
            scan._id !== id
        )
      );

    } catch {

      toast.error(
        "Delete failed"
      );

    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1
        className="
          text-3xl
          font-bold
          mb-6
          bg-gradient-to-r
          from-green-500
          to-green-800
          bg-clip-text
          text-transparent
        "
      >
        🌾 Crop Scan History
      </h1>

      {scans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <p className="text-gray-500">
            No crop scans found.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-5
          "
        >
          {scans.map((scan) => (
            <div
              key={scan._id}
              className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                overflow-hidden
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={scan.imageUrl}
                  alt={scan.crop}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-105
                  "
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-lg">
                  🌱 {scan.crop}
                </h2>

                <p className="mt-2 text-red-600 text-sm line-clamp-2">
                  {scan.problem}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  {new Date(
                    scan.createdAt
                  ).toLocaleDateString()}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedScan(scan)
                    }
                    className="
                      rounded-2xl
                      bg-green-600
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-white
                      hover:bg-green-700
                      transition-colors
                      duration-200
                      cursor-pointer
                      w-full
                    "
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteScan(scan._id)}
                    className="
                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-red-700
                      hover:border-red-300
                      hover:bg-red-100
                      transition-colors
                      duration-200
                      cursor-pointer
                      w-full
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/60 p-3 sm:p-6">
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div
              className="
                flex
                h-[95vh]
                w-full
                flex-col
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-2xl
              "
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b p-4 sm:p-6 shrink-0">
                <div>
                  <p className="text-xs uppercase tracking-widest text-green-600 font-medium">
                    Crop Scan Details
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {selectedScan.crop}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(
                      selectedScan.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedScan(null)
                  }
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-gray-100
                    hover:bg-gray-200
                    text-sm
                    cursor-pointer
                  "
                >
                  ✕ Close
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6">
                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row gap-5">
                    <img
                      src={selectedScan.imageUrl}
                      alt={selectedScan.crop}
                      className="
                        h-32
                        w-[80%]
                        md:w-52
                        rounded-2xl
                        object-cover
                        border
                        border-slate-200
                        shrink-0
                      "
                    />

                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Identified Problem
                      </p>

                      <div
                        className="
                          mt-2
                          rounded-2xl
                          bg-red-50
                          border
                          border-red-100
                          p-4
                        "
                      >
                        <p className="text-red-700 break-words">
                          {selectedScan.problem}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      xl:grid-cols-3
                      gap-4
                    "
                  >
                    {/* Symptoms */}
                    <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                      <h3 className="font-semibold text-slate-800">
                        Symptoms
                      </h3>

                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {selectedScan.symptoms.length >
                        0 ? (
                          selectedScan.symptoms.map(
                            (
                              symptom,
                              index
                            ) => (
                              <li
                                key={index}
                                className="break-words"
                              >
                                • {symptom}
                              </li>
                            )
                          )
                        ) : (
                          <li>
                            No symptoms found
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Medicine */}
                    <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                      <h3 className="font-semibold text-slate-800">
                        Medicine
                      </h3>

                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {selectedScan.medicine.length >
                        0 ? (
                          selectedScan.medicine.map(
                            (
                              medicine,
                              index
                            ) => (
                              <li
                                key={index}
                                className="break-words"
                              >
                                • {medicine}
                              </li>
                            )
                          )
                        ) : (
                          <li>
                            No medicine suggested
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Advice */}
                    <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5">
                      <h3 className="font-semibold text-slate-800">
                        Advice
                      </h3>

                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {selectedScan.advice.length >
                        0 ? (
                          selectedScan.advice.map(
                            (
                              advice,
                              index
                            ) => (
                              <li
                                key={index}
                                className="break-words"
                              >
                                • {advice}
                              </li>
                            )
                          )
                        ) : (
                          <li>
                            No advice available
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropHistory;
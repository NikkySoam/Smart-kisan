import { useTranslation } from "react-i18next";
import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import toast from "react-hot-toast";


// FARMER INTERFACE

interface Farmer {
  _id: string;
  name: string;
}


// WATER INTERFACE

interface WaterEntry {
  _id: string;

  farmer: {
    _id: string;
    name: string;
  };

  hours: number;
  totalAmount: number;
  date: string;
}

const INITIAL_VISIBLE_ENTRIES = 10;

const WaterEntry = () => {
  const { t } = useTranslation();
  // TOKEN

  const token =
    localStorage.getItem("token");

  // STATES

  const [entries, setEntries] =
    useState<WaterEntry[]>([]);

  const [farmers, setFarmers] =
    useState<Farmer[]>([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [visibleEntriesCount, setVisibleEntriesCount] =
    useState(INITIAL_VISIBLE_ENTRIES);

  const [formData, setFormData] =
    useState({
      farmer: "",
      hours: "",
      date: "",
    });

    const [editModal, setEditModal] =
    useState(false);

    const [selectedEntry, setSelectedEntry] =
    useState<any>(null);

    const [editFormData, setEditFormData] =
    useState({
        farmer: "",
        hours: "",
        date: "",
    });

  // FETCH WATER ENTRIES

  const fetchEntries = async () => {
    try {
      const res = await API.get(
        "/water",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEntries(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  // FETCH FARMERS

  const fetchFarmers = async () => {
    try {
      const res = await API.get(
        "/farmers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFarmers(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  // LOAD DATA

  useEffect(() => {
    fetchEntries();

    fetchFarmers();
  }, []);

  // HANDLE CHANGE

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // SUBMIT

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      await API.post(
        "/water",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        t("waterEntryAdded")
      );

      setFormData({
        farmer: "",
        hours: "",
        date: "",
      });

      await fetchEntries();

    } catch (error) {
      toast.error(
        t("entryAddFailed")
      );
    } finally {
      setSubmitting(false);
    }
  };


  const deleteEntryHandler =
        async (id: string) => {
            const confirmDelete =
            window.confirm(
                t("deleteEntryConfirm")
            );

            if (!confirmDelete) return;

            if (deletingId) return;

            setDeletingId(id);

            try {
            await API.delete(
                `/water/${id}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            toast.success(
                t("entryDeleted")
            );

            await fetchEntries();

            } catch (error) {
            toast.error(
                t("entryDeleteFailed")
            );
            } finally {
            setDeletingId("");
            }
        };

    
    const openEditModal = (
    entry: any
    ) => {
    setSelectedEntry(entry);

    setEditFormData({
        farmer: entry.farmer._id,
        hours: entry.hours,
        date: entry.date.split("T")[0],
    });

    setEditModal(true);
    };

    const updateEntryHandler =
    async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (updating) return;

        setUpdating(true);

        try {
        await API.put(
            `/water/${selectedEntry._id}`,
            editFormData,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        toast.success(
            t("entryUpdated")
        );

        setEditModal(false);

        await fetchEntries();

        } catch (error) {
        toast.error(
            t("entryUpdateFailed")
        );
        } finally {
        setUpdating(false);
        }
    };

  const visibleEntries =
    entries.slice(
      0,
      visibleEntriesCount
    );

  const hasMoreEntries =
    visibleEntriesCount <
    entries.length;

  return (
    <div
      className="
        min-h-screen
        bg-cover
        bg-center
        bg-no-repeat
        p-4
        sm:p-8
      "
    //   style={{
    //     backgroundImage:
    //       "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop')",
    //   }}
    >
      <div className="min-h-screen bg-black/40 rounded-3xl p-4 sm:p-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <h1 className="text-2xl sm:text-5xl font-bold text-white py-2">{t("waterManagement")}</h1>

            <p className="text-gray-200 mt-2">{t("manageWaterEntriesFarmerWise")}</p>

          </div>

          {/* FORM SECTION */}

          <div
            className="
              bg-white/15
              backdrop-blur-lg
              border
              border-white/20
              rounded-3xl
              p-5
              sm:p-8
              shadow-xl
              mb-8
            "
          >
            <h2 className="text-2xl font-bold text-white mb-6 py-2">{t("addWaterEntry")}</h2>

            <form
              onSubmit={handleSubmit}
              className="
                grid
                grid-cols-1
                md:grid-cols-4
                gap-4
              "
            >

              {/* FARMER */}

              <select
                name="farmer"
                value={formData.farmer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    farmer:
                      e.target.value,
                  })
                }
                className="
                  p-3
                  rounded-xl
                  bg-white
                  outline-none
                "
                required
              >
                <option value="">{t("selectFarmer")}</option>

                {farmers.map(
                  (farmer) => (
                    <option
                      key={farmer._id}
                      value={
                        farmer._id
                      }
                    >
                      {farmer.name}
                    </option>
                  )
                )}
              </select>

              {/* HOURS */}

              <input
                type="number"
                name="hours"
                placeholder={t("hours")}
                value={formData.hours}
                onChange={
                  handleChange
                }
                className="
                  p-3
                  rounded-xl
                  outline-none
                  bg-white
                "
                required
              />

              {/* DATE */}

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={
                  handleChange
                }
                className="
                  p-3
                  rounded-xl
                  outline-none
                  bg-white
                "
                required
              />

              {/* BUTTON */}

              <button
                type="submit"
                disabled={submitting}
                className="
                  bg-linear-to-r from-green-500 to-green-800 
                  hover:from-green-600 hover:to-green-900
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition-all
                  duration-300
                  text-white
                  rounded-xl
                  p-3
                  font-semibold
                  cursor-pointer
                "
              >{submitting ? t("saving") : t("addEntry")}</button>

            </form>

          </div>

          {/* WATER TABLE */}

          <div
            className="
              bg-white/15
              backdrop-blur-lg
              border
              border-white/20
              rounded-3xl
              p-5
              sm:p-8
              shadow-xl
            "
          >

            <h2 className="text-2xl font-bold text-white mb-6 py-2">{t("waterHistory")}</h2>

            <div className="overflow-x-auto">

              <table className="w-full md:min-w-[700px]">

                <thead>

                  <tr className="bg-linear-to-r from-green-500 to-green-800  text-white">

                    <th className="p-3 text-left rounded-l-xl">{t("farmer")}</th>

                    <th className="p-3 text-left">{t("date")}</th>

                    <th className="p-3 text-left">{t("hours")}</th>

                    <th className="p-3 text-left ">{t("totalAmount")}</th>

                    <th className="p-3 text-left rounded-r-xl">{t("actions")}</th>

                  </tr>

                </thead>

                <tbody>

                  {visibleEntries.map(
                    (item) => (
                      <tr
                        key={item._id}
                        className="
                          border-b
                          border-white/20
                          text-white
                        "
                      >
                        <td className="p-4">
                          {
                            item.farmer
                              ?.name
                          }
                        </td>

                        <td className="p-4">
                          {new Date(
                            item.date
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          {item.hours}
                        </td>

                        <td
                          className="
                            p-4
                            font-bold
                            text-yellow-300
                          "
                        >
                          ₹
                          {
                            item.totalAmount
                          }
                        </td>

                        <td className="p-4">
                        <button
                            disabled={!!deletingId || updating || submitting}
                            onClick={() =>
                                openEditModal(item)
                            }
                            className="
                                bg-linear-to-r from-yellow-500 to-yellow-600 
                                hover:from-yellow-600 hover:to-yellow-700
                                text-black
                                px-4
                                py-2
                                rounded-lg
                                mr-2
                                cursor-pointer
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                            >{t("edit")}</button>
                        <button
                            disabled={!!deletingId || updating || submitting}
                            onClick={() =>
                            deleteEntryHandler(
                                item._id
                            )
                            }
                            className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            cursor-pointer
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            "
                        >{deletingId === item._id ? t("loading") : t("delete")}</button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {hasMoreEntries && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleEntriesCount(
                      (count) => count + INITIAL_VISIBLE_ENTRIES
                    )
                  }
                  className="
                    bg-white/20
                    hover:bg-white/30
                    border
                    border-white/30
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-semibold
                    transition-all
                    cursor-pointer
                  "
                >
                  {t("showMore")}
                </button>
              </div>
            )}

          </div>

          {/* FARMER SUMMARY */}

          <div className="mt-10">

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 py-2">{t("farmerWiseSummary")}</h2>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
            >

              {farmers.map(
                (farmer) => {
                  const farmerEntries =
                    entries.filter(
                      (item) =>
                        item.farmer
                          ?._id ===
                        farmer._id
                    );

                  const totalHours =
                    farmerEntries.reduce(
                      (
                        acc,
                        item
                      ) =>
                        acc +
                        item.hours,
                      0
                    );

                  const totalAmount =
                    farmerEntries.reduce(
                      (
                        acc,
                        item
                      ) =>
                        acc +
                        item.totalAmount,
                      0
                    );

                  return (
                    <div
                      key={
                        farmer._id
                      }
                      className="
                        bg-white/15
                        backdrop-blur-lg
                        border
                        border-white/20
                        rounded-3xl
                        p-6
                        shadow-xl
                      "
                    >
                      <h3 className="text-2xl font-bold text-white py-2">
                        {
                          farmer.name
                        }
                      </h3>

                      <p className="mt-4 text-gray-200">
                        {t("totalHours")}:

                        <span className="font-bold ml-2 text-white">
                          {
                            totalHours
                          }
                        </span>
                      </p>

                      <p className="mt-3 text-gray-200">
                        {t("totalAmount")}:

                        <span
                          className="
                            font-bold
                            ml-2
                            text-yellow-300
                          "
                        >
                          ₹
                          {
                            totalAmount
                          }
                        </span>
                      </p>
                    </div>
                  );
                }
              )}

            </div>

          </div>


          <div
            className={`
                fixed
                inset-0
                flex
                justify-center
                items-center
                z-50
                p-4
                backdrop-blur-sm
                transition-all
                duration-500
                ease-in-out

                ${
                editModal
                    ? "bg-black/50 opacity-100 visible"
                    : "bg-black/0 opacity-0 invisible"
                }
            `}
            >

            <div
                className={`
                bg-white
                rounded-3xl
                p-6
                w-full
                max-w-lg
                shadow-2xl
                transition-all
                duration-500
                ease-in-out

                ${
                    editModal
                    ? "scale-100 translate-y-0 rotate-0"
                    : "scale-75 translate-y-10 rotate-1"
                }
                `}
            >

                <h2 className="text-3xl font-bold text-green-800 mb-6 py-2">{t("editWaterEntry")}</h2>

                <form
                onSubmit={
                    updateEntryHandler
                }
                className="space-y-4"
                >

                <select
                    value={
                    editFormData.farmer
                    }
                    onChange={(e) =>
                    setEditFormData({
                        ...editFormData,
                        farmer:
                        e.target.value,
                    })
                    }
                    className="
                    w-full
                    border
                    p-4
                    rounded-2xl
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    transition
                    "
                >

                    {farmers.map(
                    (farmer) => (
                        <option
                        key={farmer._id}
                        value={
                            farmer._id
                        }
                        >
                        {farmer.name}
                        </option>
                    )
                    )}

                </select>

                <input
                    type="number"
                    value={
                    editFormData.hours
                    }
                    onChange={(e) =>
                    setEditFormData({
                        ...editFormData,
                        hours:
                        e.target.value,
                    })
                    }
                    className="
                    w-full
                    border
                    p-4
                    rounded-2xl
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    transition
                    "
                />

                <input
                    type="date"
                    value={
                    editFormData.date
                    }
                    onChange={(e) =>
                    setEditFormData({
                        ...editFormData,
                        date:
                        e.target.value,
                    })
                    }
                    className="
                    w-full
                    border
                    p-4
                    rounded-2xl
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    transition
                    "
                />

                <div className="flex gap-4">

                    <button
                    type="submit"
                    disabled={updating}
                    className="
                        flex-1
                        bg-linear-to-r from-green-500 to-green-800 
                        hover:from-green-600 hover:to-green-900
                        hover:scale-105
                        transition
                        duration-300
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        text-white
                        p-4
                        rounded-2xl
                        font-semibold
                        cursor-pointer
                    "
                    >{updating ? t("saving") : t("update")}</button>

                    <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                        setEditModal(false)
                    }
                    className="
                        flex-1
                        bg-gray-300
                        hover:bg-gray-400
                        hover:scale-105
                        transition
                        duration-300
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        p-4
                        rounded-2xl
                        font-semibold
                        cursor-pointer
                    "
                    >{t("cancel")}</button>

                </div>

                </form>

            </div>

            </div>

        </div>

      </div>

    </div>
  );
};

export default WaterEntry;

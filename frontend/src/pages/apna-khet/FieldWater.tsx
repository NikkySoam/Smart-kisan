import { useTranslation } from "react-i18next";
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../../api/axios";

import toast from "react-hot-toast";



import {
  FaTint,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface Entry {
  _id: string;

  hours: number;

  date: string;

  field: {
    name: string;
  };
}

const FieldWater = () => {
  const { t } = useTranslation();
  const { fieldId } =
    useParams();

  const token =
    localStorage.getItem("token");

  const [entries, setEntries] =
    useState<Entry[]>([]);

  const [totalHours, setTotalHours] =
    useState(0);

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [formData, setFormData] =
    useState({
      hours: "",
      date: "",
    });

  const [editId, setEditId] =
  useState("");

  const [isEditing, setIsEditing] =
  useState(false);

  // FETCH ENTRIES

  const fetchEntries =
    async () => {
      try {

        const res = await API.get(
          `/field-water/field/${fieldId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEntries(res.data.data);

        setTotalHours(
          res.data.totalHours
        );

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchEntries();
  }, []);

  // HANDLE CHANGE

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ADD ENTRY

    const handleSubmit = async (
    e: React.FormEvent
    ) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {

        // EDIT

        if (isEditing) {

        await API.put(
            `/field-water/${editId}`,
            formData,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        toast.success(
            t("entryUpdated")
        );

        } else {

        // CREATE

        await API.post(
            "/field-water",
            {
            ...formData,
            field: fieldId,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        toast.success(
            t("entryAdded")
        );
        }

        setShowModal(false);

        setIsEditing(false);

        setEditId("");

        setFormData({
        hours: "",
        date: "",
        });

        await fetchEntries();

    } catch (error) {
        toast.error(
        t("operationFailed")
        );
    } finally {
        setSubmitting(false);
    }
    };


    const handleDelete = async (
    id: string
    ) => {
    const confirmDelete =
        window.confirm(
        t("deleteEntryConfirm")
        );

    if (!confirmDelete) return;

    if (deletingId) return;

    setDeletingId(id);

    try {

        await API.delete(
        `/field-water/${id}`,
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
        t("deleteFailed")
        );
    } finally {
        setDeletingId("");
    }
    };

    const handleEdit = (
    entry: Entry
    ) => {

    setIsEditing(true);

    setEditId(entry._id);

    setFormData({
        hours:
        entry.hours.toString(),

        date:
        entry.date.split("T")[0],
    });

    setShowModal(true);
    };

  // LOADING

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  const fieldName =
    entries[0]?.field?.name ||
    t("field");

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          justify-between
          sm:items-center
          gap-4
          mb-10
        "
      >

        <div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent py-2">
            {t("fieldWaterTitle", { fieldName })}
          </h1>

          <p className="text-gray-600 mt-2">{t("manageFieldWaterUsage")}</p>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            bg-linear-to-r from-blue-500 to-purple-600
            hover:from-blue-600 hover:to-purple-700
            text-white
            px-6
            py-4
            rounded-2xl
            flex
            items-center
            gap-3
            font-semibold
            cursor-pointer
          "
        >

          <FaPlus />{t("addWaterEntry")}</button>

      </div>

      {/* STATS */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          p-8
          mb-8
        "
      >

        <div className="flex items-center gap-5">

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-blue-100
              flex
              items-center
              justify-center
            "
          >

            <FaTint className="text-blue-500 text-4xl" />

          </div>

          <div>

            <p className="text-gray-500">{t("totalWaterHours")}</p>

            <h2 className="text-5xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent py-2">
              {totalHours}
            </h2>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          overflow-hidden
        "
      >

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold py-2">{t("waterHistory")}</h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-linear-to-r from-blue-500 to-purple-600 
                text-white
              "
            >

              <tr>

                <th className="p-5 text-left">{t("date")}</th>

                <th className="p-5 text-left">{t("hours")}</th>

                <th className="p-5 text-left">{t("actions")}</th>

              </tr>

            </thead>

            <tbody>

              {entries.map(
                (entry) => (

                  <tr
                    key={entry._id}
                    className="border-b"
                  >

                    <td className="p-5">

                      {new Date(
                        entry.date
                      ).toLocaleDateString()}

                    </td>

                    <td className="p-5 font-semibold">

                      {entry.hours} {t("hours")}

                    </td>

                    <td className="p-5">

                    <div className="flex gap-3">

                        {/* EDIT */}

                        <button
                        disabled={!!deletingId || submitting}
                        onClick={() =>
                            handleEdit(entry)
                        }
                        className="
                            bg-blue-100
                            hover:bg-blue-200
                            p-3
                            rounded-xl
                            cursor-pointer
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            transition-all
                        "
                        >

                        <FaEdit className="text-blue-700" />

                        </button>

                        {/* DELETE */}

                        <button
                        disabled={!!deletingId || submitting}
                        onClick={() =>
                            handleDelete(entry._id)
                        }
                        className="
                            bg-red-100
                            hover:bg-red-200
                            p-3
                            rounded-xl
                            cursor-pointer
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            transition-all
                        "
                        >

                        <FaTrash className="text-red-700" />

                        </button>

                    </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-50
            flex
            justify-center
            items-center
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              w-full
              max-w-xl
              p-8
            "
          >

            <h2 className="text-3xl font-bold mb-6 py-2">
              {isEditing
                ? "Edit Water Entry"
                : "Add Water Entry"}
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >

              <input
                type="number"
                name="hours"
                value={
                  formData.hours
                }
                onChange={
                  handleChange
                }
                placeholder={t("waterHours")}
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                "
              />

              <input
                type="date"
                name="date"
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                "
              />

              <div className="flex gap-4">

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>{
                      setShowModal(false);
                      setIsEditing(false);
                      setFormData({
                        hours: "",
                        date: "",
                        });
                    }
                  }
                  className="
                    flex-1
                    border
                    p-4
                    rounded-2xl
                    font-semibold
                    cursor-pointer
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >{t("cancel")}</button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    flex-1
                    bg-linear-to-r from-blue-500 to-purple-600
                    hover:from-blue-600 hover:to-purple-700
                    text-white
                    p-4
                    rounded-2xl
                    font-semibold
                    cursor-pointer
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  {submitting
                    ? t("saving")
                    : isEditing
                      ? t("updateEntry")
                      : t("addEntry")}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default FieldWater;

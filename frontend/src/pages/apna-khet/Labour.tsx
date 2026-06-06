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
  FaTools,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface LabourEntry {
  _id: string;

  amount: number;

  workType: string;

  date: string;

  field: {
    name: string;
  };
}

const Labour = () => {
  const { t } = useTranslation();
  const { fieldId } =
    useParams();

  const token =
    localStorage.getItem("token");

  const [entries, setEntries] =
    useState<LabourEntry[]>([]);

  const [totalAmount, setTotalAmount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
      amount: "",
      workType: "",
      date: "",
    });

  const [editId, setEditId] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  // FETCH LABOUR

  const fetchEntries =
    async () => {
      try {

        const res = await API.get(
          `/labour/field/${fieldId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEntries(res.data.data);

        setTotalAmount(
          res.data.totalAmount
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

  // ADD / EDIT ENTRY

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {

      if (isEditing) {
        await API.put(
          `/labour/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          t("labourUpdated")
        );
      } else {
        await API.post(
          "/labour",
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
          t("labourAddedSuccessfully")
        );
      }

      setShowModal(false);

      setIsEditing(false);

      setEditId("");

      setFormData({
        amount: "",
        workType: "",
        date: "",
      });

      fetchEntries();

    } catch (error) {
      toast.error(
        t("operationFailed")
      );
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    try {
      await API.delete(
        `/labour/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        t("labourDeleted")
      );

      fetchEntries();

    } catch (error) {
      toast.error(
        t("deleteFailed")
      );
    }
  };

  const handleEdit = (
    entry: LabourEntry
  ) => {
    setIsEditing(true);

    setEditId(entry._id);

    setFormData({
      amount:
        entry.amount.toString(),
      workType:
        entry.workType,
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

          <h1
            className="
              text-4xl
              sm:text-5xl
              font-bold
              bg-linear-to-r
              from-green-500
              to-green-800
              bg-clip-text
              text-transparent py-2"
          >
            {t("fieldLabourTitle", { fieldName })}
          </h1>

          <p className="text-gray-500 mt-2">{t("manageLabourExpenses")}</p>

        </div>

        {/* BUTTON */}

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            bg-linear-to-r
            from-green-500
            to-green-800
            hover:from-green-600
            hover:to-green-900
            text-white
            px-6
            py-4
            rounded-2xl
            flex
            items-center
            gap-3
            font-semibold
            cursor-pointer
            transition-all
          "
        >

          <FaPlus />{t("addLabour")}</button>

      </div>

      {/* TOTAL CARD */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          p-8
          mb-8
          hover:shadow-2xl
          transition-all
        "
      >

        <div className="flex items-center gap-5">

          {/* ICON */}

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-green-100
              flex
              items-center
              justify-center
            "
          >

            <FaTools className="text-4xl text-green-700" />

          </div>

          {/* CONTENT */}

          <div>

            <p className="text-gray-500">{t("totalLabourCost")}</p>

            <h2
              className="
                text-5xl
                font-bold
                bg-linear-to-r
                from-green-500
                to-green-800
                bg-clip-text
                text-transparent
                mt-2 py-2"
            >
              ₹{totalAmount}
            </h2>

          </div>

        </div>

      </div>

      {/* HISTORY */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div className="p-6 border-b">

          <h2
            className="
              text-2xl
              font-bold
              bg-linear-to-r
              from-green-500
              to-green-800
              bg-clip-text
              text-transparent py-2"
          >{t("labourHistory")}</h2>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-linear-to-r
                from-green-500
                to-green-800
                text-white
              "
            >

              <tr>

                <th className="p-5 text-left">{t("workType")}</th>

                <th className="p-5 text-left">{t("amount")}</th>

                <th className="p-5 text-left">{t("date")}</th>

                <th className="p-5 text-left">{t("actions")}</th>

              </tr>

            </thead>

            <tbody>

              {entries.map(
                (entry) => (

                  <tr
                    key={entry._id}
                    className="
                      border-b
                      hover:bg-green-50
                      transition-all
                    "
                  >

                    {/* WORK TYPE */}

                    <td className="p-5 font-semibold">

                      {entry.workType}

                    </td>

                    {/* AMOUNT */}

                    <td
                      className="
                        p-5
                        font-bold
                        bg-linear-to-r
                        from-green-500
                        to-green-800
                        bg-clip-text
                        text-transparent
                      "
                    >

                      ₹{entry.amount}

                    </td>

                    {/* DATE */}

                    <td className="p-5">

                      {new Date(
                        entry.date
                      ).toLocaleDateString()}

                    </td>

                    <td className="p-5">
                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            handleEdit(entry)
                          }
                          className="
                            bg-blue-100
                            hover:bg-blue-200
                            p-3
                            rounded-xl
                            cursor-pointer
                            transition-all
                          "
                        >
                          <FaEdit className="text-blue-700" />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(entry._id)
                          }
                          className="
                            bg-red-100
                            hover:bg-red-200
                            p-3
                            rounded-xl
                            cursor-pointer
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

            {/* HEADER */}

            <div className="mb-8">

              <h2
                className="
                  text-3xl
                  font-bold
                  bg-linear-to-r
                  from-green-500
                  to-green-800
                  bg-clip-text
                  text-transparent py-2"
              >
                {isEditing
                  ? t("editLabourEntry")
                  : t("addLabourEntry")}
              </h2>

              <p className="text-gray-500 mt-2">{t("addLabourExpenseDetails")}</p>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >

              {/* WORK TYPE */}

              <input
                type="text"
                name="workType"
                value={
                  formData.workType
                }
                onChange={
                  handleChange
                }
                placeholder={t("workType")}
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                  focus:border-green-700
                "
              />

              {/* AMOUNT */}

              <input
                type="number"
                name="amount"
                value={
                  formData.amount
                }
                onChange={
                  handleChange
                }
                placeholder={t("amount")}
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                  focus:border-green-700
                "
              />

              {/* DATE */}

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
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                  focus:border-green-700
                "
              />

              {/* BUTTONS */}

              <div className="flex gap-4 pt-2">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditId("");
                    setFormData({
                      amount: "",
                      workType: "",
                      date: "",
                    });
                  }}
                  className="
                    flex-1
                    border
                    border-gray-300
                    p-4
                    rounded-2xl
                    font-semibold
                    cursor-pointer
                    hover:bg-gray-100
                    transition-all
                  "
                >{t("cancel")}</button>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-linear-to-r
                    from-green-500
                    to-green-800
                    hover:from-green-600
                    hover:to-green-900
                    text-white
                    p-4
                    rounded-2xl
                    font-semibold
                    cursor-pointer
                    transition-all
                  "
                >
                  {isEditing
                    ? t("updateLabour")
                    : t("addLabour")}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Labour;

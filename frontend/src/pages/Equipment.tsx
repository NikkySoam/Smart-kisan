import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../api/axios";

import toast from "react-hot-toast";

import {
  FaTractor,
  FaPlus,
} from "react-icons/fa";

interface EquipmentEntry {
  _id: string;

  equipmentName: string;

  amount: number;

  date: string;

  field: {
    name: string;
  };
}

const Equipment = () => {
  const { fieldId } =
    useParams();

  const token =
    localStorage.getItem("token");

  const [entries, setEntries] =
    useState<EquipmentEntry[]>([]);

  const [totalAmount, setTotalAmount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
      equipmentName: "",
      amount: "",
      date: "",
    });

  // FETCH DATA

  const fetchEntries =
    async () => {
      try {

        const res = await API.get(
          `/equipment/field/${fieldId}`,
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

  // ADD ENTRY

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {

      await API.post(
        "/equipment",
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
        "Equipment Added"
      );

      setShowModal(false);

      setFormData({
        equipmentName: "",
        amount: "",
        date: "",
      });

      fetchEntries();

    } catch (error) {
      toast.error(
        "Failed to add equipment"
      );
    }
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
    "Field";

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
              text-transparent
            "
          >
            {fieldName} Equipment
          </h1>

          <p className="text-gray-500 mt-2">
            Manage equipment expenses
          </p>

        </div>

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

          <FaPlus />

          Add Equipment

        </button>

      </div>

      {/* TOTAL CARD */}

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
              bg-green-100
              flex
              items-center
              justify-center
            "
          >

            <FaTractor className="text-4xl text-green-700" />

          </div>

          <div>

            <p className="text-gray-500">
              Total Equipment Cost
            </p>

            <h2
              className="
                text-5xl
                font-bold
                bg-linear-to-r
                from-green-500
                to-green-800
                bg-clip-text
                text-transparent
                mt-2
              "
            >
              ₹{totalAmount}
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

          <h2
            className="
              text-2xl
              font-bold
              bg-linear-to-r
              from-green-500
              to-green-800
              bg-clip-text
              text-transparent
            "
          >
            Equipment History
          </h2>

        </div>

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

                <th className="p-5 text-left">
                  Equipment
                </th>

                <th className="p-5 text-left">
                  Amount
                </th>

                <th className="p-5 text-left">
                  Date
                </th>

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

                    <td className="p-5 font-semibold">
                      {
                        entry.equipmentName
                      }
                    </td>

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

                    <td className="p-5">

                      {new Date(
                        entry.date
                      ).toLocaleDateString()}

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
            text-transparent
          "
        >
          Add Equipment Entry
        </h2>

        <p className="text-gray-500 mt-2">
          Add equipment expense details
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* EQUIPMENT NAME */}

        <input
          type="text"
          name="equipmentName"
          value={formData.equipmentName}
          onChange={handleChange}
          placeholder="Equipment Name"
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
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
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
          value={formData.date}
          onChange={handleChange}
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
            onClick={() =>
              setShowModal(false)
            }
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
          >
            Cancel
          </button>

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
            Add Equipment
          </button>

        </div>

      </form>

    </div>

  </div>
)}

    </div>
  );
};

export default Equipment;
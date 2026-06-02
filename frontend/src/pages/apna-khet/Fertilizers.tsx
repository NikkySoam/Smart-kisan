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
  FaSeedling,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface Fertilizer {
  _id: string;

  fertilizerName: string;

  quantity: number;

  cost: number;

  date: string;

  field: {
    name: string;
  };
}

const Fertilizers = () => {
  const { fieldId } =
    useParams();

  const token =
    localStorage.getItem("token");

  const [entries, setEntries] =
    useState<Fertilizer[]>([]);

  const [totalCost, setTotalCost] =
    useState(0);

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [fieldName, setFieldName] =
  useState("Field");

  const [formData, setFormData] =
    useState({
      fertilizerName: "",
      quantity: "",
      cost: "",
      date: "",
    });

  const [editId, setEditId] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  // FETCH DATA

  const fetchEntries =
    async () => {
      try {

        const res = await API.get(
          `/fertilizers/field/${fieldId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEntries(res.data.data);

        setTotalCost(
          res.data.totalCost
        );


      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFieldDetails = async () => {
        try {
            const res = await API.get(
            `/fields/${fieldId}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            setFieldName(
            res.data.field.name || "Field"
            );
        } catch (error) {
            console.log(error);
        }
        };

  useEffect(() => {
  fetchFieldDetails();
  fetchEntries();
}, [fieldId]);

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
          `/fertilizers/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Fertilizer Updated"
        );
      } else {
        await API.post(
          "/fertilizers",
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
          "Fertilizer Added"
        );
      }

      setShowModal(false);

      setIsEditing(false);

      setEditId("");

      setFormData({
        fertilizerName: "",
        quantity: "",
        cost: "",
        date: "",
      });

      fetchEntries();

    } catch (error) {
      toast.error(
        "Operation Failed"
      );
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    try {
      await API.delete(
        `/fertilizers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Fertilizer Deleted"
      );

      fetchEntries();

    } catch (error) {
      toast.error(
        "Delete Failed"
      );
    }
  };

  const handleEdit = (
    entry: Fertilizer
  ) => {
    setIsEditing(true);

    setEditId(entry._id);

    setFormData({
      fertilizerName:
        entry.fertilizerName,
      quantity:
        entry.quantity.toString(),
      cost:
        entry.cost.toString(),
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

          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
            {fieldName} Fertilizer
          </h1>

          <p className="text-gray-600 mt-2">
            Manage fertilizer usage
          </p>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            bg-linear-to-r from-green-600 to-green-800 
            hover:from-green-700 hover:to-green-900
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

          <FaPlus />

          Add Fertilizer

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

            <FaSeedling className="text-green-700 text-4xl" />

          </div>

          <div>

            <p className="text-gray-500">
              Total Fertilizer Cost
            </p>

            <h2 className="text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent mt-2">
              ₹{totalCost}
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

          <h2 className="text-2xl font-bold">
            Fertilizer History
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-linear-to-r from-green-600 to-green-800 
                text-white
              "
            >

              <tr>

                <th className="p-5 text-left">
                  Name
                </th>

                <th className="p-5 text-left">
                  Quantity
                </th>

                <th className="p-5 text-left">
                  Cost
                </th>

                <th className="p-5 text-left">
                  Date
                </th>

                <th className="p-5 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {entries.map(
                (entry) => (

                  <tr
                    key={entry._id}
                    className="border-b"
                  >

                    <td className="p-5 font-semibold">
                      {
                        entry.fertilizerName
                      }
                    </td>

                    <td className="p-5">
                      {entry.quantity}
                    </td>

                    <td className="p-5">
                      ₹{entry.cost}
                    </td>

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

            <h2 className="text-3xl font-bold mb-6">
              {isEditing
                ? "Edit Fertilizer"
                : "Add Fertilizer"}
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >

              <input
                type="text"
                name="fertilizerName"
                value={
                  formData.fertilizerName
                }
                onChange={
                  handleChange
                }
                placeholder="Fertilizer Name"
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                "
              />

              <input
                type="number"
                name="quantity"
                value={
                  formData.quantity
                }
                onChange={
                  handleChange
                }
                placeholder="Quantity"
                className="
                  w-full
                  border
                  p-4
                  rounded-2xl
                "
              />

              <input
                type="number"
                name="cost"
                value={
                  formData.cost
                }
                onChange={
                  handleChange
                }
                placeholder="Cost"
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
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditId("");
                    setFormData({
                      fertilizerName: "",
                      quantity: "",
                      cost: "",
                      date: "",
                    });
                  }}
                  className="
                    flex-1
                    border
                    p-4
                    rounded-2xl
                    font-semibold
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-green-700
                    hover:bg-green-800
                    text-white
                    p-4
                    rounded-2xl
                    font-semibold
                    cursor-pointer
                  "
                >
                  {isEditing ? "Update" : "Add"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Fertilizers;

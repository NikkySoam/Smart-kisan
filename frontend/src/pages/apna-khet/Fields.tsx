import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";

import toast from "react-hot-toast";

import {
  FaTint,
  FaSeedling,
  FaTools,
  FaTractor,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface Field {
  _id: string;

  name: string;

  area: number;

  location: string;

  crop: string;
}

interface Analytics {
  water: number;

  fertilizer: number;

  labour: number;

  equipment: number;

  totalExpense: number;
}

const fieldImages = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1974&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1974&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop",
];

const Fields = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const [fields, setFields] =
    useState<Field[]>([]);

  const [analytics, setAnalytics] =
    useState<
      Record<string, Analytics>
    >({});

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
  useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [isEditing, setIsEditing] =
  useState(false);

    const [editId, setEditId] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      area: "",
      location: "",
      crop: "",
    });

  // FETCH FIELDS

  const fetchFields =
    async () => {
      try {

        const res = await API.get(
          "/fields",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFields(res.data.data);

        // FETCH ANALYTICS

        const analyticsData:
          Record<
            string,
            Analytics
          > = {};

        for (const field of res.data
          .data) {

          const details =
            await API.get(
              `/fields/${field._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          analyticsData[
            field._id
          ] =
            details.data.totals;
        }

        setAnalytics(
          analyticsData
        );

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchFields();
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

  // ADD FIELD

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {

    // EDIT

    if (isEditing) {

      await API.put(
        `/fields/${editId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Field Updated"
      );

    } else {

      // CREATE

      await API.post(
        "/fields",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Field Added Successfully"
      );
    }

    setShowModal(false);

    setIsEditing(false);

    setEditId("");

    setFormData({
      name: "",
      area: "",
      location: "",
      crop: "",
    });

    fetchFields();

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
      `/fields/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(
      "Field Deleted"
    );

    fetchFields();

  } catch (error) {
    toast.error(
      "Delete Failed"
    );
  }
};


    const handleEdit = (
  field: Field
) => {

  setIsEditing(true);

  setEditId(field._id);

  setFormData({
    name: field.name,

    area:
      field.area.toString(),

    location:
      field.location,

    crop: field.crop,
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

  const filteredFields =
  fields.filter((field) =>
    field.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||
    field.crop
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||
    field.location
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

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
            Apna Khet
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your fields
            and expenses
          </p>

        </div>

        {/* ADD BUTTON */}

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
            shadow-lg
            cursor-pointer
            transition-all
          "
        >

          <FaPlus />

          Add New Field

        </button>

      </div>

      {/* SEARCH */}

        <div className="mb-8">

        <input
            type="text"
            placeholder="Search fields, crops, location..."
            value={search}
            onChange={(e) =>
            setSearch(
                e.target.value
            )
            }
            className="
            w-full
            bg-white
            border
            border-gray-300
            p-5
            rounded-3xl
            outline-none
            shadow-sm
            focus:border-green-700
            "
        />

        </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        {filteredFields.map(
          (field, index) => (

            <div
              key={field._id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-lg
                hover:shadow-2xl
                hover:scale-[1.02]
                transition-all
                duration-300
              "
            >

              {/* IMAGE */}

              <div
                className="
                  h-56
                  relative
                  bg-cover
                  bg-center
                "
                style={{
                  backgroundImage: `url(${
                    fieldImages[
                      index %
                        fieldImages.length
                    ]
                  })`,
                }}
              >

                {/* OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/40
                  "
                ></div>

                {/* CONTENT */}

                <div
                  className="
                    relative
                    z-10
                    p-6
                    text-white
                    h-full
                    flex
                    flex-col
                    justify-end
                  "
                >

                  <h2 className="text-4xl font-bold">
                    {field.name}
                  </h2>

                  <p className="mt-2 text-lg">
                    {field.crop}
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    {field.location}
                  </p>

                </div>

              </div>

              {/* BODY */}

              <div className="p-6">

                {/* TOP */}

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    mb-6
                  "
                >

                  <h3
                    className="
                      text-xl
                      font-bold
                      bg-linear-to-r
                      from-green-500
                      to-green-800
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Cost Modules
                  </h3>

                  <div
                    className="
                      bg-green-100
                      text-green-900
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "
                  >
                    {field.area} m&sup2;
                  </div>

                </div>

                {/* MODULES */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                  "
                >

                  {/* WATER */}

                  <button
                    onClick={() =>
                      navigate(
                        `/field-water/${field._id}`
                      )
                    }
                    className="
                      bg-blue-50
                      hover:bg-blue-100
                      border
                      border-blue-100
                      rounded-2xl
                      p-5
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaTint className="text-blue-600 text-2xl mb-4" />

                    <p className="font-semibold text-blue-900">
                      Water
                    </p>

                  </button>

                  {/* FERTILIZER */}

                  <button
                    onClick={() =>
                      navigate(
                        `/fertilizers/${field._id}`
                      )
                    }
                    className="
                      bg-green-50
                      hover:bg-green-100
                      border
                      border-green-100
                      rounded-2xl
                      p-5
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaSeedling className="text-green-600 text-2xl mb-4" />

                    <p className="font-semibold text-green-900">
                      Fertilizer
                    </p>

                  </button>

                  {/* LABOUR */}

                  <button
                    onClick={() =>
                      navigate(
                        `/labour/${field._id}`
                      )
                    }
                    className="
                      bg-yellow-50
                      hover:bg-yellow-100
                      border
                      border-yellow-100
                      rounded-2xl
                      p-5
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaTools className="text-yellow-600 text-2xl mb-4" />

                    <p className="font-semibold text-yellow-900">
                      Labour
                    </p>

                  </button>

                  {/* EQUIPMENT */}

                  <button
                    onClick={() =>
                      navigate(
                        `/equipment/${field._id}`
                      )
                    }
                    className="
                      bg-gray-100
                      hover:bg-gray-200
                      border
                      border-gray-200
                      rounded-2xl
                      p-5
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaTractor className="text-gray-700 text-2xl mb-4" />

                    <p className="font-semibold text-gray-900">
                      Equipment
                    </p>

                  </button>

                </div>

                {/* TOTAL EXPENSE */}

                <div
                  className="
                    mt-6
                    rounded-3xl
                    bg-linear-to-r
                    from-green-500
                    to-green-800
                    p-4
                    text-white
                    shadow-lg
                  "
                >

                  <p className="text-gray-100">
                    Total Expense
                  </p>

                  <h2 className="text-4xl font-bold mt-3">

                    ₹
                    {
                      analytics[
                        field._id
                      ]?.totalExpense || 0
                    }

                  </h2>

                  {/* BREAKDOWN */}

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3
                      text-sm
                    "
                  >

                    <div>
                      Water: ₹
                      {
                        analytics[
                          field._id
                        ]?.water || 0
                      }
                    </div>

                    <div>
                      Fertilizer: ₹
                      {
                        analytics[
                          field._id
                        ]?.fertilizer || 0
                      }
                    </div>

                    <div>
                      Labour: ₹
                      {
                        analytics[
                          field._id
                        ]?.labour || 0
                      }
                    </div>

                    <div>
                      Equipment: ₹
                      {
                        analytics[
                          field._id
                        ]?.equipment || 0
                      }
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}

            <div className="flex gap-4 mt-5">

            {/* EDIT */}

            <button
                onClick={() =>
                handleEdit(field)
                }
                className="
                flex-1
                bg-blue-100
                hover:bg-blue-200
                text-blue-700
                p-4
                rounded-2xl
                flex
                justify-center
                items-center
                gap-2
                font-semibold
                cursor-pointer
                transition-all
                "
            >

                <FaEdit />

                Edit

            </button>

            {/* DELETE */}

            <button
                onClick={() =>
                handleDelete(field._id)
                }
                className="
                flex-1
                bg-red-100
                hover:bg-red-200
                text-red-700
                p-4
                rounded-2xl
                flex
                justify-center
                items-center
                gap-2
                font-semibold
                cursor-pointer
                transition-all
                "
            >

                <FaTrash />

                Delete

            </button>

            </div>

              </div>

            </div>
          )
        )}

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
              max-w-2xl
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
                {isEditing
                    ? "Edit Field"
                    : "Add New Field"}
              </h2>

              <p className="text-gray-500 mt-2">
                Create farming field
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                placeholder="Field Name"
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                "
              />

              <input
                type="number"
                name="area"
                value={
                  formData.area
                }
                onChange={
                  handleChange
                }
                placeholder="Area (Acre)"
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                "
              />

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="Location"
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                "
              />

              <input
                type="text"
                name="crop"
                value={
                  formData.crop
                }
                onChange={
                  handleChange
                }
                placeholder="Current Crop"
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                "
              />

              {/* BUTTONS */}

              <div className="flex gap-4 pt-2">

                <button
                  type="button"
                  onClick={() =>{
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({
                        name: "",
                        area: "",
                        location: "",
                        crop: "",
                        });
                    }
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
                    ? "Update Field"
                    : "Add Field"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Fields;

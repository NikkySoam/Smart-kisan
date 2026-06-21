import { useTranslation } from "react-i18next";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";

import toast from "react-hot-toast";

import { cacheFields } from "../../utils/cacheFields";
import { getCachedFields } from "../../utils/getCachedFields";


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

  imageUrl?: string;
}

interface Analytics {
  water: number;

  fertilizer: number;

  labour: number;

  equipment: number;

  totalExpense: number;
}


const Fields = () => {
  const { t } = useTranslation();

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

  const [submitting, setSubmitting] =
  useState(false);

  const [deletingId, setDeletingId] =
  useState("");

  const [search, setSearch] =
  useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [isEditing, setIsEditing] =
  useState(false);

    const [editId, setEditId] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
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

        // CACHE DATA
        await cacheFields({
          fields: res.data.data,
          analytics: analyticsData,
        });

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const loadData = async () => {
      // Load cached data first
      const cached = await getCachedFields();
      if (cached) {
        setFields(cached.fields);
        setAnalytics(cached.analytics);
        setLoading(false);
      }
      // Fetch fresh data
      fetchFields();
    };
    loadData();
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(
        URL.createObjectURL(file)
      );
    } else {
      setImagePreview("");
    }
  };

  // ADD FIELD

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (submitting) return;

  setSubmitting(true);

  try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("area", formData.area);
      body.append("location", formData.location);
      body.append("crop", formData.crop);

      if (imageFile) {
        body.append("image", imageFile);
      }

      // EDIT

      if (isEditing) {

        await API.put(
          `/fields/${editId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          t("fieldUpdated")
        );

      } else {

        // CREATE

        await API.post(
          "/fields",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      toast.success(t("fieldAddedSuccessfully"));
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
    setImageFile(null);
    setImagePreview("");

    await fetchFields();

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
      t("deleteFieldConfirm")
    );

  if (!confirmDelete) return;

  if (deletingId) return;

  setDeletingId(id);

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
      t("fieldDeleted")
    );

    await fetchFields();

  } catch (error) {
    toast.error(
      t("deleteFailed")
    );
  } finally {
    setDeletingId("");
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

  setImageFile(null);
  setImagePreview(field.imageUrl || "");

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
    <div className="py-2 px-4 sm:p-4">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          justify-between
          sm:items-center
          gap-4
          mb-4
        "
      >

        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              bg-linear-to-r
              from-green-500
              to-green-800
              bg-clip-text
              text-transparent
              py-2
            "
          >
            {t("apnaKhet")}
          </h1>

          <p className="text-gray-500 mt-1">{t("manageFieldsExpenses")}</p>

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
            p-3
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

          <FaPlus />{t("addNewField")}</button>

      </div>

      {/* SEARCH */}

        <div className="mb-6">

        <input
            type="text"
            placeholder={t("searchFields")}
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
            p-3
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
          mb-10
        "
      >

        {filteredFields.map(
          (field) => (

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
                  backgroundImage: `url(${field.imageUrl})`,
                }}
              >
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/20
                  "
                ></div>

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

                  <h2 className="text-4xl font-bold py-2">
                    {field.name}
                  </h2>

                  <p className="mt-2 text-lg">
                    {field.crop}
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    {field.location}
                  </p>


                  <div className="flex gap-4 mt-5">
                    {/* EDIT */}

                    <button
                        disabled={!!deletingId || submitting}
                        onClick={() =>
                        handleEdit(field)
                        }
                        className="
                        flex-1
                        bg-blue-100
                        hover:bg-blue-200
                        text-blue-700
                        p-3
                        rounded-2xl
                        flex
                        justify-center
                        items-center
                        gap-2
                        font-semibold
                        cursor-pointer
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        transition-all
                        "
                    >

                        <FaEdit />{t("edit")}</button>

                    {/* DELETE */}

                    <button
                        disabled={!!deletingId || submitting}
                        onClick={() =>
                        handleDelete(field._id)
                        }
                        className="
                        flex-1
                        bg-red-100
                        hover:bg-red-200
                        text-red-700
                        p-3
                        rounded-2xl
                        flex
                        justify-center
                        items-center
                        gap-2
                        font-semibold
                        cursor-pointer
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        transition-all
                        "
                    >

                        <FaTrash />{t("delete")}</button>

                    </div>

                </div>

              </div>

              {/* BODY */}

              <div className="py-3 px-4">

                {/* TOP */}

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    mb-2
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
                      text-transparent py-2"
                  >{t("costModules")}</h3>

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
                    gap-2
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
                      p-3
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaTint className="text-blue-600 text-2xl mb-4" />

                    <p className="font-semibold text-blue-900">{t("water")}</p>

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
                      p-3
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaSeedling className="text-green-600 text-2xl mb-4" />

                    <p className="font-semibold text-green-900">{t("fertilizer")}</p>

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
                      p-3
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaTools className="text-yellow-600 text-2xl mb-4" />

                    <p className="font-semibold text-yellow-900">{t("labour")}</p>

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
                      p-3
                      text-left
                      transition-all
                      cursor-pointer
                    "
                  >

                    <FaTractor className="text-gray-700 text-2xl mb-4" />

                    <p className="font-semibold text-gray-900">{t("equipment")}</p>

                  </button>

                </div>

                {/* TOTAL EXPENSE */}

                <div
                  className="
                    mt-3
                    rounded-3xl
                    bg-linear-to-r
                    from-green-500
                    to-green-800
                    p-3
                    text-white
                    shadow-lg
                  "
                >

                  <p className="text-gray-100">{t("totalExpense")}</p>

                  <h2 className="text-4xl font-bold mt-1 py-1">

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
                      mt-1
                      grid
                      grid-cols-2
                      gap-1
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

            <div className="mb-4">

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
                    ? t("editField")
                    : t("addNewField")}
              </h2>

              <p className="text-gray-500 mt-2">{t("createFarmingField")}</p>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-1"
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
                placeholder={t("fieldName")}
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
                placeholder={t("areaAcre")}
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
                placeholder={t("location")}
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
                placeholder={t("currentCrop")}
                className="
                  w-full
                  border
                  border-gray-300
                  p-4
                  rounded-2xl
                  outline-none
                "
              />

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  {t("fieldImage")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="
                    mt-2
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    p-3
                    bg-white
                    outline-none
                  "
                />
              </label>

              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {t("previewImage")}
                  </p>
                  <img
                    src={imagePreview}
                    alt={t("fieldImage")}
                    className="
                      w-30
                      
                      object-cover
                      rounded-3xl
                      border
                      border-gray-200
                    "
                  />
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex gap-4 pt-2">

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>{
                    setShowModal(false);
                    setIsEditing(false);
                    setFormData({
                        name: "",
                        area: "",
                        location: "",
                        crop: "",
                        });
                    setImageFile(null);
                    setImagePreview("");
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
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    hover:bg-gray-100
                    transition-all
                  "
                >{t("cancel")}</button>

                <button
                  type="submit"
                  disabled={submitting}
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
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  {submitting
                    ? t("saving")
                    : isEditing
                      ? t("updateField")
                      : t("addField")}
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

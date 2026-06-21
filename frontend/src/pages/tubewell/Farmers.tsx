import { useTranslation } from "react-i18next";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import API from "../../api/axios";
import toast from "react-hot-toast";

interface Farmer {
  _id: string;
  name: string;
  phone?: string;
  village?: string;
}

const Farmers = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const [farmers, setFarmers] =
    useState<Farmer[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      village: "",
    });

    const [editModal, setEditModal] =
        useState(false);

        const [selectedFarmer, setSelectedFarmer] =
        useState<any>(null);

        const [editFormData, setEditFormData] =
        useState({
            name: "",
            phone: "",
            village: "",
        });

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

  useEffect(() => {
    fetchFarmers();
  }, []);

  // HANDLE CHANGE

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        "/farmers",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        t("farmerAdded")
      );

      setFormData({
        name: "",
        phone: "",
        village: "",
      });

      setShowForm(false);

      await fetchFarmers();

    } catch (error) {

      toast.error(
        t("farmerAddFailed")
      );

    } finally {
      setSubmitting(false);
    }
  };

  const deleteFarmerHandler =
    async (id: string) => {
        const confirmDelete =
        window.confirm(
            t("deleteFarmerConfirm")
        );

        if (!confirmDelete) return;

        if (deletingId) return;

        setDeletingId(id);

        try {
        await API.delete(
            `/farmers/${id}`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        toast.success(
            t("farmerDeleted")
        );

        await fetchFarmers();

        } catch (error) {
        toast.error(
            t("farmerDeleteFailed")
        );
        } finally {
        setDeletingId("");
        }
    };



    const openEditModal = (
        farmer: Farmer
        ) => {
        setSelectedFarmer(farmer);

        setEditFormData({
            name: farmer.name,
            phone: farmer.phone || "",
            village: farmer.village || "",
        });

        setEditModal(true);
        };


    const updateFarmerHandler =
        async (
            e: React.FormEvent
        ) => {
            e.preventDefault();

            if (updating) return;

            setUpdating(true);

            try {
            await API.put(
                `/farmers/${selectedFarmer._id}`,
                editFormData,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            toast.success(
                t("farmerUpdated")
            );

            setEditModal(false);

            await fetchFarmers();

            } catch (error) {
            toast.error(
                t("farmerUpdateFailed")
            );
            } finally {
        setUpdating(false);
        }
    };

  const inputClassName = `
    w-full
    rounded-lg
    border
    border-emerald-900/10
    bg-white/90
    px-4
    py-3
    text-slate-900
    outline-none
    transition-all
    placeholder:text-slate-400
    focus:border-emerald-700
    focus:ring-4
    focus:ring-emerald-700/10
  `;

  const primaryButtonClassName = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-lg
    bg-emerald-800
    px-5
    py-3
    font-semibold
    text-white
    shadow-sm
    transition-all
    hover:bg-emerald-700
    disabled:cursor-not-allowed
    disabled:opacity-60
    cursor-pointer
  `;

  return (
    <div
      className="
        mx-auto
        max-w-7xl
        px-3
        py-4
        sm:px-5
        lg:px-8
      "
    >

          {/* HEADER */}

          <div className="mb-8 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_top_right,_rgba(104,219,169,0.35),_transparent_36%),linear-gradient(135deg,_#006948,_#002114)] p-6 text-white shadow-xl sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-100">
                  {t("tubewell")}
                </span>

                <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
                  {t("farmersManagement")}
                </h1>

                <p className="mt-3 max-w-2xl text-emerald-50">
                  {t("manageAllFarmers")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-2xl font-black">{farmers.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
                    {t("totalFarmers")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(!showForm)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-white
                    px-5
                    py-3
                    font-semibold
                    text-emerald-800
                    shadow-sm
                    transition-all
                    hover:bg-emerald-50
                    cursor-pointer
                  "
                >
                  <FaPlus />
                  {showForm
                    ? t("close")
                    : t("addFarmer")}
                </button>
              </div>

            </div>

          </div>


          {/* FORM */}


            <div
                className={`
                    mb-8
                    transition-all duration-500 ease-in-out
                    overflow-hidden
                    ${
                    showForm
                        ? "opacity-100 scale-100 max-h-[500px]"
                        : "opacity-0 scale-95 max-h-0"
                    }
                `}
                >

              <div
                className="
                  w-full
                  max-w-2xl
                  bg-white/80
                  backdrop-blur-xl
                  border
                  border-emerald-900/10
                  rounded-lg
                  p-6
                  shadow-sm
                "
              >

                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <FaUser />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-950">{t("addFarmer")}</h2>
                    <p className="text-sm text-slate-500">{t("manageAllFarmers")}</p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid gap-4 md:grid-cols-3"
                >

                  <input
                    type="text"
                    name="name"
                    placeholder={t("farmerName")}
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder={t("phoneNumber")}
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClassName}
                  />

                  <input
                    type="text"
                    name="village"
                    placeholder={t("village")}
                    value={formData.village}
                    onChange={handleChange}
                    className={inputClassName}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`md:col-span-3 ${primaryButtonClassName}`}
                  >
                    <FaPlus />
                    {submitting ? t("saving") : t("addFarmer")}
                  </button>

                </form>

              </div>

            </div>


          {/* FARMERS GRID */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            {farmers.map((farmer) => (

              <div
                key={farmer._id}
                className="
                  bg-white/80
                  backdrop-blur-xl
                  border
                  border-emerald-900/10
                  rounded-lg
                  p-6
                  shadow-sm
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl font-black text-emerald-800">
                    {farmer.name?.charAt(0)?.toUpperCase() || "F"}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-black text-slate-950">
                      {farmer.name}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <FaPhone className="text-emerald-700" />
                      {farmer.phone || t("noPhone")}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-emerald-700" />
                      {farmer.village || t("noVillage")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/farmers/${farmer._id}`
                      )
                    }
                    className={primaryButtonClassName}
                  >
                    <FaEye />
                    {t("viewDetails")}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!!deletingId || updating || submitting}
                      onClick={() =>
                        openEditModal(farmer)
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-emerald-900/10
                        bg-emerald-50
                        p-3
                        font-semibold
                        text-emerald-800
                        transition-all
                        hover:bg-emerald-100
                        cursor-pointer
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                      "
                    >
                      <FaEdit />
                      {t("edit")}
                    </button>

                    <button
                      type="button"
                      disabled={!!deletingId || updating || submitting}
                      onClick={() =>
                        deleteFarmerHandler(
                          farmer._id
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-red-50
                        p-3
                        font-semibold
                        text-red-700
                        transition-all
                        hover:bg-red-100
                        cursor-pointer
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                      "
                    >
                      <FaTrash />
                      {deletingId === farmer._id ? t("loading") : t("delete")}
                    </button>
                  </div>
                </div>

              </div>

            ))}

          </div>


          <div
            className={`
                fixed
                inset-0
                bg-slate-950/50
                backdrop-blur-sm
                flex
                justify-center
                items-center
                z-50
                p-4
                transition-all
                duration-300
                ease-in-out

                ${
                editModal
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }
            `}
            >

            <div
                className={`
                bg-white/95
                border
                border-emerald-900/10
                rounded-lg
                p-6
                w-full
                max-w-lg
                shadow-xl
                transition-all
                duration-300
                ease-in-out

                ${
                    editModal
                    ? "scale-100 translate-y-0"
                    : "scale-90 translate-y-10"
                }
                `}
            >

                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <FaEdit />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-950">{t("editFarmer")}</h2>
                    <p className="text-sm text-slate-500">{selectedFarmer?.name}</p>
                  </div>
                </div>

                <form
                onSubmit={
                    updateFarmerHandler
                }
                className="space-y-4"
                >

                <input
                    type="text"
                    value={
                    editFormData.name
                    }
                    onChange={(e) =>
                    setEditFormData({
                        ...editFormData,
                        name: e.target.value,
                    })
                    }
                    className={inputClassName}
                    placeholder={t("farmerName")}
                />

                <input
                    type="text"
                    value={
                    editFormData.phone
                    }
                    onChange={(e) =>
                    setEditFormData({
                        ...editFormData,
                        phone:
                        e.target.value,
                    })
                    }
                    className={inputClassName}
                    placeholder={t("phone")}
                />

                <input
                    type="text"
                    value={
                    editFormData.village
                    }
                    onChange={(e) =>
                    setEditFormData({
                        ...editFormData,
                        village:
                        e.target.value,
                    })
                    }
                    className={inputClassName}
                    placeholder={t("village")}
                />

                <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                    type="submit"
                    disabled={updating}
                    className={`flex-1 ${primaryButtonClassName}`}
                    >{updating ? t("saving") : t("update")}</button>

                    <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                        setEditModal(false)
                    }
                    className="
                        flex-1
                        border
                        border-slate-200
                        bg-white
                        hover:bg-slate-50
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        p-3
                        rounded-lg
                        font-semibold
                        text-slate-700
                        cursor-pointer
                    "
                    >{t("cancel")}</button>

                </div>

                </form>

            </div>

            </div> 



    </div>
  );
};

export default Farmers;

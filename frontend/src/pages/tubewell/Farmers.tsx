import { useTranslation } from "react-i18next";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

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

      fetchFarmers();

    } catch (error) {

      toast.error(
        t("farmerAddFailed")
      );

    }
  };

  const deleteFarmerHandler =
    async (id: string) => {
        const confirmDelete =
        window.confirm(
            t("deleteFarmerConfirm")
        );

        if (!confirmDelete) return;

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

        fetchFarmers();

        } catch (error) {
        toast.error(
            t("farmerDeleteFailed")
        );
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

            fetchFarmers();

            } catch (error) {
            toast.error(
                t("farmerUpdateFailed")
            );
            }
        };

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

          <div className="mb-8 flex justify-between items-center">

            <div>

              <h1 className="text-2xl sm:text-5xl font-bold text-white py-2">{t("farmersManagement")}</h1>

              <p className="text-gray-200 mt-2">{t("manageAllFarmers")}</p>

            </div>

            <button
              onClick={() =>
                setShowForm(!showForm)
              }
              className="
                bg-linear-to-r from-green-500 to-green-800 
                hover:from-green-600 hover:to-green-900
                text-white
                px-6
                py-1
                md:py-3
                sm:py-2
                rounded-2xl
                font-semibold
                shadow-lg
                cursor-pointer

              "
            >
              {showForm
                ? t("close")
                : t("addFarmer")}
            </button>

          </div>


          {/* FORM */}


            <div
                className={`
                    flex justify-center mb-10
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
                  sm:w-[70%]
                  lg:w-[25%]
                  
                  bg-white/15
                  backdrop-blur-lg
                  border
                  border-white/20
                  rounded-3xl
                  p-5
                  shadow-xl
                "
              >

                <h2 className="text-2xl font-bold text-white mb-5 text-center py-2">{t("addFarmer")}</h2>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3"
                >

                  <input
                    type="text"
                    name="name"
                    placeholder={t("farmerName")}
                    value={formData.name}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-xl
                      bg-white/90
                      outline-none
                    "
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder={t("phoneNumber")}
                    value={formData.phone}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-xl
                      bg-white/90
                      outline-none
                    "
                  />

                  <input
                    type="text"
                    name="village"
                    placeholder={t("village")}
                    value={formData.village}
                    onChange={handleChange}
                    className="
                      p-3
                      rounded-xl
                      bg-white/90
                      outline-none
                    "
                  />

                  <button
                    className="
                      bg-green-700
                      hover:bg-green-800
                      text-white
                      rounded-xl
                      p-3
                      font-semibold
                      cursor-pointer
                    "
                  >{t("addFarmer")}</button>

                </form>

              </div>

            </div>


          {/* FARMERS GRID */}

        <div className="h-0.5 bg-gray-400 my-2 w-full"></div>
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
                  bg-white/15
                  backdrop-blur-lg
                  border
                  border-white/20
                  rounded-3xl
                  p-6
                  shadow-xl
                  hover:scale-105
                  transition
                  duration-300
                "
              >

                <h2 className="text-2xl font-bold text-white py-2">
                  {farmer.name}
                </h2>

                <p className="text-gray-200 mt-3">
                   {farmer.phone || t("noPhone")}
                </p>

                <p className="text-gray-200 mt-2">
                   {farmer.village || t("noVillage")}
                </p>

               <button
                onClick={() =>
                    navigate(
                    `/farmers/${farmer._id}`
                    )
                }
                className="
                    mt-5
                    w-full
                    bg-yellow-500
                    hover:bg-yellow-600
                    text-black
                    font-semibold
                    p-3
                    rounded-xl
                    cursor-pointer
                "
                >{t("viewDetails")}</button>

                <button
                onClick={() =>
                    openEditModal(farmer)
                }
                className="
                    mt-2
                    w-full
                    bg-yellow-500
                    hover:bg-yellow-600
                    text-black
                    font-semibold
                    p-3
                    rounded-xl
                    cursor-pointer
                "
                >{t("editFarmer")}</button>

                <button
                    onClick={() =>
                        deleteFarmerHandler(
                        farmer._id
                        )
                    }
                    className="
                        mt-2
                        w-full
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        font-semibold
                        p-3
                        rounded-xl
                        cursor-pointer
                    "
                    >{t("deleteFarmer")}</button>

              </div>

            ))}

          </div>


          <div
            className={`
                fixed
                inset-0
                bg-black/50
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
                bg-white
                rounded-3xl
                p-6
                w-full
                max-w-lg
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

                <h2 className="text-3xl font-bold text-green-800 mb-6 py-2">{t("editFarmer")}</h2>

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
                    className="
                    w-full
                    border
                    p-4
                    rounded-2xl
                    "
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
                    className="
                    w-full
                    border
                    p-4
                    rounded-2xl
                    "
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
                    className="
                    w-full
                    border
                    p-4
                    rounded-2xl
                    "
                    placeholder={t("village")}
                />

                <div className="flex gap-4">

                    <button
                    type="submit"
                    className="
                        flex-1
                        bg-green-700
                        hover:bg-green-800
                        text-white
                        p-4
                        rounded-2xl
                    "
                    >{t("update")}</button>

                    <button
                    type="button"
                    onClick={() =>
                        setEditModal(false)
                    }
                    className="
                        flex-1
                        bg-gray-300
                        hover:bg-gray-400
                        p-4
                        rounded-2xl
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

export default Farmers;

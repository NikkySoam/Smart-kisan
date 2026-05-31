import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

interface Farmer {
  _id: string;
  name: string;
  phone?: string;
  village?: string;
}

const Farmers = () => {

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
        "Farmer Added Successfully"
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
        "Failed to add farmer"
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

              <h1 className="text-3xl sm:text-5xl font-bold text-white">
                Farmers Management
              </h1>

              <p className="text-gray-200 mt-2">
                Manage all farmers here
              </p>

            </div>

            <button
              onClick={() =>
                setShowForm(!showForm)
              }
              className="
                bg-green-700
                hover:bg-green-800
                text-white
                px-6
                py-3
                rounded-2xl
                font-semibold
                shadow-lg
              "
            >
              {showForm
                ? "Close"
                : "Add Farmer"}
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

                <h2 className="text-2xl font-bold text-white mb-5 text-center">
                  Add Farmer
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3"
                >

                  <input
                    type="text"
                    name="name"
                    placeholder="Farmer Name"
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
                    placeholder="Phone Number"
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
                    placeholder="Village"
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
                    "
                  >
                    Add Farmer
                  </button>

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

                <h2 className="text-2xl font-bold text-white">
                  {farmer.name}
                </h2>

                <p className="text-gray-200 mt-3">
                  📞 {farmer.phone || "No Phone"}
                </p>

                <p className="text-gray-200 mt-2">
                  📍 {farmer.village || "No Village"}
                </p>

                <button
                  className="
                    mt-5
                    w-full
                    bg-yellow-500
                    hover:bg-yellow-600
                    text-black
                    font-semibold
                    p-3
                    rounded-xl
                  "
                >
                  View Details
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Farmers;

import WeatherCard from "../components/WeatherCard";
import AnalyticsChart from "../components/AnalyticsChart";

import { FaLeaf,FaTint } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome to Smart Kisan
        </p>

      </div>

      {/* STATS CARDS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {/* APNA KHET */}

        <div
        onClick={() =>
            navigate("/fields")
        }
        className="
            relative
            overflow-hidden
            rounded-3xl
            shadow-lg
            cursor-pointer
            group
            min-h-[260px]
            bg-cover
            bg-center
            hover:scale-[1.02]
            transition-all
        "
        style={{
            backgroundImage:
            "url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop)",
        }}
        >

        {/* OVERLAY */}

        <div
            className="
            absolute
            inset-0
            bg-black/45
            group-hover:bg-black/35
            transition-all
            "
        ></div>

        {/* CONTENT */}

        <div
            className="
            relative
            z-10
            h-full
            p-6
            flex
            flex-col
            justify-between
            text-white
            "
        >

            {/* TOP */}

            <div
            className="
                w-16
                h-16
                rounded-2xl
                bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
            "
            >

            <FaLeaf className="text-3xl" />

            </div>

            {/* BOTTOM */}

            <div>

            <h2 className="text-4xl font-bold">
                Apna Khet
            </h2>

            <p className="mt-3 text-gray-200">
                Manage your fields,
                fertilizer, water,
                labour and equipment
            </p>

            </div>

        </div>

        </div>

        {/* WATER MANAGEMENT */}

        <div
        onClick={() =>
            navigate("/water-management")
        }
        className="
            relative
            overflow-hidden
            rounded-3xl
            shadow-lg
            cursor-pointer
            group
            min-h-[260px]
            bg-cover
            bg-center
            hover:scale-[1.02]
            transition-all
        "
        style={{
            backgroundImage:
            "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1974&auto=format&fit=crop)",
        }}
        >

        {/* OVERLAY */}

        <div
            className="
            absolute
            inset-0
            bg-black/45
            group-hover:bg-black/35
            transition-all
            "
        ></div>

        {/* CONTENT */}

        <div
            className="
            relative
            z-10
            h-full
            p-6
            flex
            flex-col
            justify-between
            text-white
            "
        >

            {/* ICON */}

            <div
            className="
                w-16
                h-16
                rounded-2xl
                bg-white/20
                backdrop-blur-md
                flex
                items-center
                justify-center
            "
            >

            <FaTint className="text-3xl" />

            </div>

            {/* TEXT */}

            <div>

            <h2 className="text-4xl font-bold">
                Tubewell Water
            </h2>

            <p className="mt-3 text-gray-200">
                Manage farmers,
                water hours and
                total income
            </p>

            </div>

        </div>

        </div>

      </div>


      <div className="mt-8">
        <WeatherCard />
      </div>

      <div className="mt-8">
        <AnalyticsChart />
      </div>

    </div>
  );
};

export default Dashboard;
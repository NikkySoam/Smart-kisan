import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaTint,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaCog,
  FaChartBar
} from "react-icons/fa";

import { useState } from "react";

const MainLayout = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [open, setOpen] =
    useState(false);

  // LOGOUT

  const logoutHandler = () => {
    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  // ACTIVE LINK STYLE

  const isActive = (
    path: string
  ) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen overflow-hidden flex bg-green-50">

      {/* MOBILE BUTTON */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          lg:hidden
          fixed
          top-4
          right-4
          z-50
          bg-green-700
          text-white
          p-3
          rounded-xl
          shadow-lg
        "
      >
        <FaBars />
      </button>

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-40
          h-screen
          w-[260px]
          bg-green-900
          text-white
          p-6
          flex
          flex-col
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* LOGO */}

        <div className="mb-10">

          <h1 className="text-3xl font-bold">
            Smart Kisan
          </h1>

          <p className="text-green-200 mt-2 text-sm">
            Farmer Management
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-3 flex-1">

          {/* DASHBOARD */}

          <Link
            to="/dashboard"
            onClick={() =>
              setOpen(false)
            }
            className={`
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              transition-all

              ${
                isActive(
                  "/dashboard"
                )
                  ? "bg-white text-green-900 font-semibold shadow"
                  : "hover:bg-green-800"
              }
            `}
          >
            <FaHome />

            Dashboard
          </Link>

          {/* FARMERS */}

          <Link
            to="/farmers"
            onClick={() =>
              setOpen(false)
            }
            className={`
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              transition-all

              ${
                isActive(
                  "/farmers"
                )
                  ? "bg-white text-green-900 font-semibold shadow"
                  : "hover:bg-green-800"
              }
            `}
          >
            <FaUsers />

            Farmers
          </Link>

          {/* WATER */}

          <Link
            to="/water"
            onClick={() =>
              setOpen(false)
            }
            className={`
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              transition-all

              ${
                isActive(
                  "/water"
                )
                  ? "bg-white text-green-900 font-semibold shadow"
                  : "hover:bg-green-800"
              }
            `}
          >
            <FaTint />

            Water Management
          </Link>

                {/* SETTINGS */}
          <Link
            to="/settings"
            onClick={() =>
                setOpen(false)
            }
            className={`
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                transition-all

                ${
                isActive("/settings")
                    ? "bg-white text-green-900 font-semibold shadow"
                    : "hover:bg-green-800"
                }
            `}
            >
            <FaCog />

            Settings
            </Link>

                {/* REPORTS */}
            <Link
            to="/reports"
            onClick={() =>
                setOpen(false)
            }
            className={`
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                transition-all

                ${
                isActive("/reports")
                    ? "bg-white text-green-900 font-semibold shadow"
                    : "hover:bg-green-800"
                }
            `}
            >
            <FaChartBar />

            Reports
            </Link>

        </nav>

        {/* LOGOUT */}

        <button
          onClick={logoutHandler}
          className="
            flex
            items-center
            justify-center
            gap-3
            bg-red-600
            hover:bg-red-700
            p-4
            rounded-2xl
            transition-all
            cursor-pointer
          "
        >
          <FaSignOutAlt />

          Logout
        </button>

      </aside>

      {/* OVERLAY */}

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="
            fixed
            inset-0
            bg-black/40
            z-30
            lg:hidden
          "
        />
      )}

      {/* MAIN CONTENT */}

      <main
        className="
          flex-1
          lg:ml-[260px]
          h-screen
          overflow-y-auto
        "
      >
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
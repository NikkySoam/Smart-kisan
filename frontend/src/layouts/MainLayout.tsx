import { useTranslation } from "react-i18next";
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
  FaChartBar,
  FaSeedling,
} from "react-icons/fa";

import { useState } from "react";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";

const MainLayout = () => {
  const { t } = useTranslation();
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
    if (path === "/farmers") {
      return location.pathname.startsWith(
        "/farmers"
      );
    }

    if (path === "/fields") {
      return [
        "/fields",
        "/field-water",
        "/fertilizers",
        "/labour",
        "/equipment",
      ].some((fieldPath) =>
        location.pathname.startsWith(
          fieldPath
        )
      );
    }

    return location.pathname === path;
  };

  const navGroups = [
    {
      title: t("main"),
      links: [
        {
          label: t("dashboard"),
          path: "/dashboard",
          icon: <FaHome />,
        },
      ],
    },
    {
      title: t("tubewellWaterGroup"),
      links: [
        {
          label: t("management"),
          path: "/water-management",
          icon: <FaTint />,
        },
        {
          label: t("farmers"),
          path: "/farmers",
          icon: <FaUsers />,
        },
        {
          label: t("waterEntry"),
          path: "/water",
          icon: <FaTint />,
        },
        {
          label: t("reports"),
          path: "/reports",
          icon: <FaChartBar />,
        },
      ],
    },
    {
      title: t("apnaKhet"),
      links: [
        {
          label: t("fields"),
          path: "/fields",
          icon: <FaSeedling />,
        },
      ],
    },
    {
      title: t("account"),
      links: [
        {
          label: t("settings"),
          path: "/settings",
          icon: <FaCog />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-emerald-50">

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
          bg-linear-to-tr from-green-500 to-green-800
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
          md:h-screen
          h-[80vh]
          w-[260px]
          bg-green-800
          text-white
          p-4
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

        <div className="my-4">

          <p className="text-green-100 mt-2 text-md">{t("farmerManagement")}</p>

        </div>

        {/* NAVIGATION */}

        <nav
          className="
            flex
            flex-col
            gap-5
            flex-1
            overflow-y-auto
            no-scrollbar
            bg-green-700
            p-4
            mb-2
            rounded-2xl
          "
        >

          {navGroups.map(
            (group) => (
              <div key={group.title}>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-green-200
                    mb-2
                    px-2
                  "
                >
                  {group.title}
                </p>

                <div className="flex flex-col gap-2">

                  {group.links.map(
                    (link) => (
                      <Link
                        key={link.path}
                        to={link.path}
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
                            isActive(link.path)
                              ? "bg-white text-green-900 font-semibold shadow"
                              : "hover:bg-green-800"
                          }
                        `}
                      >
                        {link.icon}

                        {link.label}
                      </Link>
                    )
                  )}

                </div>

              </div>
            )
          )}

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
          <FaSignOutAlt />{t("logout")}</button>

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
          min-h-screen
          bg-green-50
          flex
          flex-col
        "
        role="main"
      >
        <Navbar />

        <div className="flex-1 overflow-y-auto app-content">
          <Outlet />
        </div>
      </main>

      <MobileBottomNav />

    </div>
  );
};

export default MainLayout;

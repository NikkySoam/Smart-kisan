import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaHome,
  FaRobot,
  FaSeedling,
  FaTint,
  FaCog,
} from "react-icons/fa";

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      label: t("dashboard"),
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      label: t("water"),
      path: "/water-management",
      icon: <FaTint />,
    },
    {
      label: t("cropDoctor"),
      path: "/crop-doctor",
      icon: <FaRobot />,
    },
     {
      label: t("fields"),
      path: "/fields",
      icon: <FaSeedling />,
    },
   
    {
      label: t("settings"),
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50

        lg:hidden

        bg-white/95
        backdrop-blur-md

        border-t
        border-gray-200

        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
      "
    >
      <div
        className="
          grid
          grid-cols-5
          h-16
        "
      >
        {navItems.map((item) => {
          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(
              item.path
            );

          return (
            <Link
              key={item.path}
              to={item.path}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
              "
            >
              <span
                className={`
                  text-lg
                  transition-all

                  ${
                    active
                      ? "text-green-700"
                      : "text-gray-500"
                  }
                `}
              >
                {item.icon}
              </span>

              <span
                className={`
                  text-[11px]
                  font-medium

                  ${
                    active
                      ? "text-green-700"
                      : "text-gray-500"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;

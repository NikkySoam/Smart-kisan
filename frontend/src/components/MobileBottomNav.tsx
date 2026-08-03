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
          const matchPaths = (paths: string[]) => {
            return paths.some(p => location.pathname === p || location.pathname.startsWith(`${p}/`));
          };

          let active = matchPaths([item.path]);
          
          if (item.path === "/fields") {
            active = matchPaths(["/fields", "/field-water", "/fertilizers", "/labour", "/equipment", "/crop-sales"]);
          } else if (item.path === "/water-management") {
            active = matchPaths(["/water-management", "/farmers", "/water", "/reports"]);
          } else if (item.path === "/crop-doctor") {
            active = matchPaths(["/crop-doctor", "/crop-history"]);
          }
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

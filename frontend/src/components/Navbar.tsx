import { useTranslation } from "react-i18next";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  FaCog,
  FaHome,
  FaRobot,
  FaSeedling,
  FaTint,
} from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";

import OfflineWaterBadge from "./OfflineWaterBadge";

import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/fields") {
      return [
        "/fields",
        "/field-water",
        "/fertilizers",
        "/labour",
        "/equipment",
      ].some((fieldPath) =>
        location.pathname.startsWith(fieldPath)
      );
    }

    if (path === "/crop-doctor") {
      return location.pathname.startsWith("/crop-doctor");
    }

    return location.pathname === path;
  };

  const navLinks = [
    {
      label: t("dashboard"),
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      label: t("cropDoctor"),
      path: "/crop-doctor",
      icon: <FaRobot />,
    },
    {
      label: t("tubewell"),
      path: "/water-management",
      icon: <FaTint />,
    },
    {
      label: t("fields"),
      path: "/fields",
      icon: <FaSeedling />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/75 shadow-sm backdrop-blur-xl">
      <div className="flex min-h-[64px] items-center justify-between gap-4 px-4 md:px-6">
        <Link
          to="/dashboard"
          className="
            shrink-0
            text-xl md:text-3xl
            font-bold
            text-emerald-800
          "
        >
          {t("appName")}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                font-semibold
                border-b-2
                transition-all

                ${
                  isActive(link.path)
                    ? "border-emerald-800 text-emerald-800"
                    : "border-transparent text-slate-600 hover:text-emerald-800"
                }
              `}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher />
          <OfflineWaterBadge />
          <NotificationDropdown />

          <Link
            to="/settings"
            aria-label={t("settings")}
            title={t("settings")}
            className="
              flex
              items-center
              justify-center
              h-10
              w-10
              rounded-full
              border
              border-emerald-900/10
              bg-emerald-50
              transition-all
              text-emerald-800

              hover:bg-emerald-100

              data-[active=true]:border-emerald-700
              data-[active=true]:bg-emerald-100
            "
            data-active={isActive("/settings")}
          >
            <FaCog className="text-lg" />
          </Link>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-emerald-900/10 px-3 py-2 xl:hidden no-scrollbar">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              flex
              shrink-0
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              font-semibold
              border-b-2
              transition-all

              ${
                isActive(link.path)
                  ? "border-emerald-800 text-emerald-800"
                  : "border-transparent text-slate-600 hover:text-emerald-800"
              }
            `}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

      </nav>
    </header>
  );
};

export default Navbar;

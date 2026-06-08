import { useTranslation } from "react-i18next";
import NotificationDropdown from "./NotificationDropdown";

import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
return (
    <div
      className="
        h-[60px]
        bg-green-700
        shadow-md
        px-4 md:px-6
        flex
        items-center
        justify-between
      "
    >

      {/* LEFT */}

      <div>

        <h1
          className="
            text-xl md:text-3xl
            font-bold
            bg-linear-to-r
            from-white
            to-green-200
            bg-clip-text
            text-transparent
          "
        >{t("appName")}</h1>

      </div>

      {/* RIGHT */}

      <div className="flex items-center mr-12 gap-4">
        <LanguageSwitcher />

        <NotificationDropdown />

      </div>

    </div>
  );
};

export default Navbar;

import { useTranslation }
from "react-i18next";

const LanguageSwitcher =
  () => {

    const { i18n } =
      useTranslation();

    const currentLanguage =
      i18n.language === "hi"
        ? "hi"
        : "en";

    const isHindi =
      currentLanguage === "hi";

    const changeLanguage =
      (lang: string) => {

        i18n.changeLanguage(
          lang
        );

        localStorage.setItem(
          "language",
          lang
        );
      };

    const toggleLanguage =
      () => {
        changeLanguage(
          isHindi ? "en" : "hi"
        );
      };

    return (
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label="Toggle language"
        className="
          relative
          flex
          h-8
          md:h-10
          w-20
          md:w-24
          cursor-pointer
          items-center
          rounded-full
          border
          border-emerald-900/10
          bg-emerald-50
          p-1
          text-sm
          font-bold
          text-green-800
          shadow-inner
          transition-all
          hover:bg-emerald-100
          focus:outline-none
          focus:ring-2
          focus:ring-emerald-700/20
        "
      >
        <span
          className={`
            absolute
            top-1
            h-6
            md:h-8
            w-9
            p-1
            md:w-11
            rounded-full
            bg-emerald-800
            shadow
            transition-transform
            duration-300
            ${isHindi
              ? "translate-x-9 md:translate-x-11"
              : "translate-x-0"}
          `}
        />

        <span
          className={`
            relative
            z-10
            flex-1
            text-center
            transition-colors
            ${!isHindi
              ? "text-white"
              : "text-green-800"}
          `}
        >
          EN
        </span>

        <span
          className={`
            relative
            z-10
            flex-1
            text-center
            transition-colors
            ${isHindi
              ? "text-white"
              : "text-green-800"}
          `}
        >
          हिंदी
        </span>
      </button>
    );
  };

export default LanguageSwitcher;

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
          h-10
          w-24
          cursor-pointer
          items-center
          rounded-full
          bg-green-100
          p-1
          text-sm
          font-bold
          text-green-800
          shadow-inner
          transition-all
          hover:bg-green-200
          focus:outline-none
          focus:ring-2
          focus:ring-white/70
        "
      >
        <span
          className={`
            absolute
            top-1
            h-8
            w-11
            rounded-full
            bg-green-700
            shadow
            transition-transform
            duration-300
            ${isHindi
              ? "translate-x-11"
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

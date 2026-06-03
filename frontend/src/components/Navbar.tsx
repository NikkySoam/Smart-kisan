import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  return (
    <div
      className="
        h-[60px]
        bg-green-700
        shadow-md
        px-6
        flex
        items-center
        justify-between
      "
    >

      {/* LEFT */}

      <div>

        <h1
          className="
            text-3xl
            font-bold
            bg-linear-to-r
            from-white
            to-green-200
            bg-clip-text
            text-transparent
          "
        >
          Smart Kisan
        </h1>

      </div>

      {/* RIGHT */}

      <div className="flex items-center mr-12 gap-5">

        <NotificationDropdown />

      </div>

    </div>
  );
};

export default Navbar;
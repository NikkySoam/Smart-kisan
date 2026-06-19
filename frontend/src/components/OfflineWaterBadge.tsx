import {
  useEffect,
  useState,
} from "react";

import {
  getPendingWaterCount,
} from "../utils/getPendingWaterCount";

const OfflineWaterBadge =
  () => {

    const [
      pendingCount,
      setPendingCount,
    ] = useState(0);

    const [
      online,
      setOnline,
    ] = useState(
      navigator.onLine
    );

    const loadCount =
      async () => {

        const count =
          await getPendingWaterCount();

        setPendingCount(
          count
        );
      };

    useEffect(() => {

      loadCount();

      const handleOnline =
        () => {
          setOnline(true);

          setTimeout(
            loadCount,
            1500
          );
        };

      const handleOffline =
        () =>
          setOnline(false);

      window.addEventListener(
        "online",
        handleOnline
      );

      window.addEventListener(
        "offline",
        handleOffline
      );

      window.addEventListener(
        "offline-entry-added",
        loadCount
        );

      return () => {

        window.removeEventListener(
          "online",
          handleOnline
        );

        window.removeEventListener(
          "offline",
          handleOffline
        );

        window.removeEventListener(
        "offline-entry-added",
        loadCount
        );


      };

    }, []);

    if (
      online &&
      pendingCount === 0
    ) {
      return null;
    }

    return (
      <div
        className={`
          px-3
          py-2
          rounded-xl
          text-sm
          font-semibold
          text-white

          ${
            online
              ? "bg-orange-500"
              : "bg-red-500"
          }
        `}
      >
        {online
          ? `🔄 ${pendingCount} Pending`
          : "🔴 Offline"}
      </div>
    );
};

export default OfflineWaterBadge;
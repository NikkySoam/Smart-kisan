import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import API from "../api/axios";

import { FaBell, FaCheck, FaRegBell } from "react-icons/fa";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const formatNotificationTime = (createdAt: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readingId, setReadingId] = useState("");

  const fetchNotifications = async () => {
    
    try {
      const res = await API.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkReminders =
  async () => {
    try {

      await API.get(
        "/reminders/check",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

  const initialize =
    async () => {

      // CHECK REMINDERS

      await checkReminders();

      // FETCH NOTIFICATIONS

      await fetchNotifications();
    };

  initialize();

}, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleRead = async (id: string) => {
    if (readingId) return;

    setReadingId(id);

    try {
      await API.put(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setReadingId("");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label={t("openNotifications")}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative
          flex
          h-10
          w-10
          cursor-pointer
          items-center
          justify-center
          rounded-full
          border
          border-emerald-900/10
          bg-emerald-50
          text-emerald-800
          transition
          hover:bg-emerald-100
          focus:outline-none
          focus:ring-2
          focus:ring-emerald-700/20
        "
      >
        <FaBell className="text-lg" />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              border-2
              border-white
              bg-red-500
              px-1
              text-[10px]
              font-bold
              leading-none
              text-white
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute
            -right-12
            z-50
            mt-3
            w-[min(380px,calc(100vw-32px))]
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-xl
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              border-b
              border-gray-100
              px-5
              py-4
            "
          >
            <div>
              <h2 className="text-base font-semibold text-gray-900">{t("notifications")}</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {unreadCount > 0
                  ? t("unreadUpdate", { count: unreadCount })
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{t("new")}</span>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center px-8 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FaRegBell className="text-xl" />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-900">{t("noNotifications")}</p>
                <p className="mt-1 text-sm text-gray-500">{t("notificationHelp")}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`
                    group
                    border-b
                    border-gray-100
                    px-5
                    py-4
                    transition
                    last:border-b-0
                    hover:bg-gray-50
                    ${notification.isRead ? "bg-white" : "bg-green-50/60"}
                  `}
                >
                  <div className="flex gap-3">
                    <span
                      className={`
                        mt-1
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${
                          notification.isRead
                            ? "bg-gray-100 text-gray-500"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      <FaBell className="text-sm" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">
                        {notification.message}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-gray-400">
                          {formatNotificationTime(notification.createdAt)}
                        </span>

                        {!notification.isRead && (
                          <button
                            type="button"
                            disabled={!!readingId}
                            onClick={() => handleRead(notification._id)}
                            className="
                              inline-flex
                              cursor-pointer
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              border-green-200
                              bg-white
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-green-700
                              transition
                              disabled:opacity-60
                              disabled:cursor-not-allowed
                              hover:border-green-300
                              hover:bg-green-50
                              focus:outline-none
                              focus:ring-2
                              focus:ring-green-500/30
                            "
                          >
                            <FaCheck className="text-[10px]" />{t("markRead")}</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

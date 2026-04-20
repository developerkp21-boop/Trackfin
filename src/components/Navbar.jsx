import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Menu, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiRequest, NOTIFICATIONS_ENDPOINT } from "../services/api";
import ProfileMenu from "./ProfileMenu";

const typeStyles = {
  success: {
    iconBg: "bg-success bg-opacity-10 text-success",
    rail: "bg-success",
  },
  warning: {
    iconBg: "bg-warning bg-opacity-10 text-warning",
    rail: "bg-warning",
  },
  danger: {
    iconBg: "bg-danger bg-opacity-10 text-danger",
    rail: "bg-danger",
  },
  info: {
    iconBg: "bg-info bg-opacity-10 text-info",
    rail: "bg-info",
  },
  default: {
    iconBg: "bg-secondary bg-opacity-10 text-secondary",
    rail: "bg-secondary",
  },
};

const getRelativeTime = (dateString) => {
  if (!dateString) return "Now";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Now";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSeconds < 60) return "now";

  const units = [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];

  for (const [label, seconds] of units) {
    const value = Math.floor(diffSeconds / seconds);
    if (value >= 1) return `${value}${label}`;
  }

  return "now";
};

const getLink = (notification) => {
  const raw = notification?.link;
  if (!raw || typeof raw !== "string") return null;
  return raw.trim() || null;
};

const Navbar = ({ onMenuClick, role = "user" }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [seenNotificationIds, setSeenNotificationIds] = useState([]);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const data = await apiRequest(NOTIFICATIONS_ENDPOINT);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      if (!silent) {
        toast.error("Failed to load notifications");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const intervalId = window.setInterval(() => {
      fetchNotifications(true);
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const offcanvasElement = document.getElementById("notificationsOffcanvas");
    if (!offcanvasElement) return;

    const handleShow = () => {
      setSeenNotificationIds((prev) => {
        const merged = new Set(prev);
        notifications
          .filter((item) => !item.is_read)
          .forEach((item) => merged.add(item.id));
        return Array.from(merged);
      });
      fetchNotifications(true);
    };

    offcanvasElement.addEventListener("show.bs.offcanvas", handleShow);
    return () => {
      offcanvasElement.removeEventListener("show.bs.offcanvas", handleShow);
    };
  }, [fetchNotifications, notifications]);

  useEffect(() => {
    const handleForegroundNotification = () => {
      fetchNotifications(true);
    };

    window.addEventListener(
      "trackfin:notification-received",
      handleForegroundNotification,
    );

    return () => {
      window.removeEventListener(
        "trackfin:notification-received",
        handleForegroundNotification,
      );
    };
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );
  const unseenUnreadCount = useMemo(
    () =>
      notifications.filter(
        (item) => !item.is_read && !seenNotificationIds.includes(item.id),
      ).length,
    [notifications, seenNotificationIds],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.is_read),
    [notifications],
  );

  const readNotifications = useMemo(
    () => notifications.filter((item) => item.is_read),
    [notifications],
  );

  const markAsRead = async (notification) => {
    if (!notification || notification.is_read) return;

    setActioningId(notification.id);
    try {
      await apiRequest(`${NOTIFICATIONS_ENDPOINT}/${notification.id}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Could not mark as read");
    } finally {
      setActioningId(null);
    }
  };

  const markAllAsRead = async () => {
    const pending = notifications.filter((item) => !item.is_read);
    if (pending.length === 0) return;

    setMarkingAll(true);
    try {
      await Promise.all(
        pending.map((item) =>
          apiRequest(`${NOTIFICATIONS_ENDPOINT}/${item.id}/read`, {
            method: "PATCH",
          }),
        ),
      );

      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Could not mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const openNotificationLink = async (notification) => {
    await markAsRead(notification);

    const link = getLink(notification);
    if (!link) return;

    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.location.assign(link);
      return;
    }

    if (link.startsWith("/")) {
      window.location.assign(link);
      return;
    }

    window.location.assign(`/${link}`);
  };

  const renderNotificationCard = (notification, isReadSection = false) => {
    const style = typeStyles[notification.type] || typeStyles.default;
    const isBusy = actioningId === notification.id;

    return (
      <div
        key={notification.id}
        className={`notification-item ${isReadSection ? "bg-transparent border border-transparent" : "bg-white shadow-sm border border-secondary-subtle"} p-2 p-sm-3 rounded-4 transition-smooth position-relative overflow-hidden`}
      >
        <div className="d-flex gap-2 align-items-start">
          <div className="flex-shrink-0 mt-1">
            <div
              className={`${style.iconBg} rounded-circle d-flex align-items-center justify-content-center`}
              style={{ width: "36px", height: "36px" }}
            >
              <Bell size={14} />
            </div>
          </div>

          <div className="flex-grow-1 min-w-0">
            <div className="d-flex justify-content-between align-items-start mb-1 gap-2">
              <button
                type="button"
                className={`btn btn-link p-0 text-start text-decoration-none ${isReadSection ? "text-secondary" : "text-dark"}`}
                onClick={() => openNotificationLink(notification)}
                disabled={isBusy}
              >
                <span
                  className="fw-semibold d-block text-truncate small"
                  style={{ fontSize: "0.92rem" }}
                >
                  {notification.title || "Notification"}
                </span>
              </button>
              <small
                className="text-secondary fw-medium"
                style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
              >
                {getRelativeTime(notification.created_at)}
              </small>
            </div>

            <p
              className={`mb-2 small ${isReadSection ? "text-muted" : "text-secondary"}`}
              style={{
                lineHeight: 1.35,
                fontSize: "0.88rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {notification.message || "You have a new update."}
            </p>

            <div className="d-flex gap-2">
              {!notification.is_read && (
                <button
                  type="button"
                  className="btn btn-sm btn-light border rounded-pill px-2 py-1 small"
                  onClick={() => markAsRead(notification)}
                  disabled={isBusy}
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        </div>

        {!notification.is_read && (
          <div
            className={`position-absolute top-50 start-0 translate-middle-y ${style.rail} rounded-end`}
            style={{ width: "4px", height: "40%", opacity: 0.8 }}
          />
        )}
      </div>
    );
  };

  return (
    <header className="app-navbar sticky-top z-2 d-flex align-items-center justify-content-between border-bottom border-secondary-subtle bg-app-card px-3 py-2 px-sm-4">
      <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
        <button
          type="button"
          className="btn-icon d-inline-flex d-lg-none align-items-center justify-content-center rounded-3 border border-secondary-subtle text-secondary bg-transparent"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="navbar-title-long fw-semibold text-uppercase text-app-muted fs-7 letter-space-wide text-truncate d-none d-sm-inline">
              {role === "admin" ? "Admin Console" : "Financial command center"}
            </span>
            <span className="navbar-title-short fw-semibold text-uppercase text-app-muted fs-7 d-inline d-sm-none">
              TrackFin
            </span>
            <span
              className={`badge rounded-pill px-2 py-1 fs-7 ${role === "admin" ? "text-bg-danger" : "text-bg-success"}`}
            >
              {role === "admin" ? "Admin" : "User"}
            </span>
          </div>
          <p className="mb-0 fw-semibold text-app-primary small text-truncate d-none d-sm-block">
            {role === "admin"
              ? "Administrative workspace"
              : "Welcome back to TrackFin"}
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-1 gap-sm-2 flex-shrink-0">
        <button
          type="button"
          className="btn-icon nav-notification position-relative d-flex align-items-center justify-content-center rounded-3 border border-secondary-subtle text-secondary bg-transparent"
          data-bs-toggle="offcanvas"
          data-bs-target="#notificationsOffcanvas"
          aria-controls="notificationsOffcanvas"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unseenUnreadCount > 0 && (
            <span
              className="position-absolute top-0 end-0 translate-middle badge rounded-pill text-bg-danger"
              style={{ fontSize: "0.65rem" }}
            >
              {unseenUnreadCount > 99 ? "99+" : unseenUnreadCount}
            </span>
          )}
        </button>

        <div
          className="offcanvas offcanvas-end shadow-lg border-0"
          tabIndex="-1"
          id="notificationsOffcanvas"
          aria-labelledby="notificationsOffcanvasLabel"
          style={{
            width: "380px",
            maxWidth: "100vw",
            borderRadius: "1.5rem 0 0 1.5rem",
          }}
        >
          <div className="offcanvas-header bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <h6
                className="offcanvas-title fw-bolder text-dark mb-0 fs-6"
                id="notificationsOffcanvasLabel"
              >
                Notifications
              </h6>
              <span className="badge bg-danger rounded-pill px-2 py-1 small">
                {unreadCount} New
              </span>
            </div>
            <button
              type="button"
              className="btn-close bg-light rounded-circle p-2"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>

          <div className="offcanvas-body p-0 custom-scrollbar bg-light">
            <div className="d-flex align-items-center justify-content-between px-4 py-2 mt-2">
              <h6 className="text-uppercase text-muted fw-bold small letter-space-wide mb-0">
                Recent
              </h6>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light border rounded-pill px-2 py-1"
                  onClick={() => fetchNotifications()}
                  disabled={loading}
                  title="Refresh"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-light border rounded-pill px-2 py-1"
                  onClick={markAllAsRead}
                  disabled={markingAll || unreadCount === 0}
                  title="Mark all as read"
                >
                  <CheckCheck size={13} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="px-4 py-5 text-center text-muted small">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-5 text-center text-muted small">
                No notifications yet.
              </div>
            ) : (
              <>
                <div className="d-flex flex-column gap-2 px-3 pb-3">
                  {unreadNotifications.length === 0 ? (
                    <div className="bg-white rounded-4 p-3 text-muted small border border-secondary-subtle">
                      No unread notifications.
                    </div>
                  ) : (
                    unreadNotifications.map((notification) =>
                      renderNotificationCard(notification),
                    )
                  )}
                </div>

                {readNotifications.length > 0 && (
                  <>
                    <div className="px-4 py-2 mt-1">
                      <h6 className="text-uppercase text-muted fw-bold small letter-space-wide mb-0">
                        Earlier
                      </h6>
                    </div>
                    <div className="d-flex flex-column gap-2 px-3 pb-4">
                      {readNotifications.map((notification) =>
                        renderNotificationCard(notification, true),
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <ProfileMenu />
      </div>
    </header>
  );
};

export default Navbar;

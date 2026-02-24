import { Bell, Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

const Navbar = ({ onMenuClick, role = "user" }) => (
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
        <span className="position-absolute top-0 end-0 mt-2 me-2 p-1 rounded-circle bg-danger" />
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
            <h5
              className="offcanvas-title fw-bolder text-dark mb-0 fs-5"
              id="notificationsOffcanvasLabel"
            >
              Notifications
            </h5>
            <span className="badge bg-danger rounded-pill px-2 py-1 fs-8">
              3 New
            </span>
          </div>
          <button
            type="button"
            className="btn-close bg-light rounded-circle p-2"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body p-0 custom-scrollbar bg-light">
          {/* Unread Section */}
          <div className="px-4 py-2 mt-2">
            <h6 className="text-uppercase text-muted fw-bold fs-8 letter-space-wide mb-0">
              Recent
            </h6>
          </div>

          <div className="d-flex flex-column gap-2 px-3 pb-3">
            {/* Notification Item 1 */}
            <div
              className="notification-item bg-white p-3 rounded-4 shadow-sm border border-secondary-subtle transition-smooth position-relative overflow-hidden"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex gap-3 align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px" }}
                  >
                    <span className="fw-bolder fs-5">₹</span>
                  </div>
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0 text-dark fw-bold fs-6 text-truncate">
                      Payment Received
                    </h6>
                    <small
                      className="text-secondary fw-medium"
                      style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      10m
                    </small>
                  </div>
                  <p className="mb-0 small text-secondary lh-sm">
                    You received{" "}
                    <span className="fw-bold text-dark">₹15,000</span> for
                    Workspace Rental.
                  </p>
                </div>
              </div>
              <div
                className="position-absolute top-50 start-0 translate-middle-y bg-primary rounded-end"
                style={{ width: "4px", height: "40%", opacity: 0.8 }}
              ></div>
            </div>

            {/* Notification Item 2 */}
            <div
              className="notification-item bg-white p-3 rounded-4 shadow-sm border border-secondary-subtle transition-smooth position-relative overflow-hidden"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex gap-3 align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      paddingLeft: "1px",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  </div>
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0 text-dark fw-bold fs-6 text-truncate">
                      Low Balance Alert
                    </h6>
                    <small
                      className="text-secondary fw-medium"
                      style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      2h
                    </small>
                  </div>
                  <p className="mb-0 small text-secondary lh-sm">
                    Main Bank Account balance dropped below threshold.
                  </p>
                </div>
              </div>
              <div
                className="position-absolute top-50 start-0 translate-middle-y bg-primary rounded-end"
                style={{ width: "4px", height: "40%", opacity: 0.8 }}
              ></div>
            </div>

            {/* Notification Item 3 */}
            <div
              className="notification-item bg-white p-3 rounded-4 shadow-sm border border-secondary-subtle transition-smooth position-relative overflow-hidden"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex gap-3 align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px" }}
                  >
                    <i className="bi bi-calendar2-check-fill fs-5"></i>
                  </div>
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0 text-dark fw-bold fs-6 text-truncate">
                      Weekly Report Ready
                    </h6>
                    <small
                      className="text-secondary fw-medium"
                      style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      1d
                    </small>
                  </div>
                  <p className="mb-0 small text-secondary lh-sm">
                    Your financial summary for this week is generated.
                  </p>
                </div>
              </div>
              <div
                className="position-absolute top-50 start-0 translate-middle-y bg-primary rounded-end"
                style={{ width: "4px", height: "40%", opacity: 0.8 }}
              ></div>
            </div>
          </div>

          {/* Earlier Section (Read) */}
          <div className="px-4 py-2 mt-1">
            <h6 className="text-uppercase text-muted fw-bold fs-8 letter-space-wide mb-0">
              Earlier
            </h6>
          </div>

          <div className="d-flex flex-column gap-2 px-3 pb-4">
            <div
              className="notification-item bg-transparent p-3 rounded-4 border border-transparent transition-smooth"
              style={{ cursor: "pointer", opacity: 0.85 }}
            >
              <div className="d-flex gap-3 align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px" }}
                  >
                    <i className="bi bi-person-check-fill fs-5"></i>
                  </div>
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0 text-secondary fw-bold fs-6 text-truncate">
                      Profile Updated
                    </h6>
                    <small
                      className="text-muted fw-medium"
                      style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                    >
                      3d
                    </small>
                  </div>
                  <p className="mb-0 small text-muted lh-sm">
                    Your preference settings were successfully updated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white p-3 border-top text-center mt-auto shadow-sm"
          style={{ zIndex: 5 }}
        >
          <button className="btn btn-light w-100 rounded-pill fw-bold text-primary py-2 d-flex align-items-center justify-content-center gap-2">
            View All Notifications
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
      <ProfileMenu />
    </div>
  </header>
);

export default Navbar;

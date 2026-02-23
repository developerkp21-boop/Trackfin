import { useRef, useState, useEffect } from "react";
import {
  Camera,
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Smartphone,
  LogOut,
  CheckCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const recentActivity = [
  {
    id: 1,
    action: "Added transaction: Invoice #2045",
    time: "2 hours ago",
    icon: TrendingUp,
    color: "#80c570",
  },
  {
    id: 2,
    action: "Updated budget for Operations",
    time: "1 day ago",
    icon: Wallet,
    color: "#60a5fa",
  },
  {
    id: 3,
    action: "Password changed successfully",
    time: "3 days ago",
    icon: Lock,
    color: "#e8b25e",
  },
  {
    id: 4,
    action: "New goal created: Emergency Fund",
    time: "5 days ago",
    icon: CheckCircle,
    color: "#a78bfa",
  },
  {
    id: 5,
    action: "Login from Chrome on Windows",
    time: "1 week ago",
    icon: Smartphone,
    color: "#94a3b8",
  },
];

const accountStats = [
  { label: "Transactions", value: "128", icon: CreditCard, color: "#60a5fa" },
  { label: "Goals Active", value: "4", icon: TrendingUp, color: "#80c570" },
  { label: "Accounts", value: "4", icon: Wallet, color: "#a78bfa" },
  { label: "Days Active", value: "89", icon: Clock, color: "#e8b25e" },
];

const Profile = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const fileRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("profileActiveTab") || "personal",
  );

  const [profile, setProfile] = useState({
    name: user?.name || "Demo User",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    location: user?.profile?.location || "",
    website: user?.profile?.website || "",
    bio: user?.profile?.bio || "",
    avatar_path: user?.profile?.avatar_path || "",
    role: user?.role || "user",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifications, setNotifications] = useState({
    email_alerts: user?.profile?.email_alerts ?? true,
    budget_warnings: user?.profile?.budget_warnings ?? true,
    goal_reminders: user?.profile?.goal_reminders ?? true,
    weekly_report: user?.profile?.weekly_report ?? false,
    login_alerts: user?.profile?.login_alerts ?? true,
    marketing_emails: user?.profile?.marketing_emails ?? false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const fetchActivities = async (page = 1) => {
    setLoadingActivities(true);
    try {
      const { apiRequest } = await import("../../services/api");
      const data = await apiRequest(
        `/api/trackfin/profile/activity?page=${page}`,
        {
          method: "GET",
        },
      );
      if (data && data.activities) {
        if (page === 1) {
          setActivities(data.activities);
        } else {
          setActivities((prev) => [...prev, ...data.activities]);
        }
        setHasMoreActivities(data.pagination.has_more);
        setActivityPage(page);
      }
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const { apiRequest } = await import("../../services/api");
      const data = await apiRequest("/api/trackfin/profile/sessions", {
        method: "GET",
      });
      if (data && data.sessions) {
        setSessions(data.sessions);
      }
    } catch (error) {
      toast.error("Failed to load active sessions");
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId, isCurrent = false) => {
    const confirmMsg = isCurrent
      ? "Are you sure you want to log out from this session (Your current session)?"
      : "Are you sure you want to log out from this session?";

    if (!window.confirm(confirmMsg)) return;

    if (isCurrent) {
      // If it's the current session, just use the global logout logic
      await logout();
      return;
    }

    try {
      const { apiRequest } = await import("../../services/api");
      const data = await apiRequest(
        `/api/trackfin/profile/sessions/${sessionId}`,
        {
          method: "DELETE",
        },
      );
      if (data.status) {
        toast.success(data.message);
        fetchSessions(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to revoke session.");
    }
  };

  // Sync local state when user from context updates
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        location: user.profile?.location || "",
        website: user.profile?.website || "",
        bio: user.profile?.bio || "",
        avatar_path: user.profile?.avatar_path || "",
        role: user.role || "user",
      });
      setNotifications({
        email_alerts: user.profile?.email_alerts ?? true,
        budget_warnings: user.profile?.budget_warnings ?? true,
        goal_reminders: user.profile?.goal_reminders ?? true,
        weekly_report: user.profile?.weekly_report ?? false,
        login_alerts: user.profile?.login_alerts ?? true,
        marketing_emails: user.profile?.marketing_emails ?? false,
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "activity" && activities.length === 0) {
      fetchActivities(1);
    }
    if (activeTab === "security" && sessions.length === 0) {
      fetchSessions();
    }
    // Persist active tab
    localStorage.setItem("profileActiveTab", activeTab);
  }, [activeTab]);

  const iconMap = {
    TrendingUp,
    Wallet,
    Lock,
    CheckCircle,
    Smartphone,
    User,
    Camera,
    Mail,
    Download,
    Clock,
  };

  const initials =
    profile.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TF";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("name", profile.name);

      await updateProfile(formData);

      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error.message || "Failed to upload avatar");
    }
  };

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(profile);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.next.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);
    try {
      await updatePassword({
        current_password: passwords.current,
        new_password: passwords.next,
        new_password_confirmation: passwords.confirm,
      });
      toast.success("Password updated successfully.");
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (error) {
      setPasswords((p) => ({ ...p, current: "" }));
      toast.error(
        error?.errors?.current_password?.[0] ||
          error.message ||
          "Failed to update password",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const { apiRequest } = await import("../../services/api");
      const data = await apiRequest("/api/trackfin/profile/export", {
        method: "GET",
      });

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trackfin_data_${profile.name.replace(/\s+/g, "_")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Your data has been exported.");
    } catch (error) {
      toast.error("Failed to export data.");
    }
  };

  const handleDeleteAccount = async () => {
    const password = window.prompt(
      "WARNING: This is permanent. Please enter your password to confirm account deletion:",
    );
    if (!password) return;

    try {
      const { apiRequest } = await import("../../services/api");
      await apiRequest("/api/trackfin/profile/delete", {
        method: "DELETE",
        body: JSON.stringify({ password }),
      });
      toast.success("Account deleted. We are sorry to see you go.");
      logout();
    } catch (error) {
      toast.error(
        error?.errors?.password?.[0] ||
          error.message ||
          "Failed to delete account.",
      );
    }
  };

  const toggleNotification = async (key) => {
    const nextState = !notifications[key];
    setNotifications((prev) => ({ ...prev, [key]: nextState }));

    try {
      await updateProfile({ [key]: nextState });
      toast.success("Notification preference saved.");
    } catch (error) {
      setNotifications((prev) => ({ ...prev, [key]: !nextState }));
      toast.error("Failed to save preference.");
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { label: "Weak", color: "#e77a8c", width: 25 },
      { label: "Fair", color: "#e8b25e", width: 50 },
      { label: "Good", color: "#60a5fa", width: 75 },
      { label: "Strong", color: "#80c570", width: 100 },
    ];
    return levels[score - 1] || levels[0];
  };

  const strength = passwordStrength(passwords.next);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "activity", label: "Activity", icon: Clock },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, security, and preferences."
      />

      {/* Profile Hero Card */}
      <Card className="profile-hero-card">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-4">
          {/* Avatar */}
          <div className="position-relative flex-shrink-0">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
              style={{
                width: 88,
                height: 88,
                background: avatarPreview
                  ? "transparent"
                  : "linear-gradient(135deg, #80c570, #60a5fa)",
                cursor: "pointer",
              }}
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview || profile.avatar_path ? (
                <img
                  src={avatarPreview || profile.avatar_path}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  className="fw-bold text-white"
                  style={{ fontSize: "1.6rem" }}
                >
                  {initials}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center rounded-circle border-2 text-white"
              style={{
                width: 28,
                height: 28,
                background: "#0f172a",
                border: "2px solid var(--bg-card)",
                cursor: "pointer",
              }}
              title="Upload photo"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="d-none"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="h4 fw-bold text-app-primary mb-1">
                  {profile.name}
                </h2>
                <p className="text-app-secondary mb-1 small">{profile.email}</p>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Badge
                    variant={profile.role === "admin" ? "danger" : "success"}
                    className="px-3"
                  >
                    {profile.role === "admin" ? "Administrator" : "User"}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                className="p-2 text-danger d-flex align-items-center gap-2 small"
                onClick={logout}
              >
                <LogOut size={14} /> Sign Out
              </Button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="d-flex gap-2 flex-wrap ms-sm-auto">
            {accountStats.map((stat) => (
              <div
                key={stat.label}
                className="text-center px-3 py-2 rounded-3 bg-body-tertiary"
                style={{ minWidth: 72 }}
              >
                <stat.icon
                  size={16}
                  style={{ color: stat.color }}
                  className="mb-1"
                />
                <p className="fw-bold text-app-primary mb-0 small">
                  {stat.value}
                </p>
                <p className="x-small text-app-muted mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="d-flex gap-2 flex-wrap mobile-app-tabs pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 ${activeTab === tab.id ? "btn-primary" : "btn-outline-secondary"}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Personal Info ─────────────────── */}
      {activeTab === "personal" && (
        <div className="row g-3 g-lg-4 mobile-edge-cards">
          <div className="col-lg-8">
            <Card>
              <h3 className="h5 fw-semibold text-app-primary mb-4">
                Personal Information
              </h3>
              <form className="row g-3" onSubmit={handleProfileSubmit}>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <User size={13} className="me-1" /> Full Name
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="name"
                    placeholder="Your full name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <Mail size={13} className="me-1" /> Email Address
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <Phone size={13} className="me-1" /> Phone Number
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <MapPin size={13} className="me-1" /> Location
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="location"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-app-secondary mb-1">
                    <Globe size={13} className="me-1" /> Website / Portfolio
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-app-secondary mb-1">
                    Bio
                  </label>
                  <textarea
                    className="form-control rounded-3"
                    name="bio"
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    value={profile.bio}
                    onChange={handleProfileChange}
                    style={{ resize: "none" }}
                  />
                  <p className="x-small text-app-muted mt-1 mb-0">
                    {profile.bio.length}/200 characters
                  </p>
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right side — role + danger zone */}
          <div className="col-lg-4 d-flex flex-column gap-3">
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">
                Account Role
              </h3>
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-body-tertiary">
                <div className="rounded-3 p-2 bg-success-subtle">
                  <Shield size={20} className="text-success" />
                </div>
                <div>
                  <p className="fw-semibold text-app-primary mb-0 small text-capitalize">
                    {profile.role}
                  </p>
                  <p className="x-small text-app-muted mb-0">
                    Role is assigned by admin
                  </p>
                </div>
              </div>
              <div className="mt-3 d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small py-1 border-bottom">
                  <span className="text-app-muted">Account ID</span>
                  <span className="fw-medium text-app-primary">
                    USR-
                    {user?.id?.toString().slice(0, 8).toUpperCase() || "1001"}
                  </span>
                </div>
                <div className="d-flex justify-content-between small py-1 border-bottom">
                  <span className="text-app-muted">Member since</span>
                  <span className="fw-medium text-app-primary">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Nov 2, 2024"}
                  </span>
                </div>
                <div className="d-flex justify-content-between small py-1">
                  <span className="text-app-muted">Plan</span>
                  <Badge variant="success">
                    {profile.role === "admin" ? "Enterprise" : "Basic"}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="border-danger-subtle position-relative overflow-hidden">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <h3 className="h6 fw-semibold text-danger mb-0">Danger Zone</h3>
                <Badge variant="warning" className="x-small">
                  Coming Soon
                </Badge>
              </div>
              <p className="x-small text-app-muted mb-3">
                These actions are permanent and cannot be undone.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  disabled={true}
                  className="w-100 border-danger text-danger d-flex align-items-center gap-2 justify-content-center btn-sm opacity-50"
                  style={{ cursor: "not-allowed" }}
                >
                  <Download size={14} /> Export My Data
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  disabled={true}
                  className="w-100 border-danger text-danger d-flex align-items-center gap-2 justify-content-center btn-sm opacity-50"
                  style={{ cursor: "not-allowed" }}
                >
                  <Trash2 size={14} /> Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Security ──────────────────────── */}
      {activeTab === "security" && (
        <div className="row g-3 g-lg-4 mobile-edge-cards">
          <div className="col-lg-7">
            <Card>
              <h3 className="h5 fw-semibold text-app-primary mb-4">
                Change Password
              </h3>
              <form
                className="d-flex flex-column gap-3"
                onSubmit={handlePasswordSubmit}
              >
                {/* Current password */}
                <div>
                  <label className="form-label small text-app-secondary mb-1">
                    <Lock size={13} className="me-1" /> Current Password
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control rounded-3 pe-5"
                      name="current"
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, current: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="btn position-absolute end-0 top-50 translate-middle-y p-2 text-muted"
                      onClick={() => setShowCurrent((v) => !v)}
                    >
                      {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="form-label small text-app-secondary mb-1">
                    <Lock size={13} className="me-1" /> New Password
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control rounded-3 pe-5"
                      name="next"
                      type={showNew ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={passwords.next}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, next: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="btn position-absolute end-0 top-50 translate-middle-y p-2 text-muted"
                      onClick={() => setShowNew((v) => !v)}
                    >
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${strength.width}%`,
                            background: strength.color,
                            transition: "all 0.4s",
                          }}
                        />
                      </div>
                      <p
                        className="x-small mt-1 mb-0 fw-medium"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="form-label small text-app-secondary mb-1">
                    Confirm New Password
                  </label>
                  <div className="position-relative">
                    <input
                      className={`form-control rounded-3 pe-5 ${passwords.confirm && passwords.next !== passwords.confirm ? "is-invalid" : passwords.confirm && passwords.next === passwords.confirm ? "is-valid" : ""}`}
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirm: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="btn position-absolute end-0 top-50 translate-middle-y p-2 text-muted"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    {passwords.confirm &&
                      passwords.next !== passwords.confirm && (
                        <div className="invalid-feedback">
                          Passwords do not match.
                        </div>
                      )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-100 mt-1"
                  disabled={isSaving}
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="col-lg-5 d-flex flex-column gap-3">
            {/* Security tips */}
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">
                Security Tips
              </h3>
              <div className="d-flex flex-column gap-3">
                {[
                  {
                    text: "Use a unique password not used on other sites.",
                    ok: true,
                  },
                  {
                    text: "Include uppercase, numbers & symbols.",
                    ok: !!strength && strength.width >= 75,
                  },
                  {
                    text: "Minimum 8 characters recommended.",
                    ok: passwords.next.length >= 8,
                  },
                  { text: "Enable login alerts in notifications.", ok: false },
                ].map((tip, i) => (
                  <div key={i} className="d-flex align-items-start gap-2">
                    {tip.ok ? (
                      <CheckCircle
                        size={14}
                        className="text-success flex-shrink-0 mt-1"
                      />
                    ) : (
                      <AlertTriangle
                        size={14}
                        className="text-warning flex-shrink-0 mt-1"
                      />
                    )}
                    <p className="x-small text-app-secondary mb-0">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Sessions */}
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">
                Active Sessions
              </h3>
              <div className="d-flex flex-column gap-3">
                {loadingSessions ? (
                  <p className="small text-app-muted py-2 text-center">
                    Loading sessions...
                  </p>
                ) : sessions.length === 0 ? (
                  <p className="small text-app-muted py-2 text-center">
                    No active sessions found.
                  </p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="d-flex align-items-center justify-content-between gap-2"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className={`rounded-3 p-2 ${session.is_current ? "bg-success-subtle" : "bg-body-tertiary"}`}
                        >
                          <Smartphone
                            size={14}
                            className={
                              session.is_current
                                ? "text-success"
                                : "text-app-muted"
                            }
                          />
                        </div>
                        <div>
                          <p className="small fw-medium text-app-primary mb-0">
                            {session.device}
                          </p>
                          <p className="x-small text-app-muted mb-0">
                            {session.created_at} · Last active:{" "}
                            {session.last_active}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {session.is_current && (
                          <Badge variant="success">Current</Badge>
                        )}
                        <Button
                          variant="ghost"
                          className="p-1 text-danger x-small"
                          onClick={() =>
                            handleRevokeSession(session.id, session.is_current)
                          }
                        >
                          <LogOut size={13} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Notifications ─────────────────── */}
      {activeTab === "notifications" && (
        <div className="row g-3 g-lg-4 mobile-edge-cards">
          <div className="col-lg-8">
            <Card>
              <h3 className="h5 fw-semibold text-app-primary mb-4">
                Notification Preferences
              </h3>
              <div className="d-flex flex-column gap-0">
                {[
                  {
                    key: "email_alerts",
                    label: "Email Alerts",
                    desc: "Receive important account alerts via email",
                    icon: Mail,
                  },
                  {
                    key: "budget_warnings",
                    label: "Budget Warnings",
                    desc: "Get notified when budget exceeds 80% threshold",
                    icon: AlertTriangle,
                  },
                  {
                    key: "goal_reminders",
                    label: "Goal Reminders",
                    desc: "Weekly reminders to top up your savings goals",
                    icon: TrendingUp,
                  },
                  {
                    key: "weekly_report",
                    label: "Weekly Report",
                    desc: "Summary of your financial activity each week",
                    icon: CreditCard,
                  },
                  {
                    key: "login_alerts",
                    label: "Login Alerts",
                    desc: "Notify on new device logins for security",
                    icon: Smartphone,
                  },
                  {
                    key: "marketing_emails",
                    label: "Marketing Emails",
                    desc: "Updates about new TrackFin features and offers",
                    icon: Bell,
                  },
                ].map((item, i, arr) => (
                  <div
                    key={item.key}
                    className={`d-flex align-items-center justify-content-between py-3 gap-3 ${i < arr.length - 1 ? "border-bottom" : ""}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 p-2 bg-body-tertiary flex-shrink-0">
                        <item.icon size={15} className="text-app-secondary" />
                      </div>
                      <div>
                        <p className="small fw-medium text-app-primary mb-0">
                          {item.label}
                        </p>
                        <p className="x-small text-app-muted mb-0">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div className="form-check form-switch mb-0 flex-shrink-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={notifications[item.key]}
                        onChange={() => toggleNotification(item.key)}
                        style={{
                          width: "2.5rem",
                          height: "1.3rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="col-lg-4">
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">
                Quick Summary
              </h3>
              <div className="d-flex flex-column gap-2">
                <div className="rounded-3 p-3 bg-success-subtle">
                  <p className="small fw-semibold text-success mb-1">
                    {Object.values(notifications).filter(Boolean).length} alerts
                    active
                  </p>
                  <p className="x-small text-app-secondary mb-0">
                    You'll be notified for important events
                  </p>
                </div>
                <div className="rounded-3 p-3 bg-body-tertiary">
                  <p className="x-small text-app-muted mb-0">
                    Notification delivery is via the email{" "}
                    <strong>{profile.email}</strong>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Activity ──────────────────────── */}
      {activeTab === "activity" && (
        <div className="mobile-edge-cards">
          <Card>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="h5 fw-semibold text-app-primary mb-0">
                  Account Activity
                </h3>
                <p className="small text-app-secondary mb-0">
                  Detailed log of your recent actions
                </p>
              </div>
              <Button
                variant="outline"
                className="btn-sm d-flex align-items-center gap-2"
                onClick={handleExportData}
              >
                <Download size={14} /> Export Log
              </Button>
            </div>
            <div className="d-flex flex-column">
              {activities.length === 0 && loadingActivities ? (
                <p className="small text-app-muted py-3 text-center">
                  Loading activity log...
                </p>
              ) : activities.length === 0 ? (
                <p className="small text-app-muted py-3 text-center">
                  No recent activity found.
                </p>
              ) : (
                <>
                  {activities.map((item, i) => {
                    const DynamicIcon = iconMap[item.icon] || Clock;
                    return (
                      <div
                        key={item.id}
                        className={`d-flex align-items-start gap-3 py-3 ${i < activities.length - 1 || hasMoreActivities ? "border-bottom" : ""}`}
                      >
                        <div className="position-relative flex-shrink-0">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: 38,
                              height: 38,
                              background: item.color + "22",
                            }}
                          >
                            <DynamicIcon
                              size={15}
                              style={{ color: item.color }}
                            />
                          </div>
                          {(i < activities.length - 1 || hasMoreActivities) && (
                            <div
                              className="position-absolute start-50 translate-middle-x"
                              style={{
                                top: 38,
                                width: 1,
                                height: "100%",
                                background: "var(--border-subtle)",
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="small fw-medium text-app-primary mb-0">
                            {item.action}
                          </p>
                          <p className="x-small text-app-muted mb-0 d-flex align-items-center gap-1">
                            <Clock size={13} /> {item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {hasMoreActivities && (
                    <div className="text-center mt-3 pt-2">
                      <Button
                        variant="ghost"
                        className="btn-sm text-app-secondary py-2 w-100 border-dashed"
                        onClick={() => fetchActivities(activityPage + 1)}
                        disabled={loadingActivities}
                        style={{ border: "1px dashed var(--border-subtle)" }}
                      >
                        {loadingActivities
                          ? "Fetching more records..."
                          : "Load More Activity"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;

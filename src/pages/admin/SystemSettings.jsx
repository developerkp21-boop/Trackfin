import { useState, useEffect } from "react";
import {
  Settings,
  Zap,
  Mail,
  Megaphone,
  Wrench,
  Shield,
  Plus,
  X,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import {
  apiRequest,
  ADMIN_SETTINGS_ENDPOINT,
  ADMIN_ANNOUNCEMENTS_ENDPOINT,
} from "../../services/api";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────
const TABS = [
  { key: "general", label: "General", icon: Settings },
  { key: "features", label: "Features", icon: Zap },
  { key: "email", label: "Email Config", icon: Mail },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
  { key: "security", label: "Security", icon: Shield },
];

// ─────────────────────────────────────────────
// Toggle Row
// ─────────────────────────────────────────────
const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="d-flex align-items-center justify-content-between rounded-3 border border-app-subtle bg-body-tertiary px-3 py-3 small">
    <div>
      <p className="fw-medium text-app-primary mb-1">{label}</p>
      {description && <p className="mb-0 text-app-muted">{description}</p>}
    </div>
    <div className="form-check form-switch mb-0">
      <input
        type="checkbox"
        className="form-check-input"
        role="switch"
        checked={checked}
        onChange={onChange}
        style={{ cursor: "pointer" }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Announcement type badge
// ─────────────────────────────────────────────
const annBadge = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [features, setFeatures] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [maintenance, setMaintenance] = useState(false);
  const [requireMFA, setRequireMFA] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [auditLog, setAuditLog] = useState(true);
  const [platformConfig, setPlatformConfig] = useState({});
  const [loading, setLoading] = useState(true);

  // New announcement form state
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [setRes, annRes] = await Promise.all([
        apiRequest(ADMIN_SETTINGS_ENDPOINT),
        apiRequest(ADMIN_ANNOUNCEMENTS_ENDPOINT),
      ]);

      if (setRes?.success) {
        const rawSettings = setRes.data;
        const featuresList = rawSettings
          .filter((s) => s.group === "features")
          .map((s) => ({
            id: s.id,
            key: s.key,
            label: s.label,
            description: s.description,
            enabled: s.value === true || s.value === "true",
          }));
        setFeatures(featuresList);

        const config = {};
        rawSettings
          .filter((s) => s.group === "general")
          .forEach((s) => {
            config[s.key] = s.value;
          });
        setPlatformConfig(config);

        setAuditLog(
          config.audit_logging === true || config.audit_logging === "true",
        );
        setMaintenance(
          config.maintenance_mode === true ||
            config.maintenance_mode === "true",
        );
        setRequireMFA(
          config.require_mfa === true || config.require_mfa === "true",
        );
      }

      if (annRes?.success) {
        setAnnouncements(annRes.data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleFeature = async (id, key, enabled) => {
    try {
      const res = await apiRequest(`${ADMIN_SETTINGS_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify({ settings: [{ key, value: !enabled }] }),
      });
      if (res?.success) {
        setFeatures((prev) =>
          prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)),
        );
        toast.success("Feature flag updated");
      }
    } catch (error) {
      toast.error("Failed to update feature");
    }
  };

  const handleSave = async (group = "general", data = {}) => {
    try {
      const settings = Object.keys(data).map((key) => ({
        key,
        value: data[key],
      }));
      const res = await apiRequest(`${ADMIN_SETTINGS_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify({ settings }),
      });
      if (res?.success) {
        toast.success("Settings saved successfully");
        fetchSettings();
      }
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const createAnnouncement = async () => {
    if (!annForm.title || !annForm.message) {
      toast.error("Title and message are required.");
      return;
    }
    try {
      const res = await apiRequest(ADMIN_ANNOUNCEMENTS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ ...annForm, is_active: true }),
      });
      if (res?.success) {
        toast.success("Announcement created.");
        fetchSettings();
        setAnnForm({ title: "", message: "", type: "info" });
        setShowAnnForm(false);
      }
    } catch (error) {
      toast.error("Failed to create announcement");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      const res = await apiRequest(`${ADMIN_ANNOUNCEMENTS_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      if (res?.success) {
        toast.success("Announcement removed.");
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete announcement");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="System Settings"
        subtitle="Control platform features, security, email, announcements, and maintenance mode."
      />

      {/* ─── Tab Nav ─── */}
      <div className="d-flex flex-wrap gap-1 border-bottom border-app-subtle pb-0">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`btn btn-sm d-flex align-items-center gap-2 rounded-top-3 rounded-bottom-0 px-3 py-2 border-0 border-bottom ${
              activeTab === key
                ? "bg-body-secondary text-app-primary fw-semibold border-bottom border-primary border-2"
                : "bg-transparent text-app-secondary"
            }`}
            style={{
              borderBottomWidth: activeTab === key ? "2px" : "0",
              marginBottom: "-1px",
            }}
          >
            <Icon size={14} />
            <span className="small">{label}</span>
          </button>
        ))}
      </div>

      {/* ──────────── GENERAL ──────────── */}
      {activeTab === "general" && (
        <div className="row g-4">
          <div className="col-lg-7">
            <Card>
              <h6 className="fw-semibold text-app-primary mb-4">
                Platform Configuration
              </h6>
              <Input
                label="Support Email"
                placeholder="support@trackfin.com"
                defaultValue="support@trackfin.com"
              />
              <Input
                label="Platform Name"
                placeholder="TrackFin"
                defaultValue="TrackFin"
              />
              <Input
                label="Default Currency"
                placeholder="USD"
                defaultValue="USD"
              />
              <Input
                label="Billing Cycle"
                placeholder="Monthly"
                defaultValue="Monthly"
              />
              <div className="mb-3">
                <ToggleRow
                  label="Enable Audit Logging"
                  description="Track all user actions for compliance and monitoring."
                  checked={auditLog}
                  onChange={() => setAuditLog((v) => !v)}
                />
              </div>
              <div className="d-flex justify-content-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ──────────── FEATURES ──────────── */}
      {activeTab === "features" && (
        <Card>
          <h6 className="fw-semibold text-app-primary mb-4">Feature Flags</h6>
          <div className="d-flex flex-column gap-2">
            {features.map((feature) => (
              <ToggleRow
                key={feature.id}
                label={feature.label}
                description={feature.description}
                checked={feature.enabled}
                onChange={() =>
                  toggleFeature(feature.id, feature.key, feature.enabled)
                }
              />
            ))}
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button onClick={handleSave}>Save Feature Flags</Button>
          </div>
        </Card>
      )}

      {/* ──────────── EMAIL CONFIG ──────────── */}
      {activeTab === "email" && (
        <div className="row g-4">
          <div className="col-lg-7">
            <Card>
              <h6 className="fw-semibold text-app-primary mb-4">
                SMTP / Email Configuration
              </h6>
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <Input
                    label="SMTP Host"
                    placeholder="smtp.mailgun.org"
                    defaultValue="smtp.mailgun.org"
                  />
                </div>
                <div className="col-md-4">
                  <Input label="Port" placeholder="587" defaultValue="587" />
                </div>
              </div>
              <Input
                label="SMTP Username"
                placeholder="postmaster@trackfin.com"
              />
              <Input
                label="SMTP Password"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="From Address"
                placeholder="no-reply@trackfin.com"
                defaultValue="no-reply@trackfin.com"
              />
              <Input
                label="From Name"
                placeholder="TrackFin"
                defaultValue="TrackFin"
              />
              <div className="d-flex justify-content-end gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => toast.success("Test email sent!")}
                >
                  Send Test Email
                </Button>
                <Button onClick={handleSave}>Save Config</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ──────────── ANNOUNCEMENTS ──────────── */}
      {activeTab === "announcements" && (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShowAnnForm((v) => !v)}>
              <Plus size={16} />
              {showAnnForm ? "Cancel" : "New Announcement"}
            </Button>
          </div>

          {showAnnForm && (
            <Card>
              <h6 className="fw-semibold text-app-primary mb-3">
                Create Announcement
              </h6>
              <div className="mb-3">
                <label className="form-label small text-app-secondary">
                  Title
                </label>
                <input
                  className="form-control rounded-3"
                  placeholder="Announcement title"
                  value={annForm.title}
                  onChange={(e) =>
                    setAnnForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-app-secondary">
                  Message
                </label>
                <textarea
                  className="form-control rounded-3"
                  rows={3}
                  placeholder="Your announcement message…"
                  value={annForm.message}
                  onChange={(e) =>
                    setAnnForm((f) => ({ ...f, message: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <Select
                  label="Type"
                  value={annForm.type}
                  onChange={(e) =>
                    setAnnForm((f) => ({ ...f, type: e.target.value }))
                  }
                  wrapperClassName="mb-0"
                  isSearchable
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Alert</option>
                </Select>
              </div>
              <div className="d-flex justify-content-end">
                <Button onClick={createAnnouncement}>
                  Publish Announcement
                </Button>
              </div>
            </Card>
          )}

          {announcements.map((ann) => (
            <Card key={ann.id}>
              <div className="d-flex align-items-start gap-3">
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <p className="fw-semibold text-app-primary mb-0">
                      {ann.title}
                    </p>
                    <Badge variant={annBadge[ann.type]}>{ann.type}</Badge>
                    {ann.active && <Badge variant="success">active</Badge>}
                  </div>
                  <p className="small text-app-secondary mb-1">{ann.message}</p>
                  <p className="small text-app-muted mb-0">
                    Created: {ann.createdAt}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger flex-shrink-0"
                  onClick={() => deleteAnnouncement(ann.id)}
                >
                  <X size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ──────────── MAINTENANCE ──────────── */}
      {activeTab === "maintenance" && (
        <div className="row g-4">
          <div className="col-lg-7">
            {maintenance && (
              <div
                className="alert alert-warning d-flex align-items-center gap-2 rounded-3 mb-0"
                role="alert"
              >
                <Wrench size={18} />
                <div>
                  <strong>Maintenance mode is ON.</strong> All users will see a
                  maintenance page until you disable this.
                </div>
              </div>
            )}
            <Card className="mt-3">
              <h6 className="fw-semibold text-app-primary mb-4">
                Maintenance Mode
              </h6>
              <ToggleRow
                label="Enable Maintenance Mode"
                description="When enabled, users will see a maintenance page. Admins can still access the platform."
                checked={maintenance}
                onChange={() => setMaintenance((v) => !v)}
              />
              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant={maintenance ? "danger" : "primary"}
                  onClick={() =>
                    toast.success(
                      maintenance
                        ? "Maintenance mode enabled."
                        : "Maintenance mode disabled.",
                    )
                  }
                >
                  {maintenance
                    ? "Apply Maintenance Mode"
                    : "Maintenance Mode Off"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ──────────── SECURITY ──────────── */}
      {activeTab === "security" && (
        <div className="row g-4">
          <div className="col-lg-7">
            <Card>
              <h6 className="fw-semibold text-app-primary mb-4">
                Security Policy
              </h6>
              <div className="d-flex flex-column gap-2 mb-4">
                <ToggleRow
                  label="Require Multi-Factor Authentication"
                  description="Force all users to enable 2FA before they can access the dashboard."
                  checked={requireMFA}
                  onChange={() => setRequireMFA((v) => !v)}
                />
                <ToggleRow
                  label="IP Allowlist"
                  description="Restrict admin access to trusted IP address ranges only."
                  checked={ipAllowlist}
                  onChange={() => setIpAllowlist((v) => !v)}
                />
              </div>
              <Input
                label="Session Timeout (minutes)"
                placeholder="60"
                defaultValue="60"
              />
              <Input
                label="Max Login Attempts"
                placeholder="5"
                defaultValue="5"
              />
              <div className="d-flex justify-content-end mt-2">
                <Button onClick={handleSave}>Update Security Policy</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;

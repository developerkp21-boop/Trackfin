import { useState, useEffect, useCallback } from "react";
import { Send, Mail, Smartphone, RadioTower, Users, Info, History, Calendar, CheckCircle2, Loader2, Search, User } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import toast from "react-hot-toast";
import { apiRequest, ADMIN_BROADCAST_ENDPOINT, ADMIN_BROADCAST_HISTORY_ENDPOINT } from "../../services/api";
import { getUserList } from "../../services/adminApi";

const Broadcast = () => {
    const [activeTab, setActiveTab] = useState("email");
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        sendEmail: true,
        sendPush: false,
        target_role: "all",
        target_user_id: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    useEffect(() => {
        if (activeTab === "email") {
            setFormData(prev => ({ ...prev, sendEmail: true, sendPush: false }));
        } else if (activeTab === "fcm") {
            setFormData(prev => ({ ...prev, sendEmail: false, sendPush: true }));
        }
    }, [activeTab]);

    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userSearchText, setUserSearchText] = useState("");
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const fetchUsers = useCallback(async (search = "") => {
        try {
            setIsLoadingUsers(true);
            const response = await getUserList({ search, page: 1 });
            setUsers(response?.data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        if (formData.target_role === "single") {
            const timer = setTimeout(() => fetchUsers(userSearchText), 300);
            return () => clearTimeout(timer);
        }
    }, [userSearchText, formData.target_role, fetchUsers]);

    const fetchHistory = useCallback(async () => {
        try {
            setIsLoadingHistory(true);
            const response = await apiRequest(ADMIN_BROADCAST_HISTORY_ENDPOINT);
            const historyData = Array.isArray(response) ? response : (response?.data || []);
            setHistory(historyData);
        } catch (error) {
            console.error("Failed to fetch broadcast history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "target_role" && value !== "single" ? { target_user_id: "" } : {}),
        }));
        if (name === "target_role" && value === "single" && users.length === 0) {
            fetchUsers("");
        }
    };

    const handleUserSelect = (user) => {
        setFormData(prev => ({ ...prev, target_user_id: user.id }));
        setUserSearchText(user.name);
        setShowUserDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentData = {
            ...formData,
            sendEmail: activeTab === "email",
            sendPush: activeTab === "fcm",
        };
        if (!currentData.title || !currentData.message) {
            toast.error("Title and Message are required.");
            return;
        }
        if (currentData.target_role === "single" && !currentData.target_user_id) {
            toast.error("Please select a target user.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await apiRequest(ADMIN_BROADCAST_ENDPOINT, {
                method: "POST",
                body: JSON.stringify(currentData)
            });
            toast.success(response.message || "Broadcast sent successfully!");
            setFormData(prev => ({ ...prev, title: "", message: "", target_user_id: "" }));
            setUserSearchText("");
            fetchHistory();
        } catch (error) {
            console.error("Broadcast Submit Error:", error);
            toast.error(error.payload?.message || error.message || "Failed to send broadcast");
        } finally {
            setIsSubmitting(false);
        }
    };

    const TABS = [
        { id: "email", label: "Email", icon: Mail, color: "#f59e0b" },
        { id: "fcm", label: "Push", icon: Smartphone, color: "#3b82f6" },
        { id: "history", label: "History", icon: History, color: "#64748b" },
    ];

    return (
        <div style={{ paddingBottom: "5rem" }}>
            <div className="mb-4">
                <PageHeader
                    title="Broadcaster"
                    subtitle="Send announcements via Email and Push Notifications."
                    actions={
                        <div className="d-none d-md-inline-flex align-items-center gap-2 text-success">
                            <RadioTower size={18} />
                            <span className="small fw-semibold">Admin Communications</span>
                        </div>
                    }
                />
            </div>

            {/* ── Desktop Tab Bar (hidden on mobile) ── */}
            <div className="d-none d-md-inline-flex gap-2 mb-4 bg-light p-1 rounded-4 shadow-sm border border-app-subtle">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0 font-display fw-semibold transition-smooth ${activeTab === tab.id ? "bg-white shadow-sm text-app-primary" : "bg-transparent text-app-secondary"}`}
                    >
                        <tab.icon size={16} style={{ color: activeTab === tab.id ? tab.color : "#94a3b8" }} />
                        <span className="text-nowrap">{tab.label === "Push" ? "Push Notification" : tab.label === "Email" ? "Email Blast" : "Broadcast History"}</span>
                    </button>
                ))}
            </div>

            {/* ── Tab Content ── */}
            {activeTab !== "history" ? (
                <div className="card border-0 shadow-sm rounded-4">
                    {/* Card Header */}
                    <div className="card-header bg-transparent border-bottom border-app-subtle px-3 px-md-4 py-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                {activeTab === "email"
                                    ? <Mail size={18} className="text-warning" />
                                    : <Smartphone size={18} className="text-primary" />}
                                <h5 className="mb-0 fw-bold font-display fs-6 fs-md-5">
                                    {activeTab === "email" ? "Email Blast" : "Push Notification"}
                                </h5>
                            </div>
                            <span className="badge rounded-pill text-app-secondary border border-app-subtle px-2 py-1" style={{ fontSize: "0.72rem", background: "var(--bg-secondary)" }}>
                                {activeTab === "email" ? "SMTP" : "FCM"}
                            </span>
                        </div>
                    </div>

                    {/* Card Body / Form */}
                    <div className="card-body px-3 px-md-4 py-4">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                            {/* Title */}
                            <Input
                                label={activeTab === "email" ? "Email Subject" : "Notification Title"}
                                name="title"
                                placeholder={activeTab === "email" ? "e.g. Weekly Summary" : "e.g. New Alert"}
                                value={formData.title}
                                onChange={handleChange}
                                required
                                wrapperClassName="mb-0"
                            />

                            {/* Message */}
                            <div className="d-flex flex-column gap-1">
                                <label className="fw-semibold text-app-secondary small mb-0">
                                    {activeTab === "email" ? "Email Content" : "Message"}
                                </label>
                                <textarea
                                    className="input-field"
                                    name="message"
                                    rows="5"
                                    placeholder={activeTab === "email" ? "Write your email content..." : "Write a short message..."}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    style={{ resize: "vertical", minHeight: "130px" }}
                                />
                            </div>

                            {/* Audience + User Picker */}
                            <div className="row g-3">
                                <div className={formData.target_role === "single" ? "col-12 col-md-6" : "col-12 col-md-6"}>
                                    <Select
                                        label={
                                            <span className="d-flex align-items-center gap-1">
                                                <Users size={13} /> Target Audience
                                            </span>
                                        }
                                        name="target_role"
                                        value={formData.target_role}
                                        onChange={handleChange}
                                        wrapperClassName="mb-0"
                                        isSearchable={false}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="user">Standard Users</option>
                                        <option value="admin">Admins Only</option>
                                        <option value="single">Single User</option>
                                    </Select>
                                </div>

                                {formData.target_role === "single" && (
                                    <div className="col-12 col-md-6">
                                        <div className="position-relative">
                                            <label className="fw-semibold text-app-secondary small mb-1 d-flex align-items-center gap-1">
                                                <User size={13} /> Select User
                                            </label>
                                            <div className="position-relative">
                                                <Search className="position-absolute top-50 start-0 ms-3 text-app-muted" size={15} style={{ transform: "translateY(-50%)", pointerEvents: "none" }} />
                                                <input
                                                    type="text"
                                                    className="input-field ps-5"
                                                    placeholder="Search by name..."
                                                    value={userSearchText}
                                                    onChange={(e) => { setUserSearchText(e.target.value); setShowUserDropdown(true); }}
                                                    onFocus={() => setShowUserDropdown(true)}
                                                />
                                                {isLoadingUsers && (
                                                    <Loader2 className="position-absolute top-50 end-0 me-3 text-app-muted" size={15} style={{ transform: "translateY(-50%)", animation: "spin 1s linear infinite" }} />
                                                )}
                                            </div>
                                            {showUserDropdown && (
                                                <div
                                                    className="position-absolute w-100 mt-1 rounded-3 shadow-lg overflow-hidden border border-app-subtle"
                                                    style={{ zIndex: 9999, maxHeight: "220px", overflowY: "auto", background: "var(--bg-card)" }}
                                                >
                                                    {users.length === 0 ? (
                                                        <div className="p-3 text-center text-app-muted small">
                                                            {isLoadingUsers ? "Searching..." : "No users found."}
                                                        </div>
                                                    ) : (
                                                        users.map(user => (
                                                            <div
                                                                key={user.id}
                                                                className={`p-2 px-3 d-flex align-items-center gap-2 border-bottom border-app-subtle ${formData.target_user_id === user.id ? "bg-light" : ""}`}
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleUserSelect(user)}
                                                            >
                                                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 32, height: 32, minWidth: 32, fontSize: "0.8rem", background: "var(--brand-strong)" }}>
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <div className="fw-semibold text-truncate" style={{ fontSize: "0.85rem" }}>{user.name}</div>
                                                                    <div className="text-app-secondary text-truncate" style={{ fontSize: "0.72rem" }}>{user.email}</div>
                                                                </div>
                                                                {formData.target_user_id === user.id && (
                                                                    <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                            {showUserDropdown && (
                                                <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowUserDropdown(false)} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mt-2 pt-3 border-top border-app-subtle">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-shrink-0"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, title: "", message: "", target_user_id: "" }));
                                        setUserSearchText("");
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Clear
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    className="d-flex align-items-center justify-content-center gap-2 w-100"
                                >
                                    <Send size={15} />
                                    {isSubmitting ? "Sending..." : `Send ${activeTab === "email" ? "Email" : "Notification"}`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-header bg-transparent border-bottom border-app-subtle px-3 px-md-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                            <History size={17} className="text-secondary" />
                            <h5 className="mb-0 fw-bold font-display fs-6">Broadcast History</h5>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        {isLoadingHistory ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                                <Loader2 size={24} className="text-app-primary" style={{ animation: "spin 1s linear infinite" }} />
                                <span className="text-app-secondary small">Loading history...</span>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2">
                                <Info size={24} className="text-app-muted" />
                                <span className="text-app-secondary small">No broadcasts sent yet.</span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column">
                                {history.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`px-3 px-md-4 py-3 d-flex align-items-start gap-3 ${idx < history.length - 1 ? "border-bottom border-app-subtle" : ""}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setSelectedHistoryItem(item)}
                                    >
                                        {/* Channel Icon Pill */}
                                        <div className="d-flex flex-column align-items-center gap-1 flex-shrink-0 mt-1">
                                            {(item.channels || []).includes("Email") && (
                                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, background: "rgba(245,158,11,0.12)" }}>
                                                    <Mail size={15} style={{ color: "#f59e0b" }} />
                                                </div>
                                            )}
                                            {(item.channels || []).includes("Push") && (
                                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, background: "rgba(59,130,246,0.12)" }}>
                                                    <Smartphone size={15} style={{ color: "#3b82f6" }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="fw-semibold text-app-primary text-truncate" style={{ fontSize: "0.9rem" }}>
                                                {item.title}
                                            </div>
                                            <div className="text-app-secondary text-truncate mt-1" style={{ fontSize: "0.78rem" }}>
                                                {item.message}
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                                <span className="badge rounded-pill px-2 py-1" style={{ fontSize: "0.68rem", background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>
                                                    {item.target_role || "All"}
                                                </span>
                                                <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: "0.72rem" }}>
                                                    <Calendar size={11} />
                                                    {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex-shrink-0">
                                            <span className="d-flex align-items-center gap-1 text-success" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                                                <CheckCircle2 size={13} />
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Mobile Bottom Tab Bar ── */}
            <div
                className="d-flex d-md-none position-fixed bottom-0 start-0 end-0 border-top border-app-subtle"
                style={{
                    background: "var(--bg-card)",
                    zIndex: 200,
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                    boxShadow: "0 -4px 20px rgba(15,23,42,0.08)"
                }}
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 border-0"
                        style={{
                            background: "transparent",
                            padding: "0.65rem 0.25rem",
                            color: activeTab === tab.id ? tab.color : "var(--text-muted)",
                            transition: "color 0.2s",
                        }}
                    >
                        <tab.icon size={20} />
                        <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.02em" }}>
                            {tab.label}
                        </span>
                        {activeTab === tab.id && (
                            <span style={{
                                width: 20, height: 3, borderRadius: 2,
                                background: tab.color, position: "absolute", bottom: "env(safe-area-inset-bottom, 0px)"
                            }} />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Details Modal ── */}
            {selectedHistoryItem && (
                <>
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 1040, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
                        onClick={() => setSelectedHistoryItem(null)}
                    />
                    <div
                        className="position-fixed top-50 start-50 translate-middle w-100 px-3"
                        style={{ zIndex: 1050, maxWidth: "520px" }}
                    >
                        <div className="rounded-4 overflow-hidden shadow-lg" style={{ background: "var(--bg-card)" }}>
                            {/* Modal Header */}
                            <div className="px-4 py-3 border-bottom border-app-subtle d-flex align-items-center justify-content-between" style={{ background: "var(--bg-secondary)" }}>
                                <div className="d-flex align-items-center gap-2">
                                    <Info size={17} className="text-app-primary" />
                                    <h6 className="mb-0 fw-bold font-display">Broadcast Details</h6>
                                </div>
                                <button
                                    className="btn-close btn-close-sm shadow-none"
                                    style={{ fontSize: "0.7rem" }}
                                    onClick={() => setSelectedHistoryItem(null)}
                                />
                            </div>

                            {/* Modal Body */}
                            <div className="p-4 d-flex flex-column gap-3">
                                <div>
                                    <p className="text-muted mb-1" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject</p>
                                    <p className="fw-bold text-app-primary mb-0">{selectedHistoryItem.title}</p>
                                </div>

                                <div className="rounded-3 p-3 border border-app-subtle" style={{ background: "var(--bg-secondary)" }}>
                                    <p className="text-muted mb-1" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Message</p>
                                    <p className="mb-0 text-app-secondary" style={{ whiteSpace: "pre-wrap", fontSize: "0.88rem" }}>
                                        {selectedHistoryItem.message}
                                    </p>
                                </div>

                                <div className="row g-2">
                                    <div className="col-6">
                                        <div className="rounded-3 p-3 border border-app-subtle h-100" style={{ background: "var(--bg-secondary)" }}>
                                            <p className="text-muted mb-1" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Audience</p>
                                            <span className="badge text-capitalize px-2 py-1" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", fontSize: "0.78rem" }}>
                                                {selectedHistoryItem.target_role || "All"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="rounded-3 p-3 border border-app-subtle h-100" style={{ background: "var(--bg-secondary)" }}>
                                            <p className="text-muted mb-1" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Channels</p>
                                            <div className="d-flex gap-1 flex-wrap">
                                                {(selectedHistoryItem.channels || []).map((ch, i) => (
                                                    <span key={i} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ fontSize: "0.75rem", fontWeight: 600, background: ch === "Push" ? "rgba(59,130,246,0.1)" : "rgba(245,158,11,0.1)", color: ch === "Push" ? "#3b82f6" : "#d97706" }}>
                                                        {ch === "Push" ? <Smartphone size={10} /> : <Mail size={10} />}
                                                        {ch}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="rounded-3 p-3 border border-app-subtle h-100" style={{ background: "var(--bg-secondary)" }}>
                                            <p className="text-muted mb-1" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</p>
                                            <div className="d-flex align-items-center gap-1 text-app-primary" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                                                <Calendar size={13} />
                                                {new Date(selectedHistoryItem.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="rounded-3 p-3 border border-success-subtle h-100" style={{ background: "rgba(34,197,94,0.07)" }}>
                                            <p className="text-muted mb-1" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</p>
                                            <span className="d-flex align-items-center gap-1 text-success fw-bold" style={{ fontSize: "0.85rem" }}>
                                                <CheckCircle2 size={14} />
                                                {selectedHistoryItem.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-4 py-3 border-top border-app-subtle" style={{ background: "var(--bg-secondary)" }}>
                                <Button variant="secondary" className="w-100" onClick={() => setSelectedHistoryItem(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Broadcast;

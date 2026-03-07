import { useState, useEffect, useCallback } from "react";
import { Send, Megaphone, Mail, Smartphone, RadioTower, Eye, Users, Info, X, History, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import toast from "react-hot-toast";
import "../transactions/TransactionList.css";
import { apiRequest, ADMIN_BROADCAST_ENDPOINT, ADMIN_BROADCAST_HISTORY_ENDPOINT } from "../../services/api";

const Broadcast = () => {
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        sendEmail: false,
        sendPush: false,
        targetRole: "all",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            setIsLoadingHistory(true);
            const response = await apiRequest(ADMIN_BROADCAST_HISTORY_ENDPOINT);
            // Handle both direct array or paginated response
            const historyData = Array.isArray(response) ? response : (response?.data || []);
            setHistory(historyData);
        } catch (error) {
            console.error("Failed to fetch broadcast history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error("Title and Message are required.");
            return;
        }
        if (!formData.sendEmail && !formData.sendPush) {
            toast.error("Please select at least one delivery method (Email or Push).");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiRequest(ADMIN_BROADCAST_ENDPOINT, {
                method: "POST",
                body: JSON.stringify(formData)
            });

            toast.success(response.message || "Announcement broadcast initiated successfully!");

            if (response.stats) {
                console.log("Broadcast Stats:", response.stats);
            }

            setFormData({
                title: "",
                message: "",
                sendEmail: false,
                sendPush: false,
                targetRole: "all",
            });

            // Refresh history after successful send
            fetchHistory();
        } catch (error) {
            toast.error(error.message || "Failed to send broadcast");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mock history removed, now using history state

    return (
        <div className="container-fluid p-0 pb-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <RadioTower size={24} className="text-success" />
                        <h2 className="mb-0 fw-bold text-app-primary font-display">
                            Broadcaster
                        </h2>
                    </div>
                    <p className="text-app-secondary mb-0">
                        Publish real-time announcements via Email & Push Notifications.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm glass-card h-100">
                        <div className="card-header bg-transparent border-bottom border-app-subtle p-4 pb-3">
                            <div className="d-flex align-items-center gap-2">
                                <Megaphone size={18} className="text-app-primary" />
                                <h5 className="mb-0 fw-bold font-display">Compose Message</h5>
                            </div>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                <Input
                                    label="Announcement Heading"
                                    name="title"
                                    placeholder="e.g. Scheduled System Maintenance"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="form-control-lg fs-6"
                                />

                                <div className="d-flex flex-column gap-2 border-0">
                                    <label className="fw-semibold text-app-primary small mb-0">
                                        Message Details
                                    </label>
                                    <textarea
                                        className="input-field fs-6"
                                        name="message"
                                        rows="6"
                                        placeholder="Provide the complete details of the announcement here..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        style={{ resize: "vertical", minHeight: "120px" }}
                                    ></textarea>
                                </div>

                                <div className="row g-3 mt-1">
                                    <div className="col-12">
                                        <label className="fw-semibold text-app-primary small m-0 mb-2">
                                            Delivery Channels
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <label
                                            htmlFor="sendPush"
                                            className={`w-100 p-3 p-md-4 border rounded-4 transition-smooth bg-app-card d-flex align-items-start gap-3 h-100 cursor-pointer ${formData.sendPush ? 'border-success bg-success-subtle shadow-sm' : 'border-app-subtle hover-bg-secondary'}`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="form-check mt-1">
                                                <input
                                                    className="form-check-input mt-0"
                                                    type="checkbox"
                                                    id="sendPush"
                                                    name="sendPush"
                                                    checked={formData.sendPush}
                                                    onChange={handleChange}
                                                    style={{ cursor: "pointer", width: "1.25rem", height: "1.25rem" }}
                                                />
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <Smartphone size={18} className="text-primary" />
                                                    <span className="fw-semibold text-app-primary">Push Notification</span>
                                                </div>
                                                <p className="small text-app-secondary mb-0 mt-2 line-height-sm">
                                                    Send a system alert directly to the users' capable devices (FCM).
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <label
                                            htmlFor="sendEmail"
                                            className={`w-100 p-3 p-md-4 border rounded-4 transition-smooth bg-app-card d-flex align-items-start gap-3 h-100 cursor-pointer ${formData.sendEmail ? 'border-warning bg-warning-subtle shadow-sm' : 'border-app-subtle hover-bg-secondary'}`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="form-check mt-1">
                                                <input
                                                    className="form-check-input mt-0"
                                                    type="checkbox"
                                                    id="sendEmail"
                                                    name="sendEmail"
                                                    checked={formData.sendEmail}
                                                    onChange={handleChange}
                                                    style={{ cursor: "pointer", width: "1.25rem", height: "1.25rem" }}
                                                />
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <Mail size={18} className="text-danger" />
                                                    <span className="fw-semibold text-app-primary">Email Blast</span>
                                                </div>
                                                <p className="small text-app-secondary mb-0 mt-2 line-height-sm">
                                                    Deliver a formatted HTML email to the users' inboxes.
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <Select
                                    label={
                                        <span className="d-flex align-items-center gap-2">
                                            <Users size={14} className="text-app-primary" /> Target Audience
                                        </span>
                                    }
                                    name="targetRole"
                                    value={formData.targetRole}
                                    onChange={handleChange}
                                    wrapperClassName="mt-3"
                                    className="fs-6"
                                    isSearchable={false}
                                >
                                    <option value="all">All Registered Users</option>
                                    <option value="user">Standard Users Only</option>
                                    <option value="admin">Administrators Only</option>
                                </Select>

                                <div className="d-flex justify-content-end mt-4 pt-4 border-top border-app-subtle">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        className="d-flex align-items-center gap-2 px-4 shadow-sm"
                                    >
                                        <Send size={16} />
                                        {isSubmitting ? "Broadcasting..." : "Confirm & Broadcast"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4 d-none d-xl-flex flex-column">
                    <div className="card border-0 shadow-sm glass-card flex-grow-1 sticky-top" style={{ top: "6rem", zIndex: 1 }}>
                        <div className="card-header bg-transparent border-bottom border-app-subtle p-4 pb-3">
                            <h6 className="fw-bold mb-0 font-display d-flex align-items-center gap-2 text-app-primary">
                                <Eye size={18} className="text-success" />
                                Live Preview
                            </h6>
                        </div>

                        <div className="card-body p-4 d-flex flex-column align-items-center bg-app-secondary rounded-bottom-4 pt-5">
                            {/* Simulated iOS/Android Notification Card */}
                            <div className="bg-app-card border border-app-subtle shadow-sm rounded-4 w-100 overflow-hidden" style={{ maxWidth: "340px", transition: "all 0.3s ease" }}>
                                <div className="p-3 d-flex align-items-center gap-2 bg-light border-bottom border-app-subtle">
                                    <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: "24px", height: "24px" }}>
                                        <RadioTower size={12} />
                                    </div>
                                    <span className="small fw-semibold text-app-secondary">TrackFin</span>
                                    <span className="small text-muted ms-auto">now</span>
                                </div>

                                <div className="p-3">
                                    <h6 className="fw-bold text-app-primary text-start mb-1 text-truncate" style={{ fontSize: "0.95rem" }}>
                                        {formData.title || "Notification Title Here"}
                                    </h6>
                                    <p
                                        className="text-app-secondary text-start mb-0"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            fontSize: "0.85rem",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {formData.message || "Enter your message in the composer to see a live preview of how the notification will look on user devices."}
                                    </p>
                                </div>
                            </div>

                            <p className="small text-app-muted mt-4 text-center px-4">
                                Note: Actual appearance may vary by device operating system and email client.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Broadcast History Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm glass-card">
                        <div className="card-header bg-transparent border-bottom border-app-subtle p-4 pb-3">
                            <div className="d-flex align-items-center gap-2">
                                <History size={18} className="text-secondary" />
                                <h5 className="mb-0 fw-bold font-display">Broadcast History</h5>
                            </div>
                        </div>
                        <div className="card-body p-0 transaction-list-wrapper">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 transaction-table">
                                    <thead className="table-light d-none d-lg-table-header-group">
                                        <tr>
                                            <th className="font-display fw-semibold text-secondary py-3 px-4 rounded-start-3">Date</th>
                                            <th className="font-display fw-semibold text-secondary py-3 px-4">Subject</th>
                                            <th className="font-display fw-semibold text-secondary py-3 px-4">Audience</th>
                                            <th className="font-display fw-semibold text-secondary py-3 px-4">Channels</th>
                                            <th className="font-display fw-semibold text-secondary py-3 px-4 rounded-end-3 text-end">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingHistory ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5">
                                                    <div className="d-flex flex-column align-items-center gap-2">
                                                        <Loader2 className="text-app-primary animate-spin" size={24} />
                                                        <span className="text-app-secondary">Loading history...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : history.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5">
                                                    <div className="d-flex flex-column align-items-center gap-2">
                                                        <Info className="text-app-muted" size={24} />
                                                        <span className="text-app-secondary">No broadcast history found.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            history.map((item) => (
                                                <tr key={item.id} className="cursor-pointer hover-bg-light" onClick={() => setSelectedHistoryItem(item)}>
                                                    {/* Desktop View Elements */}
                                                    <td className="px-4 py-3 d-none d-lg-table-cell">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Calendar size={14} className="text-muted" />
                                                            <span className="text-dark fw-medium fs-7">
                                                                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 d-none d-lg-table-cell">
                                                        <span className="fw-semibold text-dark fs-7 d-block text-truncate" style={{ maxWidth: "250px" }}>{item.title}</span>
                                                    </td>
                                                    <td className="px-4 py-3 d-none d-lg-table-cell">
                                                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle fw-medium px-2 py-1 fs-8 text-capitalize">
                                                            {item.target_role || 'All'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 d-none d-lg-table-cell">
                                                        <div className="d-flex gap-1 flex-wrap">
                                                            {(item.channels || []).map((med, idx) => (
                                                                <span key={idx} className={`badge ${med === 'Push' ? 'bg-success' : 'bg-warning text-dark'} bg-opacity-10 text-app-primary border border-app-subtle fw-medium px-2 py-1 fs-8`}>
                                                                    {med === 'Push' ? <Smartphone size={10} className="me-1 d-inline" /> : <Mail size={10} className="me-1 d-inline" />}
                                                                    {med}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-end d-none d-lg-table-cell">
                                                        <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold fs-7 bg-success bg-opacity-10 px-2 py-1 rounded-pill">
                                                            <CheckCircle2 size={14} />
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    {/* Mobile View Elements */}
                                                    <td className="w-100 d-lg-none mobile-card-container">
                                                        <div className="mobile-card-grid">
                                                            <div className="mobile-card-left">
                                                                <span className="mobile-name text-truncate mb-1">{item.title}</span>
                                                                <div className="d-flex align-items-center gap-1 text-muted mb-2">
                                                                    <Calendar size={12} />
                                                                    <span className="mobile-date-text">
                                                                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle fw-medium px-2 py-1 fs-8 text-capitalize">
                                                                        {item.target_role || 'All'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="mobile-card-right pt-1 flex-column justify-content-between align-items-end">
                                                                <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold fs-8 bg-success bg-opacity-10 px-2 py-1 rounded-pill mb-2">
                                                                    <CheckCircle2 size={12} />
                                                                    {item.status}
                                                                </span>
                                                                <div className="d-flex gap-1 flex-wrap justify-content-end mt-2">
                                                                    {(item.channels || []).map((med, idx) => (
                                                                        <span key={idx} className={`badge ${med === 'Push' ? 'bg-success' : 'bg-warning text-dark'} bg-opacity-10 text-app-primary border border-app-subtle fw-medium px-1 py-1 fs-8 text-nowrap`} style={{ fontSize: "0.6rem" }}>
                                                                            {med === 'Push' ? <Smartphone size={10} className="me-1 d-none d-sm-inline" /> : <Mail size={10} className="me-1 d-none d-sm-inline" />}
                                                                            {med}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Broadcast Details Modal */}
            {selectedHistoryItem && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1040, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}></div>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }} onClick={() => setSelectedHistoryItem(null)}>
                        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="modal-header border-bottom border-app-subtle bg-light p-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <Info size={20} className="text-app-primary" />
                                        <h5 className="modal-title fw-bold font-display text-dark">Broadcast Details</h5>
                                    </div>
                                    <button type="button" className="btn-close shadow-none" onClick={() => setSelectedHistoryItem(null)}></button>
                                </div>
                                <div className="modal-body p-4 p-md-5">
                                    <div className="mb-4">
                                        <p className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">Subject</p>
                                        <h5 className="fw-bold text-dark">{selectedHistoryItem.title}</h5>
                                    </div>

                                    <div className="bg-app-card rounded-4 p-4 border border-app-subtle mb-4 shadow-sm">
                                        <p className="text-muted small fw-semibold text-uppercase tracking-wider mb-2">Message Content</p>
                                        <p className="text-dark mb-0 line-height-md" style={{ whiteSpace: 'pre-wrap' }}>
                                            {selectedHistoryItem.message}
                                        </p>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12 col-sm-6">
                                            <div className="p-3 bg-light rounded-3 border border-app-subtle h-100">
                                                <p className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">Target Audience</p>
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle fw-medium px-2 py-1 text-capitalize">
                                                    {selectedHistoryItem.target_role || 'All'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="p-3 bg-light rounded-3 border border-app-subtle h-100">
                                                <p className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">Channels</p>
                                                <div className="d-flex gap-1 flex-wrap">
                                                    {(selectedHistoryItem.channels || []).map((med, idx) => (
                                                        <span key={idx} className={`badge ${med === 'Push' ? 'bg-success' : 'bg-warning text-dark'} bg-opacity-10 text-app-primary border border-app-subtle fw-medium px-2 py-1`}>
                                                            {med === 'Push' ? <Smartphone size={10} className="me-1 d-inline" /> : <Mail size={10} className="me-1 d-inline" />}
                                                            {med}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="p-3 bg-light rounded-3 border border-app-subtle h-100">
                                                <p className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">Date Sent</p>
                                                <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                                                    <Calendar size={14} className="text-muted" />
                                                    {new Date(selectedHistoryItem.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success-subtle h-100">
                                                <p className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">Status</p>
                                                <span className="d-inline-flex align-items-center gap-1 text-success fw-bold fs-6">
                                                    <CheckCircle2 size={16} />
                                                    {selectedHistoryItem.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top border-app-subtle bg-light p-3">
                                    <Button variant="secondary" onClick={() => setSelectedHistoryItem(null)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Broadcast;

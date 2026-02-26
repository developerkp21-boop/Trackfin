import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  KeyRound,
  UserMinus,
  UserPlus,
  Trash2,
  X,
  ShieldCheck,
  Loader2,
  Search,
  Eye,
  ArrowDownUp,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Select from "../../components/Select";
import {
  getUserById,
  getUserTransactions,
  suspendUser,
  activateUser,
  deleteUser,
  resetUserPassword,
} from "../../services/adminApi";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";

const TABS = [
  { key: "summary", label: "Financial Summary" },
  { key: "transactions", label: "Transactions" },
];

const formatDate = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [loadingTxs, setLoadingTxs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTxs, setTotalTxs] = useState(0);
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [txSortBy, setTxSortBy] = useState("date_desc");

  // Modal states
  const [showResetPw, setShowResetPw] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserById(id);
      if (response) {
        setUser(response.data || response);
      }
    } catch (error) {
      toast.error("Failed to load user records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1) => {
    try {
      setLoadingTxs(true);
      setTransactions([]); // Reset data to avoid "mixing" with previous user during load
      const params = {
        page,
        perPage: 10,
        search: txSearch,
        type: txTypeFilter,
        sort: txSortBy,
      };
      const response = await getUserTransactions(id, params);
      if (response) {
        // apiRequest already returns payload.data, which is the pagination object
        setTransactions(response.data || []);
        setTotalPages(response.last_page || 1);
        setTotalTxs(response.total || 0);
        setCurrentPage(response.current_page || 1);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoadingTxs(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    if (activeTab === "transactions") {
      fetchTransactions(currentPage);
    }
  }, [id, activeTab, currentPage, txTypeFilter, txSortBy]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "transactions") {
        setCurrentPage(1);
        fetchTransactions(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [txSearch]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <Loader2 className="animate-spin text-app-muted mb-3" size={40} />
          <p className="text-app-secondary">Fetching secure records...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="User Not Found"
          subtitle="The requested user could not be located."
        />
        <Card>
          <p className="small text-app-secondary mb-3">
            No user found with ID: {id}
          </p>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft size={15} /> Back to Users
          </Button>
        </Card>
      </div>
    );
  }

  // Financial summary derived from user's real transactions
  const totalIncome = parseFloat(user.total_income || 0);
  const totalExpense = parseFloat(user.total_expense || 0);
  const balance = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : 0;

  const toggleStatus = async () => {
    try {
      const isSuspending = user.status === "active";
      const response = isSuspending
        ? await suspendUser(user.id)
        : await activateUser(user.id);
      if (response) {
        const newStatus = isSuspending ? "deactivated" : "active";
        setUser({ ...user, status: newStatus });
        toast.success(
          `User ${newStatus === "active" ? "activated" : "suspended"}.`,
        );
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetUserPassword(user.id);
      setShowResetPw(false);
      toast.success(`Password reset link sent to ${user.email}.`);
    } catch (error) {
      toast.error("Failed to send reset link");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      setShowDelete(false);
      toast.success("User deleted.");
      navigate("/admin/users");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <div className="d-flex flex-column gap-4">
        {/* ─── Header ─── */}
        <PageHeader
          title="User Profile"
          subtitle="Read-only financial profile and account lifecycle controls."
          actions={
            <Button
              variant="ghost"
              className="p-0 small"
              onClick={() => navigate("/admin/users")}
            >
              <ArrowLeft size={16} /> Back to Users
            </Button>
          }
        />

        {/* ─── Profile Card ─── */}
        <Card>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
            {/* Avatar + Name */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "var(--brand-primary)",
                  fontSize: "1.2rem",
                }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h5 className="mb-0 fw-bold text-app-primary">{user.name}</h5>
                  <Badge
                    variant={
                      (user.role?.name || user.role) === "admin"
                        ? "danger"
                        : "info"
                    }
                  >
                    {user.role?.name || user.role || "user"}
                  </Badge>
                  <Badge
                    variant={user.status === "active" ? "success" : "warning"}
                  >
                    {user.status}
                  </Badge>
                </div>
                <p className="small text-app-muted mb-0 d-flex align-items-center gap-1">
                  <Mail size={13} /> {user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm ${user.status === "active" ? "btn-outline-warning" : "btn-outline-success"} d-flex align-items-center gap-1`}
                onClick={toggleStatus}
              >
                {user.status === "active" ? (
                  <>
                    <UserMinus size={14} /> Suspend
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Activate
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={() => setShowResetPw(true)}
              >
                <KeyRound size={14} /> Reset Password
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 size={14} /> Delete User
              </button>
            </div>
          </div>

          {/* ─── User Metadata ─── */}
          <div className="row g-3 mt-3 pt-3 border-top border-app-subtle">
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Plan</p>
              <p className="mb-0 fw-semibold text-app-primary">
                {user.profile?.plan || "Free"}
              </p>
            </div>
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Joined Date</p>
              <p className="mb-0 fw-semibold text-app-primary">
                {formatDate(user.created_at)}
              </p>
            </div>
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Last Active</p>
              <p className="mb-0 fw-semibold text-app-primary">---</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Account ID</p>
              <p className="mb-0 fw-semibold text-app-primary font-monospace small">
                {user.id}
              </p>
            </div>
          </div>
        </Card>

        {/* ─── Tabs ─── */}
        <div className="d-flex gap-1 border-bottom border-app-subtle">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`btn btn-sm rounded-top-3 rounded-bottom-0 px-4 py-2 border-0 ${
                activeTab === key
                  ? "bg-body-secondary text-app-primary fw-semibold"
                  : "bg-transparent text-app-secondary"
              }`}
              style={{
                marginBottom: "-1px",
                borderBottom:
                  activeTab === key ? "2px solid var(--brand-primary)" : "none",
              }}
            >
              <span className="small">{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Financial Summary Tab ─── */}
        {activeTab === "summary" && (
          <div className="row g-3 g-lg-4">
            {[
              {
                label: "Total Income",
                value: `$${totalIncome.toLocaleString()}`,
                color: "#80c570",
              },
              {
                label: "Total Expenses",
                value: `$${totalExpense.toLocaleString()}`,
                color: "#e77a8c",
              },
              {
                label: "Net Balance",
                value: `$${balance.toLocaleString()}`,
                color: balance >= 0 ? "#80c570" : "#e77a8c",
              },
              {
                label: "Savings Rate",
                value: `${savingsRate}%`,
                color: "var(--brand-primary)",
              },
            ].map((item) => (
              <div key={item.label} className="col-sm-6 col-xl-3">
                <Card className="h-100">
                  <p className="small text-app-secondary mb-1">{item.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: item.color }}>
                    {item.value}
                  </h4>
                </Card>
              </div>
            ))}

            {user.transactions_count === 0 && (
              <div className="col-12">
                <Card>
                  <div className="text-center py-4">
                    <ShieldCheck size={32} className="text-app-muted mb-2" />
                    <p className="text-app-secondary small mb-0">
                      No transaction data available for this user.
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ─── Transactions Tab ─── */}
        {activeTab === "transactions" && (
          <div className="d-flex flex-column gap-3">
            {/* Filters Row */}
            <div className="row g-2 align-items-center">
              <div className="col-md-7 col-lg-8">
                <div className="position-relative">
                  <Search
                    className="position-absolute top-50 start-0 ms-3 text-app-muted"
                    size={16}
                    style={{ transform: "translateY(-50%)" }}
                  />
                  <input
                    type="text"
                    className="form-control ps-5 bg-white border-app-subtle"
                    placeholder="Search by description, ID, or category..."
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-5 col-lg-4">
                <Select
                  value={txTypeFilter}
                  onChange={(e) => {
                    setTxTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border-app-subtle"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expense Only</option>
                </Select>
              </div>
              <div className="col-md-5 col-lg-3">
                <Select
                  value={txSortBy}
                  onChange={(e) => {
                    setTxSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border-app-subtle"
                >
                  <option value="date_desc">Latest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="amount_desc">Highest Amount</option>
                  <option value="amount_asc">Lowest Amount</option>
                </Select>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <ArrowDownUp size={14} className="text-app-muted" />
              <p className="small text-app-secondary mb-0">
                {totalTxs} transactions found
              </p>
            </div>

            <Card className="p-0 overflow-hidden shadow-sm border-app-subtle">
              <div className="table-responsive" style={{ minHeight: "450px" }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light d-none d-md-table-header-group">
                    <tr>
                      <th className="small text-app-muted text-uppercase py-3 ps-4">
                        Date / Ref
                      </th>
                      <th className="small text-app-muted text-uppercase py-3">
                        Description
                      </th>
                      <th className="small text-app-muted text-uppercase py-3">
                        Category
                      </th>
                      <th className="small text-app-muted text-uppercase py-3">
                        Account
                      </th>
                      <th className="small text-app-muted text-uppercase py-3">
                        Amount
                      </th>
                      <th className="small text-app-muted text-uppercase py-3">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTxs ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <Loader2
                            className="animate-spin text-app-muted mx-auto"
                            size={24}
                          />
                        </td>
                      </tr>
                    ) : transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id}>
                          {/* Desktop Columns */}
                          <td className="small text-app-secondary py-3 ps-4 d-none d-md-table-cell">
                            <p className="mb-0">{formatDate(tx.date)}</p>
                            <p className="mb-0 x-small font-monospace opacity-50">
                              #{tx.id?.slice(0, 8)}
                            </p>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <span className="small text-app-primary">
                              {tx.description || "---"}
                            </span>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <span className="fw-medium text-app-primary">
                              {tx.category?.name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <span className="small text-app-secondary">
                              {tx.account?.name || "---"}
                            </span>
                          </td>
                          <td
                            className={`fw-bold d-none d-md-table-cell ${tx.type === "income" ? "text-success" : "text-danger"}`}
                          >
                            {tx.type === "income" ? "+" : "-"}$
                            {parseFloat(tx.amount).toLocaleString()}
                          </td>
                          <td className="d-none d-md-table-cell">
                            <Badge
                              variant={
                                tx.type === "income" ? "success" : "danger"
                              }
                            >
                              {tx.type}
                            </Badge>
                          </td>

                          {/* Mobile Card Layout */}
                          <td colSpan={6} className="d-md-none p-0 border-0">
                            <div className="p-3 border-bottom border-app-subtle">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <p className="small text-app-muted mb-0">
                                    {formatDate(tx.date)}
                                  </p>
                                  <h6 className="mb-0 fw-bold text-app-primary">
                                    {tx.description ||
                                      tx.category?.name ||
                                      "Uncategorized"}
                                  </h6>
                                  {tx.description && (
                                    <p className="small text-app-muted mb-0">
                                      {tx.category?.name || "Uncategorized"}
                                    </p>
                                  )}
                                </div>
                                <div className="text-end">
                                  <p
                                    className={`mb-1 fw-bold ${tx.type === "income" ? "text-success" : "text-danger"}`}
                                  >
                                    {tx.type === "income" ? "+" : "-"}$
                                    {parseFloat(tx.amount).toLocaleString()}
                                  </p>
                                  <Badge
                                    variant={
                                      tx.type === "income"
                                        ? "success"
                                        : "danger"
                                    }
                                    className="small"
                                  >
                                    {tx.type}
                                  </Badge>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="small text-app-muted">
                                    {tx.account?.name}
                                  </span>
                                </div>
                                <span className="small text-app-muted font-monospace">
                                  #{tx.id?.slice(0, 8)}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-5 text-app-secondary"
                        >
                          <div className="d-flex flex-column align-items-center gap-2">
                            <ShieldCheck size={32} className="opacity-25" />
                            <p className="mb-0 small">
                              No transactions found for this user.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {totalPages > 1 && (
              <div className="mt-2">
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Reset Password Modal ─── */}
      {showResetPw && (
        <div
          className="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: "rgba(15,23,42,0.45)", zIndex: 1050 }}
        >
          <Card
            className="w-100 modal-content-custom"
            style={{ maxWidth: "28rem" }}
          >
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <h5 className="mb-0 text-app-primary">Reset Password</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowResetPw(false)}
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-app-secondary mb-4">
              Send a password reset link to{" "}
              <strong className="text-app-primary">{user.email}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setShowResetPw(false)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword}>Send Reset Link</Button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Delete User Modal ─── */}
      {showDelete && (
        <div
          className="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: "rgba(15,23,42,0.45)", zIndex: 1050 }}
        >
          <Card
            className="w-100 modal-content-custom"
            style={{ maxWidth: "28rem" }}
          >
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <div>
                <h5 className="mb-1 text-app-primary">Delete User</h5>
                <p className="small text-app-secondary mb-0">
                  This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowDelete(false)}
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-app-secondary mb-4">
              Are you sure you want to delete{" "}
              <strong className="text-app-primary">{user.name}</strong>? All
              their data will be permanently removed.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Permanently
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserDetails;

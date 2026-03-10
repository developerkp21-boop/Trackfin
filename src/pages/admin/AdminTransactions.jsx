import { useMemo, useState } from "react";
import { ArrowDownUp, Search, SlidersHorizontal, X, TrendingUp, TrendingDown, Calendar, Hash } from "lucide-react";
import Select from "../../components/Select";
import { adminLedgerTransactions } from "../../data/mockData";

const statusStyle = {
  posted: { bg: "rgba(34,197,94,0.1)", color: "#16a34a", label: "Posted" },
  pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706", label: "Pending" },
  failed: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", label: "Failed" },
};

const AdminTransactions = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const searched = adminLedgerTransactions.filter((item) => {
      const query = search.toLowerCase();
      const byText =
        item.user.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      const byType = typeFilter === "all" ? true : item.type === typeFilter;
      const byStatus = statusFilter === "all" ? true : item.status === statusFilter;
      return byText && byType && byStatus;
    });

    return searched.sort((a, b) => {
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      if (sortBy === "date_asc") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [search, typeFilter, statusFilter, sortBy]);

  const activeFilterCount = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <div className="d-flex flex-column gap-3">
      {/* ── Page Header ── */}
      <div>
        <h2 className="fw-bold font-display fs-4 mb-1">Transactions</h2>
        <p className="text-app-secondary small mb-0">Track, review, and control all income and expense entries.</p>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="px-3 px-md-4 py-3 d-flex align-items-center gap-2">
          {/* Search */}
          <div className="position-relative flex-grow-1">
            <Search className="position-absolute top-50 start-0 ms-3 text-app-muted" size={15} style={{ transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              className="input-field ps-5 py-2"
              style={{ fontSize: "0.875rem" }}
              placeholder="Search by ID, user, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter toggle button (mobile) */}
          <button
            className="d-flex d-md-none align-items-center gap-1 px-3 py-2 rounded-3 border border-app-subtle flex-shrink-0 position-relative"
            style={{ background: showFilters ? "var(--brand-soft)" : "var(--bg-secondary)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="position-absolute top-0 end-0 translate-middle badge rounded-circle" style={{ width: 17, height: 17, fontSize: "0.6rem", background: "var(--brand-strong)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop filters inline */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <div style={{ minWidth: 130 }}>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} wrapperClassName="mb-0" isSearchable={false}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </div>
            <div style={{ minWidth: 130 }}>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="mb-0" isSearchable={false}>
                <option value="all">All Status</option>
                <option value="posted">Posted</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </Select>
            </div>
            <div style={{ minWidth: 155 }}>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} wrapperClassName="mb-0" isSearchable={false}>
                <option value="date_desc">Latest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile filter panel (collapsible) */}
        {showFilters && (
          <div className="d-md-none border-top border-app-subtle px-3 py-3 d-flex flex-column gap-3" style={{ background: "var(--bg-secondary)" }}>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold small text-app-primary">Filters & Sort</span>
              <button className="border-0 bg-transparent p-0 text-app-muted" onClick={() => setShowFilters(false)}>
                <X size={16} />
              </button>
            </div>
            <Select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} wrapperClassName="mb-0" isSearchable={false}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
            <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="mb-0" isSearchable={false}>
              <option value="all">All Status</option>
              <option value="posted">Posted</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Select>
            <Select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} wrapperClassName="mb-0" isSearchable={false}>
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </Select>
            {activeFilterCount > 0 && (
              <button
                className="border-0 rounded-3 py-2 fw-semibold small"
                style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}
                onClick={() => { setTypeFilter("all"); setStatusFilter("all"); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Result count ── */}
      <div className="d-flex align-items-center gap-2 px-1">
        <ArrowDownUp size={14} className="text-app-muted" />
        <span className="small text-app-secondary">{filtered.length} records found</span>
      </div>

      {/* ── List / Table ── */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

        {/* ── MOBILE: Card List ── */}
        <div className="d-md-none">
          {filtered.length === 0 ? (
            <div className="py-5 text-center text-app-muted small">No records found.</div>
          ) : (
            filtered.map((item, idx) => {
              const isIncome = item.type === "income";
              const st = statusStyle[item.status] || statusStyle.pending;
              const catName = typeof item.category === "object" ? item.category?.name : item.category || "N/A";
              return (
                <div
                  key={item.id}
                  className={`px-3 py-3 d-flex align-items-center gap-3 ${idx < filtered.length - 1 ? "border-bottom border-app-subtle" : ""}`}
                >
                  {/* Type Icon */}
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 40, height: 40,
                      background: isIncome ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"
                    }}
                  >
                    {isIncome
                      ? <TrendingUp size={18} style={{ color: "#16a34a" }} />
                      : <TrendingDown size={18} style={{ color: "#dc2626" }} />
                    }
                  </div>

                  {/* Main Info */}
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <span className="fw-semibold text-truncate" style={{ fontSize: "0.88rem" }}>{item.user}</span>
                      <span className={`fw-bold flex-shrink-0 ${isIncome ? "text-success" : "text-danger"}`} style={{ fontSize: "0.9rem" }}>
                        {isIncome ? "+" : "−"}₹{item.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="text-app-secondary text-truncate" style={{ fontSize: "0.75rem" }}>{catName}</span>
                      <span className="text-app-muted" style={{ fontSize: "0.7rem" }}>•</span>
                      <span className="d-flex align-items-center gap-1 text-app-muted" style={{ fontSize: "0.72rem" }}>
                        <Calendar size={10} />{item.date}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className="d-flex align-items-center gap-1 text-app-muted" style={{ fontSize: "0.68rem" }}>
                        <Hash size={9} />{item.id}
                      </span>
                      <span
                        className="px-2 py-0 rounded-pill fw-semibold"
                        style={{ fontSize: "0.68rem", background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── DESKTOP: Table ── */}
        <div className="d-none d-md-block table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: "var(--bg-secondary)" }}>
              <tr>
                <th className="px-4 py-3 small text-app-muted text-uppercase fw-semibold">Date</th>
                <th className="px-4 py-3 small text-app-muted text-uppercase fw-semibold">User</th>
                <th className="px-4 py-3 small text-app-muted text-uppercase fw-semibold">Category</th>
                <th className="px-4 py-3 small text-app-muted text-uppercase fw-semibold">Amount</th>
                <th className="px-4 py-3 small text-app-muted text-uppercase fw-semibold">Type</th>
                <th className="px-4 py-3 small text-app-muted text-uppercase fw-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-app-muted small">No records found.</td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isIncome = item.type === "income";
                  const st = statusStyle[item.status] || statusStyle.pending;
                  const catName = typeof item.category === "object" ? item.category?.name : item.category || "N/A";
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="mb-0 text-app-primary small fw-medium">{item.date}</p>
                        <p className="mb-0 text-app-muted" style={{ fontSize: "0.72rem" }}>{item.id}</p>
                      </td>
                      <td className="px-4 py-3 fw-semibold text-app-primary">{item.user}</td>
                      <td className="px-4 py-3 text-app-secondary small">{catName}</td>
                      <td className={`px-4 py-3 fw-bold ${isIncome ? "text-success" : "text-danger"}`}>
                        {isIncome ? "+" : "−"}₹{item.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded-pill fw-semibold d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "0.75rem", background: isIncome ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: isIncome ? "#16a34a" : "#dc2626" }}
                        >
                          {isIncome ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded-pill fw-semibold"
                          style={{ fontSize: "0.75rem", background: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;

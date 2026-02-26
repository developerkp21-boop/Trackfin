import { useMemo, useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Select from "../../components/Select";
import { adminLedgerTransactions } from "../../data/mockData";

const AdminTransactions = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const filtered = useMemo(() => {
    const searched = adminLedgerTransactions.filter((item) => {
      const query = search.toLowerCase();
      const byText =
        item.user.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      const byType = typeFilter === "all" ? true : item.type === typeFilter;
      const byStatus =
        statusFilter === "all" ? true : item.status === statusFilter;
      return byText && byType && byStatus;
    });

    return searched.sort((a, b) => {
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      if (sortBy === "date_asc") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [search, typeFilter, statusFilter, sortBy]);

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Ledger Transaction Management"
        subtitle="Track, review, and control all income and expense entries."
      />

      <Card>
        <div className="row g-3 align-items-end mb-3">
          <div className="col-12 col-md-6 col-xl-4">
            <label className="form-label small text-app-secondary mb-1">
              Search
            </label>
            <div className="position-relative">
              <Search
                className="position-absolute top-50 start-0 ms-3 text-app-muted"
                size={16}
                style={{ transform: "translateY(-50%)" }}
              />
              <input
                className="form-control rounded-3 ps-5"
                placeholder="Search by ID, user, or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3 col-xl-2">
            <Select
              label="Type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>

          <div className="col-6 col-md-3 col-xl-2">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="posted">Posted</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Select>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <Select
              label="Sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="date_desc">Latest Date</option>
              <option value="date_asc">Oldest Date</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </Select>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <ArrowDownUp size={16} className="text-app-muted" />
          <p className="small text-app-secondary mb-0">
            {filtered.length} ledger records
          </p>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="small text-app-muted text-uppercase">Date</th>
                <th className="small text-app-muted text-uppercase">User</th>
                <th className="small text-app-muted text-uppercase">
                  Category
                </th>
                <th className="small text-app-muted text-uppercase">Amount</th>
                <th className="small text-app-muted text-uppercase">Type</th>
                <th className="small text-app-muted text-uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="mb-0 text-app-primary small">{item.date}</p>
                    <p className="mb-0 text-app-muted small">{item.id}</p>
                  </td>
                  <td className="fw-medium text-app-primary">{item.user}</td>
                  <td>
                    {typeof item.category === "object"
                      ? item.category?.name
                      : item.category || "N/A"}
                  </td>
                  <td
                    className={
                      item.type === "income"
                        ? "text-success fw-semibold"
                        : "text-danger fw-semibold"
                    }
                  >
                    {item.type === "income" ? "+" : "-"}$
                    {item.amount.toLocaleString()}
                  </td>
                  <td>
                    <Badge
                      variant={item.type === "income" ? "success" : "danger"}
                    >
                      {item.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      variant={
                        item.status === "posted"
                          ? "success"
                          : item.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminTransactions;

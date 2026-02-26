import { useMemo, useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { transactionsData } from "../../data/mockData";
import {
  apiRequest,
  TRANSACTIONS_ENDPOINT,
  CATEGORIES_ENDPOINT,
  PAYMENT_METHODS_ENDPOINT,
} from "../../services/api";
import { toast } from "react-hot-toast";
import "./TransactionList.css";

const initialForm = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
  category_id: "",
  account_id: "",
  account: "",
  description: "",
};

const TransactionList = () => {
  const [type, setType] = useState("income");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txns, cats, pms] = await Promise.all([
        apiRequest(TRANSACTIONS_ENDPOINT),
        apiRequest(CATEGORIES_ENDPOINT),
        apiRequest(PAYMENT_METHODS_ENDPOINT),
      ]);
      setTransactions(txns || []);
      setCategories(cats || []);
      setPaymentMethods(pms || []);

      // Select first options by default if form is empty
      if (
        !editingId &&
        Array.isArray(cats) &&
        cats.length > 0 &&
        Array.isArray(pms) &&
        pms.length > 0
      ) {
        setFormValues((prev) => ({
          ...prev,
          category_id: cats[0].id,
          account_id: pms[0].id,
        }));
      }
    } catch (error) {
      toast.error("Failed to load transaction data");
      console.error(error);
      setTransactions([]);
      setCategories([]);
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const safeTx = Array.isArray(transactions) ? transactions : [];
    const list = safeTx.filter((item) => {
      const query = search.toLowerCase();
      const bySearch =
        (item.description || "").toLowerCase().includes(query) ||
        (item.category?.name || "").toLowerCase().includes(query);
      const byType = typeFilter === "all" ? true : item.type === typeFilter;
      const byAccount =
        accountFilter === "all"
          ? true
          : String(item.account_id) === String(accountFilter);
      return bySearch && byType && byAccount;
    });

    return list.sort((a, b) => {
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      if (sortBy === "date_asc") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [transactions, search, typeFilter, accountFilter, sortBy]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues(initialForm);
    setEditingId(null);
    setType("expense");
    setShowModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formValues.date ||
      !formValues.amount ||
      !formValues.category_id ||
      !formValues.account_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formValues,
        amount: Number(formValues.amount),
        type: type,
      };

      if (editingId) {
        await apiRequest(`${TRANSACTIONS_ENDPOINT}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Transaction updated");
      } else {
        await apiRequest(TRANSACTIONS_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Transaction added");
      }

      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setType(item.type);
    setFormValues({
      date: item.date ? item.date.split("T")[0] : "",
      amount: item.amount,
      category_id: item.category_id,
      account_id: item.account_id,
      account: item.account || "",
      description: item.description || "",
    });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiRequest(`${TRANSACTIONS_ENDPOINT}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Transaction deleted successfully");
      setTransactions((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id),
      );
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="d-flex flex-column gap-4 transaction-list-wrapper">
        <div className="d-flex justify-content-between align-items-center">
          <PageHeader
            title="Transaction Management"
            subtitle="Ledger-style transaction capture, filtering, sorting, and controls."
          />
        </div>
        <div className="row px-5">
          {" "}
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="d-flex align-items-center gap-2"
            style={{
              backgroundColor: "#a8df8e",
              border: "none",
              color: "#1a1a1a",
            }}
          >
            <Plus size={16} /> Add Transaction
          </Button>
        </div>
        {/* Transaction Form Modal */}
        {showModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div
              className="modal-content-wrapper"
              style={{ maxWidth: "800px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-lg p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="h5 fw-bold mb-0">
                    {editingId ? "Edit Transaction" : "Add Transaction"}
                  </h3>
                  <button
                    className="btn btn-light rounded-circle p-1"
                    onClick={() => setShowModal(false)}
                  >
                    <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                  </button>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`btn w-100 ${type === "income" ? "btn-success text-white" : "btn-outline-secondary"}`}
                    style={{
                      borderRadius: "12px",
                      padding: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`btn w-100 ${type === "expense" ? "btn-danger text-white" : "btn-outline-secondary"}`}
                    style={{
                      borderRadius: "12px",
                      padding: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Expense
                  </button>
                </div>

                <form className="row g-2 g-sm-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <Input
                      label="Date"
                      name="date"
                      type="date"
                      value={formValues.date}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Amount ($)"
                      name="amount"
                      type="number"
                      placeholder="0.00"
                      value={formValues.amount}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      label="Category"
                      name="category_id"
                      value={formValues.category_id}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select category</option>
                      {(Array.isArray(categories) ? categories : []).map(
                        (item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ),
                      )}
                    </Select>
                  </div>
                  <div className="col-md-6">
                    <Select
                      label="Account (Payment Method)"
                      name="account_id"
                      value={formValues.account_id}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select account</option>
                      {(Array.isArray(paymentMethods)
                        ? paymentMethods
                        : []
                      ).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ($
                          {Number(item.balance || 0).toLocaleString()})
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-12">
                    <Input
                      label="Description"
                      name="description"
                      placeholder="What was this for?"
                      value={formValues.description}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-12 mt-3 mt-sm-4">
                    <Button
                      type="submit"
                      className="w-100"
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: "#a8df8e",
                        border: "none",
                        color: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : editingId
                          ? "Update Transaction"
                          : "Save Transaction"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}

        <Card>
          <div className="row g-2 g-md-3 align-items-end mb-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-medium text-secondary small d-none d-md-block">
                Search
              </label>
              <div className="position-relative">
                <Search
                  className="position-absolute top-50 start-0 ms-3 text-muted"
                  size={16}
                  style={{ transform: "translateY(-50%)" }}
                />
                <input
                  className="form-control rounded-pill border-0 bg-light shadow-sm search-tx-input"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={{ height: "45px" }}
                />
              </div>
            </div>

            <div className="col-12 d-md-none">
              <Button
                variant="outline"
                className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill border-1"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  height: "45px",
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                }}
              >
                {showFilters ? "Hide Filters" : "Adjust Filters"}
                <div
                  className={`filter-badge ${typeFilter !== "all" || accountFilter !== "all" ? "active" : ""}`}
                ></div>
              </Button>
            </div>

            <div
              className={`col-6 col-md-2 ${showFilters ? "d-block" : "d-none d-md-block"}`}
            >
              <Select
                label="Type"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                wrapperClassName="mb-0"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </div>
            <div
              className={`col-6 col-md-3 ${showFilters ? "d-block" : "d-none d-md-block"}`}
            >
              <Select
                label="Account"
                value={accountFilter}
                onChange={(event) => setAccountFilter(event.target.value)}
                wrapperClassName="mb-0"
              >
                <option value="all">All Accounts</option>
                {(Array.isArray(paymentMethods) ? paymentMethods : []).map(
                  (pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ),
                )}
              </Select>
            </div>
            <div
              className={`col-12 col-md-3 ${showFilters ? "d-block" : "d-none d-md-block"}`}
            >
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                wrapperClassName="mb-0"
              >
                <option value="date_desc">Latest Date</option>
                <option value="date_asc">Oldest Date</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </Select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 transaction-table">
              <thead className="bg-light d-none d-lg-table-header-group">
                <tr>
                  <th className="small text-app-muted text-uppercase">Date</th>
                  <th className="small text-app-muted text-uppercase">
                    Category
                  </th>
                  <th className="small text-app-muted text-uppercase">
                    Amount
                  </th>
                  <th className="small text-app-muted text-uppercase">Type</th>
                  <th className="small text-app-muted text-uppercase">
                    Account
                  </th>
                  <th className="small text-app-muted text-uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-5 text-app-secondary small"
                    >
                      No transactions match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td className="d-none d-lg-table-cell">
                        <p className="mb-0">
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="small text-app-muted mb-0">
                          TXN-{item.id}
                        </p>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        {item.category?.name || "N/A"}
                      </td>
                      <td
                        className={`d-none d-lg-table-cell ${item.type === "income" ? "text-success fw-semibold" : "text-danger fw-semibold"}`}
                      >
                        {item.type === "income" ? "+" : "-"}$
                        {Number(item.amount).toLocaleString()}
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <Badge
                          variant={
                            item.type === "income" ? "success" : "danger"
                          }
                        >
                          {item.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        {item.account?.name || "N/A"}
                      </td>

                      <td className="text-end d-none d-lg-table-cell">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            type="button"
                            className="btn btn-light btn-sm rounded-2 text-app-secondary"
                            onClick={() => handleEdit(item)}
                            title="Edit Transaction"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-light-danger btn-sm rounded-2 text-danger"
                            onClick={() => setDeleteTarget(item)}
                            title="Delete Transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>

                      <td className="w-100 d-lg-none p-0 border-0 mobile-card-container">
                        <div className="mobile-card-grid">
                          <div className="mobile-card-left">
                            <h6 className="mobile-name mb-1">
                              {item.category?.name || "N/A"}
                            </h6>
                            <div className="mobile-date-text">
                              {item.date
                                ? new Date(item.date).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="mobile-id-text">TXN-{item.id}</div>
                            <div className="mobile-account-text mt-2">
                              <b>Account:</b> {item.account?.name || "N/A"}
                            </div>
                          </div>

                          <div className="mobile-card-right">
                            <div
                              className={`mobile-amount ${item.type === "income" ? "text-success" : "text-danger"}`}
                            >
                              {item.type === "income" ? "+" : "-"}$
                              {Number(item.amount).toLocaleString()}
                            </div>
                            <div className="mb-2 text-end w-100">
                              <Badge
                                variant={
                                  item.type === "income" ? "success" : "danger"
                                }
                              >
                                {item.type === "income" ? "Income" : "Expense"}
                              </Badge>
                            </div>

                            <div className="transaction-actions-mobile justify-content-end">
                              <button
                                type="button"
                                className="btn-icon-outline"
                                onClick={() => handleEdit(item)}
                                title="Edit Transaction"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button"
                                className="btn-icon-outline btn-delete"
                                onClick={() => setDeleteTarget(item)}
                                title="Delete Transaction"
                              >
                                <Trash2 size={12} />
                              </button>
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
        </Card>
      </div>

      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: "rgba(15, 23, 42, 0.45)", zIndex: 1050 }}
        >
          <Card className="w-100" style={{ maxWidth: "26rem" }}>
            <h5 className="mb-2 text-app-primary">Delete Transaction</h5>
            <p className="text-app-secondary mb-4 small">
              Are you sure you want to delete transaction{" "}
              <strong>{deleteTarget.id}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default TransactionList;

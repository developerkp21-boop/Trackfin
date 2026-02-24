import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  List as ListIcon,
  Search,
  Filter as FilterIcon,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { apiRequest, CATEGORIES_ENDPOINT } from "../../services/api";
import { toast } from "react-hot-toast";
import "./Categories.css";

const initialForm = { name: "", type: "expense", color: "#e77a8c", budget: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(CATEGORIES_ENDPOINT);
      setCategories(data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const matchesFilter = filter === "all" || c.type === filter;
      const matchesSearch = c.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [categories, filter, searchQuery]);

  const incomeCount = categories.filter((c) => c.type === "income").length;
  const expenseCount = categories.filter((c) => c.type === "expense").length;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        budget: form.budget === "" ? null : Number(form.budget),
      };

      if (editingId) {
        await apiRequest(`${CATEGORIES_ENDPOINT}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Category updated");
      } else {
        await apiRequest(CATEGORIES_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Category added");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      type: cat.type,
      color: cat.color,
      budget: cat.budget || "",
    });
    setEditingId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiRequest(`${CATEGORIES_ENDPOINT}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="categories-container pb-5">
      <PageHeader
        title="Categories"
        subtitle="Manage income and expense categories for your transactions."
        actions={
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm(initialForm);
            }}
            variant={showForm ? "outline" : "primary"}
          >
            {showForm ? (
              "Hide Form"
            ) : (
              <>
                <Plus size={16} className="me-2" /> Add Category
              </>
            )}
          </Button>
        }
      />

      {/* Stats */}
      <div className="row g-3">
        {[
          {
            label: "Total",
            value: categories.length,
            color: "text-app-primary",
          },
          { label: "Income", value: incomeCount, color: "text-success" },
          { label: "Expense", value: expenseCount, color: "text-danger" },
          {
            label: "Budgeted",
            value: categories.filter((c) => c.budget).length,
            color: "text-app-primary",
          },
        ].map((stat, i) => (
          <div key={i} className="col-6 col-md-3">
            <Card className="h-100 text-center py-3 border-0 shadow-sm transition-smooth hover-lift">
              <p className="x-small text-app-muted text-uppercase fw-bold letter-space-wide mb-1">
                {stat.label}
              </p>
              <h3 className={`h2 fw-bold mb-0 ${stat.color}`}>{stat.value}</h3>
            </Card>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <Card className="border-0 shadow-sm overflow-hidden animate-fade-in">
          <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
            <h3 className="h5 fw-bold text-app-primary mb-0">
              {editingId ? "Edit Category" : "Create New Category"}
            </h3>
          </div>
          <div className="card-body p-4">
            <form className="row g-4" onSubmit={handleSubmit}>
              <div className="col-md-4">
                <Input
                  label="Category Name"
                  name="name"
                  placeholder="e.g. Marketing"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <Select
                  label="Transaction Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold text-app-secondary mb-2">
                  Color Tag
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color border-0 p-0"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "8px",
                    }}
                  />
                  <span className="small font-mono text-uppercase text-app-muted">
                    {form.color}
                  </span>
                </div>
              </div>
              <div className="col-md-3">
                <Input
                  label="Monthly Budget ($)"
                  name="budget"
                  type="number"
                  placeholder="0.00"
                  value={form.budget}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 d-flex gap-2 justify-content-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="px-4">
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                      ? "Update Category"
                      : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between">
        <div className="d-flex gap-2">
          {["all", "income", "expense"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`btn btn-sm rounded-pill px-3 transition-smooth ${filter === f ? "btn-primary shadow-sm" : "btn-light text-app-secondary border"}`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="position-relative" style={{ minWidth: "260px" }}>
          <Search
            className="position-absolute top-50 translate-middle-y ms-3 text-app-muted"
            size={16}
          />
          <input
            type="text"
            className="form-control form-control-sm ps-5 rounded-pill border-app-subtle bg-white shadow-sm"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-app-muted">Fetching categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-5 border-dashed bg-transparent">
          <div className="mb-3 text-app-muted">
            <Tag size={48} strokeWidth={1} />
          </div>
          <h4 className="h5 text-app-primary">No categories found</h4>
          <p className="text-app-secondary mb-0">
            Try adjusting your filters or search query.
          </p>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view categories-table-wrapper border-0 shadow-sm">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Budget</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="category-info">
                        <div
                          className="category-icon-box"
                          style={{ background: cat.color + "22" }}
                        >
                          <Tag size={16} style={{ color: cat.color }} />
                        </div>
                        <span className="fw-semibold text-app-primary">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge
                        variant={cat.type === "income" ? "success" : "danger"}
                        className="rounded-pill"
                      >
                        {cat.type === "income" ? (
                          <TrendingUp size={10} className="me-1" />
                        ) : (
                          <TrendingDown size={10} className="me-1" />
                        )}
                        {cat.type}
                      </Badge>
                    </td>
                    <td>
                      {cat.budget ? (
                        <div className="budget-badge">
                          <span className="text-app-primary fw-bold">
                            ${Number(cat.budget).toLocaleString()}
                          </span>
                          <span className="ms-1 text-app-muted small">/mo</span>
                        </div>
                      ) : (
                        <span className="text-app-muted small italic">
                          Not set
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons justify-content-end">
                        <button
                          className="btn-action"
                          onClick={() => handleEdit(cat)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn-action btn-action-delete"
                          onClick={() => setDeleteTarget(cat)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-view categories-mobile-grid">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="category-mobile-card shadow-sm border-0"
              >
                <div className="category-card-header">
                  <div className="category-info">
                    <div
                      className="category-icon-box"
                      style={{
                        background: cat.color + "15",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Tag size={18} style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h4 className="h6 fw-bold text-app-primary mb-0">
                        {cat.name}
                      </h4>
                      <Badge
                        variant={cat.type === "income" ? "success" : "danger"}
                        className="mt-1 x-small py-0 px-2 rounded-pill"
                      >
                        {cat.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="btn-action shadow-sm"
                      onClick={() => handleEdit(cat)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn-action btn-action-delete shadow-sm"
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="category-card-body border-0">
                  <span className="text-app-muted small">Target Budget</span>
                  <div className="text-end">
                    {cat.budget ? (
                      <span className="fw-bold text-app-primary">
                        ${Number(cat.budget).toLocaleString()}
                        <small className="text-app-muted fw-normal ms-1">
                          /mo
                        </small>
                      </span>
                    ) : (
                      <span className="text-app-muted italic small">
                        No budget
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
          style={{
            background: "rgba(15, 23, 42, 0.45)",
            zIndex: 1050,
            backdropFilter: "blur(4px)",
          }}
        >
          <Card
            className="w-100 border-0 shadow-lg"
            style={{ maxWidth: "24rem" }}
          >
            <div className="p-4">
              <div className="d-flex align-items-center gap-3 text-danger mb-3">
                <div className="bg-danger bg-opacity-10 p-2 rounded-circle">
                  <Trash2 size={24} />
                </div>
                <h5 className="fw-bold mb-0">Confirm Delete</h5>
              </div>
              <p className="text-app-secondary mb-4">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.name}</strong>? This action cannot be
                undone, though existing transactions will remain.
              </p>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="px-4"
                >
                  Delete Category
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Categories;

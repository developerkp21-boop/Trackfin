import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trophy,
  Target,
  Plus as PlusIcon,
  Pencil,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import { apiRequest, GOALS_ENDPOINT } from "../../services/api";
import { toast } from "react-hot-toast";

const initialForm = {
  name: "",
  targetAmount: "",
  savedAmount: "",
  deadline: "",
  description: "",
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addSavings, setAddSavings] = useState({});

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(GOALS_ENDPOINT);
      setGoals(data || []);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalSaved = useMemo(
    () => goals.reduce((s, g) => s + Number(g.saved_amount || 0), 0),
    [goals],
  );
  const totalTarget = useMemo(
    () => goals.reduce((s, g) => s + Number(g.target_amount || 0), 0),
    [goals],
  );

  const getDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const due = new Date(deadline);
    return Math.max(0, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
  };

  const getStatus = (goal) => {
    const pct = goal.target_amount
      ? Math.round((goal.saved_amount / goal.target_amount) * 100)
      : 0;
    const days = getDaysLeft(goal.deadline);
    if (pct >= 100) return { label: "Completed", variant: "success" };
    if (days > 0 && days <= 30 && pct < 80)
      return { label: "At Risk", variant: "danger" };
    if (days > 0 && days <= 60) return { label: "Urgent", variant: "warning" };
    return { label: "On Track", variant: "info" };
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        target_amount: Number(form.targetAmount),
        saved_amount: Number(form.savedAmount || 0),
        deadline: form.deadline || null,
        description: form.description || null,
      };

      const endpoint = editingId
        ? `${GOALS_ENDPOINT}/${editingId}`
        : GOALS_ENDPOINT;
      const method = editingId ? "PUT" : "POST";

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      toast.success(`Goal ${editingId ? "updated" : "created"} successfully`);
      fetchGoals();
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save goal:", error);
      toast.error(error.message || "Failed to save goal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSavings = async (goalId) => {
    const amount = Number(addSavings[goalId] || 0);
    if (!amount) return;

    try {
      await apiRequest(`${GOALS_ENDPOINT}/${goalId}/add-savings`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      toast.success("Savings added successfully");
      fetchGoals();
      setAddSavings((prev) => ({ ...prev, [goalId]: "" }));
    } catch (error) {
      console.error("Failed to add savings:", error);
      toast.error("Failed to add savings");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Financial Goals"
        subtitle="Set savings goals, track progress, and stay on schedule."
        actions={
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm(initialForm);
            }}
          >
            <Plus size={16} /> New Goal
          </Button>
        }
      />

      {/* Summary */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Goals
            </p>
            <h3 className="h4 fw-bold text-app-primary mb-0">
              {loading ? "..." : goals.length}
            </h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Completed
            </p>
            <h3 className="h4 fw-bold text-success mb-0">
              {loading
                ? "..."
                : goals.filter(
                    (g) => Number(g.saved_amount) >= Number(g.target_amount),
                  ).length}
            </h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Total Saved
            </p>
            <h3 className="h5 fw-bold text-app-primary mb-0">
              ${loading ? "..." : totalSaved.toLocaleString()}
            </h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Target
            </p>
            <h3 className="h5 fw-bold text-app-primary mb-0">
              ${loading ? "..." : totalTarget.toLocaleString()}
            </h3>
          </Card>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary">
          <h3 className="h5 text-app-primary mb-3">
            {editingId ? "Edit Goal" : "Create New Goal"}
          </h3>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <Input
                label="Goal Name"
                name="name"
                placeholder="e.g. Emergency Fund"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <Input
                label="Target Amount ($)"
                name="targetAmount"
                type="number"
                placeholder="50000"
                value={form.targetAmount}
                onChange={handleChange}
                required
              />
            </div>
            {!editingId && (
              <div className="col-md-3">
                <Input
                  label="Already Saved ($)"
                  name="savedAmount"
                  type="number"
                  placeholder="0"
                  value={form.savedAmount}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="col-md-4">
              <Input
                label="Deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-8">
              <Input
                label="Description"
                name="description"
                placeholder="Brief goal description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                  setEditingId(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 size={16} className="animate-spin me-2" />
                ) : null}
                {editingId ? "Update Goal" : "Create Goal"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading && goals.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Loader2 size={48} className="text-primary animate-spin mb-3" />
          <p className="text-muted">Loading your goals...</p>
        </div>
      ) : (
        <>
          {/* Goals Grid */}
          <div className="row g-3 g-lg-4">
            {goals.length === 0 ? (
              <div className="col-12 text-center py-5">
                <Target size={48} className="text-muted mb-3 opacity-25" />
                <p className="text-muted">
                  No goals set yet. Start by creating one!
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} className="me-1" /> Create Your First Goal
                </Button>
              </div>
            ) : (
              goals.map((goal) => {
                const pct = goal.target_amount
                  ? Math.min(
                      100,
                      Math.round(
                        (goal.saved_amount / goal.target_amount) * 100,
                      ),
                    )
                  : 0;
                const days = getDaysLeft(goal.deadline);
                const status = getStatus(goal);
                const remaining = goal.target_amount - goal.saved_amount;

                return (
                  <div key={goal.id} className="col-md-6 col-xl-6">
                    <Card className="h-100 hover-shadow transition-all">
                      <div className="d-flex align-items-start justify-content-between mb-3 gap-2">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: 44,
                              height: 44,
                              background: (goal.color || "#60a5fa") + "22",
                            }}
                          >
                            <Trophy
                              size={20}
                              style={{ color: goal.color || "#60a5fa" }}
                            />
                          </div>
                          <div>
                            <p className="fw-semibold text-app-primary mb-0">
                              {goal.name}
                            </p>
                            {goal.description && (
                              <p className="x-small text-app-muted mb-0">
                                {goal.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <Button
                            variant="ghost"
                            className="p-1 text-muted"
                            onClick={() => {
                              setEditingId(goal.id);
                              setForm({
                                name: goal.name,
                                targetAmount: goal.target_amount,
                                savedAmount: goal.saved_amount,
                                deadline: goal.deadline || "",
                                description: goal.description || "",
                              });
                              setShowForm(true);
                            }}
                          >
                            <Pencil size={14} />
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-app-secondary">
                            ${Number(goal.saved_amount).toLocaleString()} saved
                          </span>
                          <span className="fw-semibold text-app-primary">
                            {pct}%
                          </span>
                        </div>
                        <div className="progress" style={{ height: 10 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${pct}%`,
                              background:
                                pct >= 100
                                  ? "#80c570"
                                  : goal.color || "#60a5fa",
                              borderRadius: 6,
                            }}
                          />
                        </div>
                        <div className="d-flex justify-content-between small mt-1">
                          <span className="text-app-muted">
                            Remaining: $
                            {remaining > 0 ? remaining.toLocaleString() : 0}
                          </span>
                          <span className="text-app-muted">
                            Target: $
                            {Number(goal.target_amount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Deadline Countdown */}
                      {goal.deadline && (
                        <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3 bg-body-tertiary">
                          <Target size={14} className="text-app-muted" />
                          <p className="small text-app-secondary mb-0">
                            Deadline:{" "}
                            <span className="fw-medium text-app-primary">
                              {goal.deadline}
                            </span>
                            <span
                              className={`ms-2 fw-semibold ${days <= 30 ? "text-danger" : days <= 60 ? "text-warning" : "text-success"}`}
                            >
                              ({days} days left)
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Add Savings */}
                      {pct < 100 && (
                        <div className="d-flex gap-2">
                          <input
                            type="number"
                            className="form-control form-control-sm rounded-3"
                            placeholder="Add savings..."
                            value={addSavings[goal.id] || ""}
                            onChange={(e) =>
                              setAddSavings((prev) => ({
                                ...prev,
                                [goal.id]: e.target.value,
                              }))
                            }
                          />
                          <Button
                            variant="success"
                            className="btn-sm flex-shrink-0 d-flex align-items-center gap-1"
                            onClick={() => handleAddSavings(goal.id)}
                          >
                            <PlusIcon size={14} /> Add
                          </Button>
                        </div>
                      )}

                      {pct >= 100 && (
                        <div className="text-center rounded-3 p-2 bg-success-subtle">
                          <p className="small fw-semibold text-success mb-0">
                            🎉 Goal Achieved!
                          </p>
                        </div>
                      )}
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Goals;

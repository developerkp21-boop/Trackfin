import { useMemo, useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { apiRequest, BUDGETS_ENDPOINT } from "../../services/api";
import toast from "react-hot-toast";

const BudgetGoals = () => {
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [catBudgets, setCatBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(BUDGETS_ENDPOINT);
      if (response && response.success) {
        const { summary, budgets } = response.data;
        setBudget(summary.monthlyBudget || 0);
        setSpent(summary.spent || 0);
        setAlerts(summary.alerts || []);
        setCatBudgets(budgets || []);
      }
    } catch (error) {
      toast.error("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const usage = useMemo(
    () => ({
      percentage: budget
        ? Math.min(100, Math.round((spent / budget) * 100))
        : 0,
      remaining: budget - spent,
    }),
    [budget, spent],
  );

  const chartData = catBudgets.map((c) => ({
    name: c.category_name,
    Budget: c.amount,
    Spent: c.spent,
    pct: c.amount ? Math.round((c.spent / c.amount) * 100) : 0,
  }));

  const handleCatBudgetChange = async (id, val) => {
    try {
      const response = await apiRequest(`${BUDGETS_ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ amount: Number(val) }),
      });
      if (response && response.success) {
        toast.success("Budget updated");
        fetchBudgetData();
      }
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Budget & Goals"
        subtitle="Set monthly budgets, track limits, and monitor spending alerts."
      />

      {/* Summary Cards */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Monthly Budget
            </p>
            <h3 className="h5 fw-bold text-app-primary mb-0">
              ${budget.toLocaleString()}
            </h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Spent
            </p>
            <h3 className="h5 fw-bold text-danger mb-0">
              ${spent.toLocaleString()}
            </h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Remaining
            </p>
            <h3
              className={`h5 fw-bold mb-0 ${usage.remaining >= 0 ? "text-success" : "text-danger"}`}
            >
              ${usage.remaining.toLocaleString()}
            </h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">
              Usage
            </p>
            <h3
              className={`h5 fw-bold mb-0 ${usage.percentage > 85 ? "text-danger" : "text-success"}`}
            >
              {usage.percentage}%
            </h3>
          </Card>
        </div>
      </div>

      <div className="row g-3 g-lg-4">
        {/* Set Budget */}
        <div className="col-lg-4">
          <Card className="h-100">
            <h3 className="h5 text-app-primary mb-3">Monthly Budget Setting</h3>
            <form
              className="d-flex flex-column gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                label="Budget Amount ($)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <Button type="submit" className="w-100 mt-1">
                Save Budget
              </Button>
            </form>

            <div className="mt-4">
              <p className="fw-semibold text-app-primary small mb-2">
                Overall Progress
              </p>
              <div className="d-flex justify-content-between small text-app-secondary mb-1">
                <span>${spent.toLocaleString()} used</span>
                <span>
                  {usage.percentage}% of ${budget.toLocaleString()}
                </span>
              </div>
              <div className="progress" style={{ height: 12 }}>
                <div
                  className={`progress-bar ${usage.percentage > 85 ? "bg-danger" : usage.percentage > 70 ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${usage.percentage}%` }}
                />
              </div>
              {usage.percentage > 85 && (
                <div className="d-flex align-items-center gap-2 mt-2 p-2 rounded-3 bg-danger-subtle">
                  <AlertTriangle size={14} className="text-danger" />
                  <p className="x-small text-danger mb-0 fw-medium">
                    Over 85% budget used!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="fw-semibold text-app-primary small mb-2">Alerts</p>
              <div className="d-flex flex-column gap-2">
                {alerts.length === 0 ? (
                  <p className="small text-app-muted">No active alerts.</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-3 p-2 small d-flex align-items-center gap-2 ${alert.level === "warning" ? "bg-warning-subtle text-warning-emphasis" : "bg-danger-subtle text-danger-emphasis"}`}
                    >
                      <AlertTriangle size={13} />
                      {alert.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Budget vs Actual Chart */}
        <div className="col-lg-8">
          <Card className="h-100">
            <p className="fw-semibold text-app-primary mb-1">
              Budget vs Actual — By Category
            </p>
            <p className="small text-app-secondary mb-3">
              Compare planned budget vs actual spending per category
            </p>
            <div className="chart-wrapper-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                  layout="vertical"
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-subtle)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar
                    dataKey="Budget"
                    name="Budget"
                    fill="#60a5fa"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar dataKey="Spent" name="Spent" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.pct > 85
                            ? "#e77a8c"
                            : entry.pct > 70
                              ? "#e8b25e"
                              : "#80c570"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Category Budget Table */}
      <Card>
        <p className="fw-semibold text-app-primary mb-3">
          Category Budget Settings
        </p>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th className="small text-app-muted text-uppercase fw-medium">
                  Category
                </th>
                <th className="small text-app-muted text-uppercase fw-medium">
                  Budget
                </th>
                <th className="small text-app-muted text-uppercase fw-medium">
                  Spent
                </th>
                <th className="small text-app-muted text-uppercase fw-medium">
                  Status
                </th>
                <th className="small text-app-muted text-uppercase fw-medium">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {catBudgets.map((c) => {
                const pct = c.amount
                  ? Math.min(100, Math.round((c.spent / c.amount) * 100))
                  : 0;
                return (
                  <tr key={c.id}>
                    <td className="fw-medium text-app-primary">
                      {c.category_name}
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm rounded-3"
                        style={{ width: 100 }}
                        value={c.amount}
                        onChange={(e) =>
                          handleCatBudgetChange(c.id, e.target.value)
                        }
                      />
                    </td>
                    <td className="text-danger fw-medium">
                      ${c.spent.toLocaleString()}
                    </td>
                    <td>
                      {pct > 85 ? (
                        <Badge variant="danger">Over Budget</Badge>
                      ) : pct > 70 ? (
                        <Badge variant="warning">High Usage</Badge>
                      ) : (
                        <Badge variant="success">On Track</Badge>
                      )}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="progress flex-grow-1"
                          style={{ height: 8 }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${pct}%`,
                              background:
                                pct > 85
                                  ? "#e77a8c"
                                  : pct > 70
                                    ? "#e8b25e"
                                    : "#80c570",
                            }}
                          />
                        </div>
                        <span className="x-small text-app-muted">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BudgetGoals;

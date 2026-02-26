import { useState, useEffect, useCallback } from "react";
import { CalendarRange, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { apiRequest, REPORTS_ENDPOINT } from "../../services/api";
import toast from "react-hot-toast";

const Reports = () => {
  const [view, setView] = useState("monthly");
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `${REPORTS_ENDPOINT}?from=${fromDate}&to=${toDate}`,
      );
      if (response && response.success) {
        setSummary(response.data.summary || []);
        setMonthlyData(response.data.monthly || []);
        setYearlyData(response.data.yearly || []);
        setCategoryBreakdown(response.data.categories || []);
      }
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const chartData = view === "monthly" ? monthlyData : yearlyData;

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Reports"
        subtitle="Analyze monthly/yearly performance and category breakdowns."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <Button variant="outline">
              <Download size={16} /> Export CSV
            </Button>
            <Button variant="secondary">
              <Download size={16} /> Export PDF
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="row g-3">
        {loading && summary.length === 0
          ? [1, 2, 3].map((i) => (
              <div key={i} className="col-6 col-md-4">
                <div className="placeholder-glow">
                  <div
                    className="placeholder col-12 rounded-4"
                    style={{ height: 80 }}
                  />
                </div>
              </div>
            ))
          : summary.map((stat) => (
              <div key={stat.title} className="col-6 col-md-4">
                <Card className="h-100">
                  <p className="small text-app-secondary mb-1">{stat.title}</p>
                  <h3 className="h4 fw-bold text-app-primary mb-1">
                    {stat.value}
                  </h3>
                  <span
                    className={`small fw-semibold ${stat.trend.startsWith("+") ? "text-success" : "text-danger"}`}
                  >
                    {stat.trend} vs last period
                  </span>
                </Card>
              </div>
            ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <div className="glass-card rounded-4 p-2 auth-tab-nav">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`auth-tab-btn ${view === "monthly" ? "active" : ""}`}
                  onClick={() => setView("monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${view === "yearly" ? "active" : ""}`}
                  onClick={() => setView("yearly")}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label small text-app-secondary mb-1">
              From
            </label>
            <input
              className="form-control rounded-3"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label small text-app-secondary mb-1">
              To
            </label>
            <input
              className="form-control rounded-3"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2 d-flex justify-content-md-end">
            <Button
              variant="outline"
              className="w-100 w-md-auto"
              onClick={fetchReports}
              disabled={loading}
            >
              <CalendarRange size={16} /> Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="row g-3 g-lg-4">
        <div className="col-lg-8">
          <Card className="h-100">
            <p className="fw-semibold text-app-primary mb-1">
              {view === "monthly"
                ? "Monthly Performance"
                : "Yearly Performance"}
            </p>
            <p className="small text-app-secondary mb-3">
              Income vs Expenses over time
            </p>
            <div className="chart-wrapper-lg">
              <ResponsiveContainer width="100%" height="100%">
                {view === "monthly" ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-subtle)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar
                      dataKey="credit"
                      name="Income"
                      fill="#80c570"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="debit"
                      name="Expenses"
                      fill="#e77a8c"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-subtle)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Line
                      type="monotone"
                      dataKey="credit"
                      name="Income"
                      stroke="#80c570"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="debit"
                      name="Expenses"
                      stroke="#e77a8c"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card className="h-100">
            <p className="fw-semibold text-app-primary mb-3">
              Category Breakdown
            </p>
            <div className="d-flex flex-column gap-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="d-flex justify-content-between small mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle"
                        style={{ width: 8, height: 8, background: cat.color }}
                      />
                      <span className="text-app-primary">{cat.name}</span>
                    </div>
                    <span className="fw-semibold text-app-secondary">
                      {cat.share}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${cat.share}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;

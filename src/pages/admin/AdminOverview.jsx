import { useEffect, useState } from "react";
import {
  ArrowRight,
  Settings,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import {
  getAdminStats,
  getUserGrowth,
  getTxGrowth,
  getTopCategories,
  getActivityFeed,
  getSystemHealth,
} from "../../services/adminApi";
import { toast } from "react-hot-toast";

// ─────────────────────────────────────────────
// KPI Card Component
// ─────────────────────────────────────────────
const KpiCard = ({ label, value, sub, trend, positive = true }) => (
  <Card className="h-100">
    <p className="small text-app-secondary mb-1">{label}</p>
    <h3 className="h4 fw-bold text-app-primary mb-1">{value}</h3>
    {sub && <p className="small text-app-muted mb-1">{sub}</p>}
    {trend && (
      <p
        className={`small fw-semibold mb-0 ${positive ? "text-success" : "text-danger"}`}
      >
        {trend} vs last month
      </p>
    )}
  </Card>
);

// ─────────────────────────────────────────────
// Activity Feed Level badge helper
// ─────────────────────────────────────────────
const levelVariant = {
  success: "success",
  info: "info",
  warning: "warning",
  danger: "danger",
};

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    systemBalance: 0,
    totalGoals: 0,
    totalBudgets: 0,
  });
  const [userGrowth, setUserGrowth] = useState([]);
  const [txGrowth, setTxGrowth] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [activity, setActivity] = useState([]); // Renamed from activityFeed
  const [systemHealth, setSystemHealth] = useState(null); // Added systemHealth state
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // Renamed from fetchAdminData
    try {
      setLoading(true);
      const [statsRes, uGrowthRes, tGrowthRes, catsRes, feedRes, healthRes] =
        await Promise.all([
          getAdminStats(),
          getUserGrowth(),
          getTxGrowth(),
          getTopCategories(),
          getActivityFeed(),
          getSystemHealth(),
        ]);

      if (statsRes) setStats(statsRes.data || statsRes);
      if (uGrowthRes) setUserGrowth(uGrowthRes.data || uGrowthRes);
      if (tGrowthRes) setTxGrowth(tGrowthRes.data || tGrowthRes);
      if (catsRes) setTopCategories(catsRes.data || catsRes);
      if (feedRes) setActivity(feedRes.data || feedRes);
      if (healthRes) setSystemHealth(healthRes.data || healthRes);
    } catch (error) {
      toast.error("Failed to refresh dashboard data"); // Updated toast message
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Registered Users",
      value: (stats.totalUsers?.value || 0).toLocaleString(),
      trend: stats.totalUsers?.trend || "+0%",
      positive: stats.totalUsers?.positive ?? true,
    },
    {
      label: "Active Users (30 days)",
      value: (stats.activeUsers?.value || 0).toLocaleString(),
      sub: stats.activeUsers?.sub || "0% of total",
      trend: stats.activeUsers?.trend || "Live",
      positive: stats.activeUsers?.positive ?? true,
    },
    {
      label: "Total Transactions",
      value: (stats.totalTransactions?.value || 0).toLocaleString(),
      trend: stats.totalTransactions?.trend || "+0%",
      positive: stats.totalTransactions?.positive ?? true,
    },
    {
      label: "System Balance",
      value: `$${Math.abs(stats.systemBalance?.value || 0) > 1000000 ? ((stats.systemBalance?.value || 0) / 1000000).toFixed(2) + "M" : (stats.systemBalance?.value || 0).toLocaleString()}`,
      trend: stats.systemBalance?.trend || "+0%",
      positive: stats.systemBalance?.positive ?? true,
    },
    {
      label: "Total Goals Created",
      value: (stats.totalGoals || 0).toLocaleString(),
      trend: "Total",
      positive: true,
    },
    {
      label: "Total Budgets Created",
      value: (stats.totalBudgets || 0).toLocaleString(),
      trend: "Total",
      positive: true,
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Admin Control Dashboard"
        subtitle="Centralized platform intelligence, growth metrics, and financial oversight."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/users")}
            >
              <Users size={16} />
              Manage Users
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/insights")}
            >
              <TrendingUp size={16} />
              Financial Insights
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings size={16} />
              System Settings
            </Button>
          </div>
        }
      />

      {/* ─── KPI Grid ─── */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 g-lg-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="col">
            <KpiCard {...kpi} />
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* ─── Main Content ─── */}
        <div className="col-xl-8">
          <div className="d-flex flex-column gap-4">
            {/* User & Transaction Growth */}
            <Card title="Platform Growth Snapshot">
              <div className="d-flex flex-column gap-5 py-3">
                <div className="chart-item">
                  <p className="small fw-semibold text-app-secondary mb-3">
                    User Acquisitions
                  </p>
                  <div className="chart-wrapper-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userGrowth}>
                        <defs>
                          <linearGradient
                            id="userGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366f1"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#6366f1"
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border-subtle)"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="var(--text-muted)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="var(--text-muted)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--bg-card)",
                            borderRadius: "12px",
                            border: "1px solid var(--border-subtle)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#6366f1"
                          fill="url(#userGrad)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-item">
                  <p className="small fw-semibold text-app-secondary mb-3">
                    Transaction Volume
                  </p>
                  <div className="chart-wrapper-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={txGrowth}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border-subtle)"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="var(--text-muted)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="var(--text-muted)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--bg-card)",
                            borderRadius: "12px",
                            border: "1px solid var(--border-subtle)",
                          }}
                        />
                        <Bar
                          dataKey="transactions"
                          fill="#f59e0b"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Health Section */}
            {systemHealth && (
              <Card title="System Health & Infrastructure">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-body-tertiary rounded-3 border border-app-subtle h-100">
                      <p className="small text-app-muted text-uppercase fw-bold mb-3 ls-wider">
                        Software Stack
                      </p>
                      <ul className="list-unstyled mb-0 small d-flex flex-column gap-2">
                        <li className="d-flex justify-content-between">
                          <span className="text-app-secondary">
                            PHP Version
                          </span>
                          <span className="fw-medium text-app-primary">
                            {systemHealth.php_version}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span className="text-app-secondary">
                            Laravel Version
                          </span>
                          <span className="fw-medium text-app-primary">
                            {systemHealth.laravel_version}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span className="text-app-secondary">Server OS</span>
                          <span className="fw-medium text-app-primary">
                            {systemHealth.server.os}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between align-items-center">
                          <span className="text-app-secondary">
                            Environment
                          </span>
                          <Badge variant="info">{systemHealth.env}</Badge>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-body-tertiary rounded-3 border border-app-subtle h-100">
                      <p className="small text-app-muted text-uppercase fw-bold mb-3 ls-wider">
                        Performance & Data
                      </p>
                      <ul className="list-unstyled mb-0 small d-flex flex-column gap-2">
                        <li className="d-flex justify-content-between">
                          <span className="text-app-secondary">DB Status</span>
                          <span className="fw-medium text-success">
                            Healthy ({systemHealth.database.connection})
                          </span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span className="text-app-secondary">
                            Memory Usage
                          </span>
                          <span className="fw-medium text-app-primary">
                            {systemHealth.memory_usage}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between">
                          <span className="text-app-secondary">
                            Cache Driver
                          </span>
                          <span className="fw-medium text-app-primary">
                            {systemHealth.cache_driver}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between overflow-hidden">
                          <span className="text-app-secondary">Software</span>
                          <span className="fw-medium text-app-primary text-truncate ms-2">
                            {systemHealth.server.software}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* ─── Sidebar Content ─── */}
        <div className="col-xl-4">
          <div className="d-flex flex-column gap-4">
            {/* Top Categories */}
            <Card title="Top expense categories">
              <div className="chart-wrapper-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCategories}
                    layout="vertical"
                    margin={{ left: -20 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="category"
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        background: "var(--bg-card)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                      }}
                    />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {topCategories.map((entry, index) => (
                        <rect
                          key={`cell-${index}`}
                          fill={entry.color || "#6366f1"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Activity Feed */}
            <Card title="System Activity Feed">
              <div
                className="d-flex flex-column gap-2"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {activity.length === 0 ? (
                  <p className="small text-app-muted text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 px-3 bg-body-tertiary rounded-3 border border-app-subtle"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-app-primary">
                          {item.user}
                        </span>
                        <Badge variant={levelVariant[item.level] || "info"}>
                          {item.level}
                        </Badge>
                      </div>
                      <p className="small text-app-secondary mb-1">
                        {item.action}
                      </p>
                      <span className="x-small text-app-muted">
                        {item.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

import { useState, useEffect } from "react";
import { FileDown, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
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
import { apiRequest, REPORTS_ENDPOINT } from "../../services/api";
import toast from "react-hot-toast";

const MonthlyReport = () => {
  const [data, setData] = useState({ summary: [], monthly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const to = now.toISOString().split("T")[0];

        const response = await apiRequest(
          `${REPORTS_ENDPOINT}?from=${from}&to=${to}`,
        );
        if (response && response.success) {
          setData(response.data);
        }
      } catch (error) {
        toast.error("Failed to load monthly report");
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center p-5">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Monthly Report"
        subtitle="Performance summary for the current month."
        actions={
          <Button variant="secondary">
            <FileDown size={16} />
            Export PDF
          </Button>
        }
      />

      <div className="row g-3 g-lg-4">
        {data.summary.map((item) => (
          <div className="col-md-4" key={item.title}>
            <Card className="h-100">
              <p className="small text-app-secondary mb-1">{item.title}</p>
              <h3 className="h4 fw-semibold text-app-primary mb-2">
                {item.value}
              </h3>
              <Badge
                variant={item.trend.startsWith("+") ? "success" : "danger"}
              >
                {item.trend}
              </Badge>
            </Card>
          </div>
        ))}
      </div>

      <Card>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <p className="fw-semibold text-app-primary mb-0">Revenue Trend</p>
            <p className="small text-app-secondary mb-0">
              Monthly revenue vs expenses
            </p>
          </div>
          <Badge variant="info">Live Data</Badge>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthly}>
              <defs>
                <linearGradient id="monthlyCredit" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--brand-primary)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--brand-primary)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                opacity={0.6}
              />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              />
              <Area
                type="monotone"
                dataKey="credit"
                name="Income"
                stroke="var(--brand-strong)"
                fill="url(#monthlyCredit)"
              />
              <Area
                type="monotone"
                dataKey="debit"
                name="Expenses"
                stroke="var(--accent-strong)"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyReport;

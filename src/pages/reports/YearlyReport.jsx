import { useState, useEffect } from "react";
import { FileDown, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
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

const YearlyReport = () => {
  const [data, setData] = useState({ summary: [], yearly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const from = new Date(now.getFullYear(), 0, 1)
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
        toast.error("Failed to load yearly report");
      } finally {
        setLoading(false);
      }
    };
    fetchYearlyData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center p-5">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Extract values from summary array
  const income =
    data.summary.find((s) => s.title === "Average Income")?.value || "$0";
  const expense =
    data.summary.find((s) => s.title === "Average Expense")?.value || "$0";
  const net =
    data.summary.find((s) => s.title === "Net Cash Flow")?.value || "$0";
  const trend =
    data.summary.find((s) => s.title === "Net Cash Flow")?.trend || "0%";

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Yearly Report"
        subtitle="Annual financial summary for leadership and compliance."
        actions={
          <Button variant="secondary">
            <FileDown size={16} />
            Export PDF
          </Button>
        }
      />

      <div className="row g-3 g-lg-4">
        <div className="col-md-6">
          <Card className="h-100">
            <p className="small text-app-secondary mb-3">Fiscal Highlights</p>
            <div className="d-flex flex-column gap-2 small text-app-secondary">
              <div className="d-flex align-items-center justify-content-between">
                <span>Total Revenue</span>
                <span className="fw-semibold text-app-primary">{income}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>Total Expenses</span>
                <span className="fw-semibold text-app-primary">{expense}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>Net Profit</span>
                <span className="fw-semibold text-success">{net}</span>
              </div>
            </div>
            <Badge
              variant={trend.startsWith("+") ? "success" : "danger"}
              className="mt-3"
            >
              {trend} YoY growth
            </Badge>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="h-100">
            <p className="small text-app-secondary mb-3">Compliance Snapshot</p>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-app-secondary mb-0">
              <li className="d-flex align-items-center justify-content-between">
                <span>Audit readiness score</span>
                <span className="fw-semibold text-app-primary">98%</span>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span>Policy exceptions</span>
                <span className="fw-semibold text-app-primary">0</span>
              </li>
              <li className="d-flex align-items-center justify-content-between">
                <span>Tax filings status</span>
                <span className="fw-semibold text-success">On track</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <div className="mb-3">
          <p className="fw-semibold text-app-primary mb-0">
            Yearly Revenue Mix
          </p>
          <p className="small text-app-secondary mb-0">
            Credit vs debit totals by month
          </p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.yearly}>
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
              <Bar
                dataKey="credit"
                name="Income"
                fill="var(--brand-strong)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="debit"
                name="Expenses"
                fill="var(--accent-strong)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default YearlyReport;

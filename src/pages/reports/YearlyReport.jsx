import { FileDown } from 'lucide-react'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { monthlyChartData } from '../../data/mockData'

const YearlyReport = () => (
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
              <span className="fw-semibold text-app-primary">$1.24M</span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span>Total Expenses</span>
              <span className="fw-semibold text-app-primary">$680K</span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span>Net Profit</span>
              <span className="fw-semibold text-success">$560K</span>
            </div>
          </div>
          <Badge variant="success" className="mt-3">
            +12.8% YoY growth
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
              <span className="fw-semibold text-app-primary">3</span>
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
        <p className="fw-semibold text-app-primary mb-0">Yearly Revenue Mix</p>
        <p className="small text-app-secondary mb-0">Credit vs debit totals by month</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            />
            <Bar dataKey="credit" fill="var(--brand-strong)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="debit" fill="var(--accent-strong)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
)

export default YearlyReport

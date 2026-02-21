import { useState } from 'react'
import { Download, FileText, Users, FileBarChart2, Clock } from 'lucide-react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { adminReportStats, adminRevenueTrend, adminExportHistory, usersData, adminLedgerTransactions } from '../../data/mockData'
import { exportUsersCSV, exportTransactionsCSV, exportAnalyticsSummary } from '../../services/adminApi'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────
// Report KPI Card
// ─────────────────────────────────────────────
const ReportCard = ({ label, value, change, positive }) => (
  <Card className="h-100">
    <p className="small text-app-secondary mb-1">{label}</p>
    <h3 className="h4 fw-bold text-app-primary mb-2">{value}</h3>
    <p className={`small fw-semibold mb-0 ${positive ? 'text-success' : 'text-danger'}`}>
      {change} vs last month
    </p>
  </Card>
)

// ─────────────────────────────────────────────
// Export Action Card
// ─────────────────────────────────────────────
const ExportCard = ({ icon: Icon, title, description, onExport, loading }) => (
  <Card className="h-100">
    <div className="d-flex align-items-start gap-3">
      <div
        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: '44px', height: '44px', background: 'var(--brand-primary)22' }}
      >
        <Icon size={20} style={{ color: 'var(--brand-primary)' }} />
      </div>
      <div className="flex-grow-1 min-w-0">
        <p className="fw-semibold text-app-primary mb-1">{title}</p>
        <p className="small text-app-secondary mb-3">{description}</p>
        <Button
          variant="outline"
          className="d-flex align-items-center gap-2"
          onClick={onExport}
          disabled={loading}
        >
          <Download size={15} />
          {loading ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>
    </div>
  </Card>
)

const AdminReports = () => {
  const [loadingExport, setLoadingExport] = useState(null)

  const handleExport = async (key, fn) => {
    setLoadingExport(key)
    try {
      await new Promise((r) => setTimeout(r, 600)) // simulate brief delay
      fn()
      toast.success('Export ready — check your downloads.')
    } catch {
      toast.error('Export failed.')
    } finally {
      setLoadingExport(null)
    }
  }

  const exportActions = [
    {
      key: 'users',
      icon: Users,
      title: 'User Data Export',
      description: `Export all ${usersData.length.toLocaleString()} registered users with profile, plan, and status info.`,
      fn: exportUsersCSV
    },
    {
      key: 'transactions',
      icon: FileText,
      title: 'Transaction Report',
      description: `Export ${adminLedgerTransactions.length.toLocaleString()} ledger transactions with category, amount, and status.`,
      fn: exportTransactionsCSV
    },
    {
      key: 'analytics',
      icon: FileBarChart2,
      title: 'Analytics Summary',
      description: 'Export aggregated platform KPIs including revenue, users, and activity rates.',
      fn: exportAnalyticsSummary
    }
  ]

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Reports & Export"
        subtitle="Analytics summary, revenue trends, and data export tools for the platform."
      />

      {/* ─── KPI Cards ─── */}
      <div className="row g-3 g-lg-4">
        {adminReportStats.map((stat) => (
          <div key={stat.label} className="col-sm-6 col-xl-3">
            <ReportCard {...stat} />
          </div>
        ))}
      </div>

      {/* ─── Revenue Trend Chart ─── */}
      <Card>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <p className="fw-semibold text-app-primary mb-0">Platform Revenue Trend</p>
            <p className="small text-app-secondary mb-0">Monthly aggregated revenue across all users</p>
          </div>
          <Badge variant="info">Live Data</Badge>
        </div>
        <div className="chart-wrapper-lg">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={adminRevenueTrend}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.45} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--brand-strong)" fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ─── Export Actions ─── */}
      <div>
        <h6 className="fw-semibold text-app-primary mb-3">Data Exports</h6>
        <div className="row g-3 g-lg-4">
          {exportActions.map(({ key, fn, ...rest }) => (
            <div key={key} className="col-md-4">
              <ExportCard
                {...rest}
                loading={loadingExport === key}
                onExport={() => handleExport(key, fn)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Export History ─── */}
      <Card>
        <div className="d-flex align-items-center gap-2 mb-3">
          <Clock size={16} className="text-app-muted" />
          <p className="fw-semibold text-app-primary mb-0">Recent Exports</p>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="small text-app-muted text-uppercase">Export Type</th>
                <th className="small text-app-muted text-uppercase">Requested By</th>
                <th className="small text-app-muted text-uppercase">File Size</th>
                <th className="small text-app-muted text-uppercase">Date & Time</th>
                <th className="small text-app-muted text-uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminExportHistory.map((item) => (
                <tr key={item.id}>
                  <td className="fw-medium text-app-primary">{item.type}</td>
                  <td className="text-app-secondary">{item.requestedBy}</td>
                  <td className="text-app-muted small">{item.size}</td>
                  <td className="small text-app-secondary">{item.createdAt}</td>
                  <td>
                    <Badge variant="success">{item.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default AdminReports

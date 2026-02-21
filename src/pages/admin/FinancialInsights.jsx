import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import { TrendingDown, TrendingUp, CreditCard, ShoppingCart } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { adminInsights, adminHighRiskUsers } from '../../data/mockData'

// ─────────────────────────────────────────────
// Risk level badge helper
// ─────────────────────────────────────────────
const riskVariant = { critical: 'danger', high: 'danger', medium: 'warning', low: 'success' }

// ─────────────────────────────────────────────
// Summary metric card
// ─────────────────────────────────────────────
const MetricCard = ({ icon: Icon, label, value, sub, color = 'var(--brand-primary)' }) => (
  <Card className="h-100">
    <div className="d-flex align-items-start gap-3">
      <div
        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: '44px', height: '44px', background: `${color}22` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="small text-app-secondary mb-1">{label}</p>
        <p className="h5 fw-bold text-app-primary mb-0">{value}</p>
        {sub && <p className="small text-app-muted mb-0 mt-1">{sub}</p>}
      </div>
    </div>
  </Card>
)

// ─────────────────────────────────────────────
// Custom Pie label
// ─────────────────────────────────────────────
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return percent > 0.08 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

const FinancialInsights = () => {
  const [filter, setFilter] = useState('all')

  const filteredRiskUsers = filter === 'all'
    ? adminHighRiskUsers
    : adminHighRiskUsers.filter((u) => u.risk === filter)

  const metrics = [
    {
      icon: TrendingUp,
      label: 'Avg. Savings Rate',
      value: `${adminInsights.avgSavingsRate}%`,
      sub: 'Across all active users',
      color: '#80c570'
    },
    {
      icon: TrendingDown,
      label: 'Avg. Debt Ratio',
      value: `${adminInsights.avgDebtRatio}%`,
      sub: 'Assets vs liabilities',
      color: '#e77a8c'
    },
    {
      icon: CreditCard,
      label: 'Most Used Account Type',
      value: adminInsights.mostUsedAccountType,
      sub: '42% of all accounts',
      color: '#60a5fa'
    },
    {
      icon: ShoppingCart,
      label: 'Top Expense Category',
      value: adminInsights.mostCommonCategory,
      sub: 'By total transaction volume',
      color: '#e8b25e'
    }
  ]

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Financial Insights"
        subtitle="Aggregated behavioral and financial health metrics across all platform users."
      />

      {/* ─── Summary Metrics ─── */}
      <div className="row g-3 g-lg-4">
        {metrics.map((m) => (
          <div key={m.label} className="col-sm-6 col-xl-3">
            <MetricCard {...m} />
          </div>
        ))}
      </div>

      {/* ─── Charts ─── */}
      <div className="row g-3 g-lg-4">
        {/* Savings Rate by Age Segment */}
        <div className="col-xl-7">
          <Card className="h-100">
            <div className="mb-3">
              <p className="fw-semibold text-app-primary mb-0">Savings Rate by User Segment</p>
              <p className="small text-app-secondary mb-0">Average savings rate across age groups</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminInsights.savingsRateBySegment} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.45} />
                  <XAxis dataKey="segment" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(v) => [`${v}%`, 'Avg. Savings Rate']}
                  />
                  <Bar dataKey="rate" name="Savings Rate %" fill="#80c570" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Account Type Distribution */}
        <div className="col-xl-5">
          <Card className="h-100">
            <div className="mb-3">
              <p className="fw-semibold text-app-primary mb-0">Account Type Distribution</p>
              <p className="small text-app-secondary mb-0">Most commonly used account types</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adminInsights.accountTypeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={CustomPieLabel}
                  >
                    {adminInsights.accountTypeDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(v, name) => [`${v}%`, name]}
                  />
                  <Legend
                    formatter={(value) => <span className="small text-app-secondary">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── High-Risk Users ─── */}
      <Card>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div>
            <p className="fw-semibold text-app-primary mb-0">High-Risk Users</p>
            <p className="small text-app-secondary mb-0">Users with low financial health scores</p>
          </div>
          <div className="d-flex gap-2">
            {['all', 'critical', 'high', 'medium'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFilter(level)}
                className={`btn btn-sm ${filter === level ? 'btn-secondary' : 'btn-outline-secondary'}`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="small text-app-muted text-uppercase">User</th>
                <th className="small text-app-muted text-uppercase">Email</th>
                <th className="small text-app-muted text-uppercase">Health Score</th>
                <th className="small text-app-muted text-uppercase">Debt Ratio</th>
                <th className="small text-app-muted text-uppercase">Status</th>
                <th className="small text-app-muted text-uppercase">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiskUsers.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold text-app-primary">{u.name}</td>
                  <td className="text-app-secondary">{u.email}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded"
                        style={{
                          width: '60px',
                          height: '6px',
                          background: 'var(--border-subtle)',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          className="h-100 rounded"
                          style={{
                            width: `${u.healthScore}%`,
                            background: u.healthScore < 40 ? '#e77a8c' : u.healthScore < 55 ? '#e8b25e' : '#80c570'
                          }}
                        />
                      </div>
                      <span className="small fw-semibold text-app-primary">{u.healthScore}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`small fw-semibold ${u.debtRatio > 60 ? 'text-danger' : u.debtRatio > 45 ? 'text-warning' : 'text-success'}`}>
                      {u.debtRatio}%
                    </span>
                  </td>
                  <td>
                    <Badge variant={u.status === 'active' ? 'success' : 'warning'}>{u.status}</Badge>
                  </td>
                  <td>
                    <Badge variant={riskVariant[u.risk]}>{u.risk}</Badge>
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

export default FinancialInsights

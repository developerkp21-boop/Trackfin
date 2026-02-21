import { useEffect, useState } from 'react'
import { ArrowRight, Settings, TrendingUp, Users, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  CartesianGrid
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import {
  adminPlatformStats,
  adminUserGrowth,
  adminTxGrowth,
  adminTopCategories,
  adminActivityFeed
} from '../../data/mockData'

// ─────────────────────────────────────────────
// KPI Card Component
// ─────────────────────────────────────────────
const KpiCard = ({ label, value, sub, trend, positive = true }) => (
  <Card className="h-100">
    <p className="small text-app-secondary mb-1">{label}</p>
    <h3 className="h4 fw-bold text-app-primary mb-1">{value}</h3>
    {sub && <p className="small text-app-muted mb-1">{sub}</p>}
    {trend && (
      <p className={`small fw-semibold mb-0 ${positive ? 'text-success' : 'text-danger'}`}>
        {trend} vs last month
      </p>
    )}
  </Card>
)

// ─────────────────────────────────────────────
// Activity Feed Level badge helper
// ─────────────────────────────────────────────
const levelVariant = { success: 'success', info: 'info', warning: 'warning', danger: 'danger' }

const AdminOverview = () => {
  const navigate = useNavigate()
  const [stats] = useState(adminPlatformStats)

  const kpis = [
    {
      label: 'Total Registered Users',
      value: stats.totalUsers.toLocaleString(),
      trend: '+12.4%',
      positive: true
    },
    {
      label: 'Active Users (30 days)',
      value: stats.activeUsers.toLocaleString(),
      sub: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total`,
      trend: '+6.8%',
      positive: true
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      trend: '+8.2%',
      positive: true
    },
    {
      label: 'System Balance',
      value: `$${(stats.systemBalance / 1000000).toFixed(2)}M`,
      trend: '+14.9%',
      positive: true
    },
    {
      label: 'Total Goals Created',
      value: stats.totalGoals.toLocaleString(),
      trend: '+3.1%',
      positive: true
    },
    {
      label: 'Total Budgets Created',
      value: stats.totalBudgets.toLocaleString(),
      trend: '+5.4%',
      positive: true
    }
  ]

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Admin Control Dashboard"
        subtitle="Centralized platform intelligence, growth metrics, and financial oversight."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
              <Users size={16} />
              Manage Users
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/insights')}>
              <TrendingUp size={16} />
              Financial Insights
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/settings')}>
              <Settings size={16} />
              System Settings
            </Button>
          </div>
        }
      />

      {/* ─── KPI Grid ─── */}
      <div className="row g-3 g-lg-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="col-sm-6 col-xl-4">
            <KpiCard {...kpi} />
          </div>
        ))}
      </div>

      {/* ─── Growth Charts ─── */}
      <div className="row g-3 g-lg-4">
        {/* User Growth */}
        <div className="col-xl-6">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Platform User Growth</p>
                <p className="small text-app-secondary mb-0">Registered users per month</p>
              </div>
              <Badge variant="success">Platform</Badge>
            </div>
            <div className="chart-wrapper-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adminUserGrowth}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.45} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Area type="monotone" dataKey="users" name="Users" stroke="var(--brand-strong)" fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Transaction Growth */}
        <div className="col-xl-6">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Transaction Volume Growth</p>
                <p className="small text-app-secondary mb-0">Global transactions per month</p>
              </div>
              <Badge variant="info">Ledger</Badge>
            </div>
            <div className="chart-wrapper-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminTxGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.45} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Bar dataKey="transactions" name="Transactions" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Top Categories + Activity Feed ─── */}
      <div className="row g-3 g-lg-4">
        {/* Top Expense Categories */}
        <div className="col-xl-7">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Top Expense Categories</p>
                <p className="small text-app-secondary mb-0">Aggregated across all users</p>
              </div>
              <Button variant="ghost" className="p-0 small" onClick={() => navigate('/admin/insights')}>
                View Insights <ArrowRight size={14} />
              </Button>
            </div>
            <div className="chart-wrapper-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminTopCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.45} horizontal={false} />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="category" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(v) => [`$${v.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="amount" name="Amount" radius={[0, 6, 6, 0]}>
                    {adminTopCategories.map((entry) => (
                      <rect key={entry.category} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* System Activity Feed */}
        <div className="col-xl-5">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">System Activity Feed</p>
                <p className="small text-app-secondary mb-0">Latest platform events</p>
              </div>
              <Activity size={16} className="text-app-muted" />
            </div>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {adminActivityFeed.map((item) => (
                <div key={item.id} className="rounded-3 bg-body-tertiary p-2 px-3">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <p className="small fw-semibold text-app-primary mb-0">{item.user}</p>
                    <div className="d-flex align-items-center gap-2">
                      <Badge variant={levelVariant[item.level]}>{item.level}</Badge>
                      <span className="small text-app-muted text-nowrap">{item.time}</span>
                    </div>
                  </div>
                  <p className="small text-app-secondary mb-0 mt-1">{item.action}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview

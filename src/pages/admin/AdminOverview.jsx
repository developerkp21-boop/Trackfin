import { ArrowRight, Settings, UserPlus, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import {
  adminChartData,
  adminLedgerTransactions,
  adminUserActivity,
  usersData
} from '../../data/mockData'

const AdminOverview = () => {
  const navigate = useNavigate()

  const totalUsers = usersData.length
  const totalTransactions = adminLedgerTransactions.length
  const totalRevenue = adminLedgerTransactions
    .filter((item) => item.type === 'income' && item.status === 'posted')
    .reduce((sum, item) => sum + item.amount, 0)
  const monthlyRevenue = adminLedgerTransactions
    .filter((item) => item.type === 'income' && item.date.startsWith('2026-02'))
    .reduce((sum, item) => sum + item.amount, 0)

  const summary = [
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      trend: '+4.1%'
    },
    {
      label: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      trend: '+9.8%'
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      trend: '+12.3%'
    },
    {
      label: 'Monthly Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      trend: '+6.2%'
    }
  ]

  const recentLedger = adminLedgerTransactions.slice(0, 5)

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Admin Control Dashboard"
        subtitle="Centralized financial controls, oversight, and ledger intelligence."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
              <UserPlus size={16} />
              Add User
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/transactions')}>
              <Wallet size={16} />
              View Transactions
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/settings')}>
              <Settings size={16} />
              System Settings
            </Button>
          </div>
        }
      />

      <div className="row g-3 g-lg-4">
        {summary.map((item) => (
          <div key={item.label} className="col-sm-6 col-xl-3">
            <Card className="h-100">
              <p className="small text-app-secondary mb-1">{item.label}</p>
              <h3 className="h4 fw-bold text-app-primary mb-2">{item.value}</h3>
              <p className="small fw-semibold text-success mb-0">{item.trend} vs last month</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="row g-3 g-lg-4">
        <div className="col-xl-8">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Revenue Performance</p>
                <p className="small text-app-secondary mb-0">Monthly system revenue trend</p>
              </div>
              <Badge variant="info">Live Analytics</Badge>
            </div>
            <div className="chart-wrapper-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adminChartData}>
                  <defs>
                    <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.45} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--brand-strong)" fill="url(#adminRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="col-xl-4">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Recent User Activity</p>
                <p className="small text-app-secondary mb-0">Latest admin actions</p>
              </div>
            </div>
            <div className="d-flex flex-column gap-2">
              {adminUserActivity.map((item) => (
                <div key={item.id} className="rounded-3 bg-body-tertiary p-2">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <p className="small fw-semibold text-app-primary mb-0">{item.user}</p>
                    <span className="small text-app-muted">{item.time}</span>
                  </div>
                  <p className="small text-app-secondary mb-0">{item.action}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div>
            <p className="fw-semibold text-app-primary mb-0">Recent Transactions</p>
            <p className="small text-app-secondary mb-0">Latest posted and pending ledger entries</p>
          </div>
          <Button variant="ghost" className="p-0" onClick={() => navigate('/admin/transactions')}>
            Open full ledger
            <ArrowRight size={16} />
          </Button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="small text-app-muted text-uppercase">Date</th>
                <th className="small text-app-muted text-uppercase">User</th>
                <th className="small text-app-muted text-uppercase">Category</th>
                <th className="small text-app-muted text-uppercase">Amount</th>
                <th className="small text-app-muted text-uppercase">Type</th>
                <th className="small text-app-muted text-uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLedger.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.user}</td>
                  <td>{item.category}</td>
                  <td className={item.type === 'income' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                    {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                  </td>
                  <td>
                    <Badge variant={item.type === 'income' ? 'success' : 'danger'}>
                      {item.type === 'income' ? 'Income' : 'Expense'}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={item.status === 'posted' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}>
                      {item.status}
                    </Badge>
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

export default AdminOverview

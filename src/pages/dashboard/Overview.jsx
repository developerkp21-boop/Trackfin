import { useMemo } from 'react'
import { PlusCircle, TrendingDown, TrendingUp, Wallet, Calendar, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { monthlyChartData, transactionsData, upcomingBills, healthScoreData } from '../../data/mockData'

const COLORS = ['#e77a8c', '#f97316', '#e8b25e', '#60a5fa', '#a78bfa', '#0ea5e9']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-3 p-2 small">
      <p className="fw-semibold text-app-primary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mb-0" style={{ color: entry.color }}>
          {entry.name}: <strong>${entry.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

const Overview = () => {
  const navigate = useNavigate()

  const totals = useMemo(() => {
    const income = transactionsData.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
    const expense = transactionsData.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
    const savingsRate = income ? Math.round(((income - expense) / income) * 100) : 0
    const last = monthlyChartData[monthlyChartData.length - 1]
    return { income, expense, balance: income - expense, savingsRate, monthlySummary: last }
  }, [])

  const pieData = useMemo(() => {
    const debits = transactionsData.filter((t) => t.type === 'debit')
    const total = debits.reduce((s, t) => s + t.amount, 0)
    const grouped = debits.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value, pct: total ? Math.round((value / total) * 100) : 0 }))
      .sort((a, b) => b.value - a.value)
  }, [])

  const recent = [...transactionsData].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

  const nextBills = upcomingBills.slice(0, 3)

  const getDaysUntil = (dateStr) => {
    const today = new Date('2026-02-20')
    const due = new Date(dateStr)
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Financial Dashboard"
        subtitle="Overview of income, expenses, and current ledger performance."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <Button variant="success" onClick={() => navigate('/transactions?type=credit')}>
              <PlusCircle size={16} /> Add Income
            </Button>
            <Button variant="outline" onClick={() => navigate('/transactions?type=debit')}>
              <PlusCircle size={16} /> Add Expense
            </Button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="row g-3 g-lg-4">
        <div className="col-6 col-xl-3">
          <Card className="h-100 stat-card-income">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="stat-icon bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <TrendingUp size={16} />
              </div>
              <p className="small text-app-secondary mb-0">Total Income</p>
            </div>
            <h3 className="h4 fw-bold text-success mb-0">${totals.income.toLocaleString()}</h3>
            <p className="small text-app-muted mt-1 mb-0">All time earnings</p>
          </Card>
        </div>
        <div className="col-6 col-xl-3">
          <Card className="h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="stat-icon bg-danger-subtle text-danger rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <TrendingDown size={16} />
              </div>
              <p className="small text-app-secondary mb-0">Total Expenses</p>
            </div>
            <h3 className="h4 fw-bold text-danger mb-0">${totals.expense.toLocaleString()}</h3>
            <p className="small text-app-muted mt-1 mb-0">All time spending</p>
          </Card>
        </div>
        <div className="col-6 col-xl-3">
          <Card className="h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="stat-icon bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <Wallet size={16} />
              </div>
              <p className="small text-app-secondary mb-0">Net Balance</p>
            </div>
            <h3 className="h4 fw-bold text-app-primary mb-0">${totals.balance.toLocaleString()}</h3>
            <p className="small text-app-muted mt-1 mb-0">Income minus expenses</p>
          </Card>
        </div>
        <div className="col-6 col-xl-3">
          <Card className="h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="stat-icon bg-warning-subtle text-warning rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <AlertCircle size={16} />
              </div>
              <p className="small text-app-secondary mb-0">Savings Rate</p>
            </div>
            <h3 className="h4 fw-bold text-app-primary mb-0">{totals.savingsRate}%</h3>
            <div className="progress mt-2" style={{ height: 6 }}>
              <div
                className={`progress-bar ${totals.savingsRate >= 20 ? 'bg-success' : 'bg-warning'}`}
                style={{ width: `${totals.savingsRate}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Health Score Mini-Widget */}
      <div className="row g-3">
        <div className="col-12">
          <Card className="health-score-banner">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="health-score-circle d-flex align-items-center justify-content-center rounded-circle fw-bold"
                  style={{ width: 64, height: 64, background: 'conic-gradient(#80c570 0% 74%, var(--border-subtle) 74% 100%)', fontSize: '1.1rem' }}>
                  <div className="health-score-inner d-flex align-items-center justify-content-center rounded-circle bg-body-tertiary fw-bold text-app-primary"
                    style={{ width: 50, height: 50, fontSize: '0.95rem' }}>
                    {healthScoreData.score}
                  </div>
                </div>
                <div>
                  <p className="fw-semibold text-app-primary mb-0">Financial Health Score</p>
                  <p className="small text-app-secondary mb-0">Status: <span className="fw-semibold text-success">Good</span> — Keep it up!</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => {}} className="btn-sm">
                View Full Report →
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 g-lg-4">
        <div className="col-lg-8">
          <Card className="h-100">
            <p className="fw-semibold text-app-primary mb-1">Income vs Expenses</p>
            <p className="small text-app-secondary mb-3">Monthly financial performance over the last 7 months</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="credit" name="Income" fill="#80c570" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="debit" name="Expenses" fill="#e77a8c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card className="h-100">
            <p className="fw-semibold text-app-primary mb-1">Expense Breakdown</p>
            <p className="small text-app-secondary mb-3">By category</p>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex flex-column gap-2 mt-3">
              {pieData.slice(0, 4).map((item, i) => (
                <div key={item.name} className="d-flex align-items-center gap-2">
                  <div className="rounded-circle flex-shrink-0" style={{ width: 8, height: 8, background: COLORS[i % COLORS.length] }} />
                  <span className="small text-app-primary flex-grow-1">{item.name}</span>
                  <span className="small fw-semibold text-app-secondary">{item.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Transactions + Bills */}
      <div className="row g-3 g-lg-4">
        <div className="col-xl-8">
          <Card>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Recent Transactions</p>
                <p className="small text-app-secondary mb-0">Latest entries from your ledger</p>
              </div>
              <Button variant="ghost" className="p-0" onClick={() => navigate('/transactions')}>
                View all →
              </Button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="small text-app-muted text-uppercase fw-medium">Date</th>
                    <th className="small text-app-muted text-uppercase fw-medium">Description</th>
                    <th className="small text-app-muted text-uppercase fw-medium d-none d-sm-table-cell">Category</th>
                    <th className="small text-app-muted text-uppercase fw-medium">Type</th>
                    <th className="small text-app-muted text-uppercase fw-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((item) => (
                    <tr key={item.id}>
                      <td className="small">{item.date}</td>
                      <td>
                        <p className="small fw-medium text-app-primary mb-0 text-truncate" style={{ maxWidth: 180 }}>{item.description}</p>
                        <p className="x-small text-app-muted mb-0">{item.id}</p>
                      </td>
                      <td className="d-none d-sm-table-cell">
                        <Badge variant="secondary">{item.category}</Badge>
                      </td>
                      <td>
                        <Badge variant={item.type === 'credit' ? 'success' : 'danger'}>
                          {item.type === 'credit' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {' '}{item.type === 'credit' ? 'In' : 'Out'}
                        </Badge>
                      </td>
                      <td className={`fw-semibold small ${item.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {item.type === 'credit' ? '+' : '-'}${item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="col-xl-4">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p className="fw-semibold text-app-primary mb-0">Upcoming Bills</p>
                <p className="small text-app-secondary mb-0">Next 30 days</p>
              </div>
              <Calendar size={16} className="text-app-muted" />
            </div>
            <div className="d-flex flex-column gap-3">
              {nextBills.map((bill) => {
                const days = getDaysUntil(bill.dueDate)
                const urgent = days <= 7
                return (
                  <div key={bill.id} className="d-flex align-items-center gap-3">
                    <div className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${urgent ? 'bg-danger-subtle' : 'bg-warning-subtle'}`}
                      style={{ width: 40, height: 40 }}>
                      <AlertCircle size={16} className={urgent ? 'text-danger' : 'text-warning'} />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <p className="small fw-medium text-app-primary mb-0 text-truncate">{bill.name}</p>
                      <p className="x-small text-app-muted mb-0">Due {bill.dueDate} · {days}d left</p>
                    </div>
                    <span className="small fw-semibold text-danger flex-shrink-0">-${bill.amount.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
            <Button variant="ghost" className="w-100 mt-3 p-0 small" onClick={() => navigate('/transactions')}>
              View all bills →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Overview

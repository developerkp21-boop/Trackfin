import { ArrowUpRight, CreditCard, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { monthlyChartData, recentTransactions, summaryStats } from '../../data/mockData'

const Overview = () => (
  <div className="space-y-8">
    <PageHeader
      title="Dashboard Overview"
      subtitle="Track balances, revenue, and account activity in real time."
      actions={
        <Button variant="secondary">
          <ArrowUpRight className="h-4 w-4" />
          View Insights
        </Button>
      }
    />

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Total Balance"
        value={`$${summaryStats.totalBalance.toLocaleString()}`}
        change="+4.2%"
        icon={DollarSign}
        accent="brand"
      />
      <StatCard
        title="Total Credit"
        value={`$${summaryStats.totalCredit.toLocaleString()}`}
        change="+9.1%"
        icon={TrendingUp}
        accent="emerald"
      />
      <StatCard
        title="Total Debit"
        value={`$${summaryStats.totalDebit.toLocaleString()}`}
        change="-2.4%"
        icon={TrendingDown}
        accent="red"
      />
    </div>

    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Monthly Cash Flow</p>
            <p className="text-xs text-text-secondary">
              Credit vs debit over the past 7 months
            </p>
          </div>
          <Badge variant="info">Live Data</Badge>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyChartData}>
              <defs>
                <linearGradient id="credit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--chart-credit))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="rgb(var(--chart-credit))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border-subtle) / 0.5)" />
              <XAxis dataKey="month" stroke="rgb(var(--text-muted))" fontSize={12} />
              <YAxis stroke="rgb(var(--text-muted))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgb(var(--bg-card) / 0.95)',
                  borderRadius: '12px',
                  border: '1px solid rgb(var(--border-subtle) / 0.6)',
                  color: 'rgb(var(--text-primary))'
                }}
              />
              <Line type="monotone" dataKey="credit" stroke="rgb(var(--chart-credit))" strokeWidth={3} />
              <Line type="monotone" dataKey="debit" stroke="rgb(var(--chart-debit))" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Recent Transactions</p>
            <p className="text-xs text-text-secondary">Last 4 transactions</p>
          </div>
          <Button variant="ghost">View all</Button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-secondary text-text-secondary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {item.description}
                  </p>
                  <p className="text-xs text-text-muted">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    item.type === 'credit' ? 'text-emerald-600' : 'text-blush-500'
                  }`}
                >
                  {item.type === 'credit' ? '+' : '-'}${item.amount.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)

export default Overview

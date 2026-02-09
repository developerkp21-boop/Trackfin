import { ShieldCheck } from 'lucide-react'
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
import StatCard from '../../components/StatCard'
import { adminChartData, adminOverviewStats } from '../../data/mockData'

const AdminOverview = () => (
  <div className="space-y-8">
    <PageHeader
      title="Admin Command Center"
      subtitle="System wide performance and user activity insights."
      actions={
        <Button variant="secondary">
          <ShieldCheck className="h-4 w-4" />
          Security Audit
        </Button>
      }
    />

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {adminOverviewStats.map((stat, index) => (
        <StatCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          change={stat.change}
          accent={index % 2 === 0 ? 'brand' : 'emerald'}
        />
      ))}
    </div>

    <Card className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink-900 dark:text-on-brand">System Revenue</p>
        <p className="text-xs text-ink-500">Monthly recurring revenue and user growth</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={adminChartData}>
            <defs>
              <linearGradient id="systemRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--chart-credit))" stopOpacity={0.35} />
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
            <Area type="monotone" dataKey="revenue" stroke="rgb(var(--chart-credit))" fill="url(#systemRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
)

export default AdminOverview

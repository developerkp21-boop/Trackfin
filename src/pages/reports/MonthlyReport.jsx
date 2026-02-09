import { FileDown } from 'lucide-react'
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
import { monthlyChartData, reportsSummary } from '../../data/mockData'

const MonthlyReport = () => (
  <div className="space-y-8">
    <PageHeader
      title="Monthly Report"
      subtitle="Performance summary for the current month."
      actions={
        <Button variant="secondary">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      }
    />

    <div className="grid gap-6 md:grid-cols-3">
      {reportsSummary.map((item) => (
        <Card key={item.title} className="space-y-3">
          <p className="text-sm text-ink-500 dark:text-ink-400">{item.title}</p>
          <h3 className="text-2xl font-semibold text-ink-900 dark:text-on-brand">
            {item.value}
          </h3>
          <Badge variant="success">{item.trend}</Badge>
        </Card>
      ))}
    </div>

    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-900 dark:text-on-brand">Revenue Trend</p>
          <p className="text-xs text-ink-500">Monthly revenue vs expenses</p>
        </div>
        <Badge variant="info">Updated Feb 2026</Badge>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyChartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="credit" stroke="rgb(var(--chart-credit))" fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="debit" stroke="rgb(var(--chart-debit))" fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
)

export default MonthlyReport

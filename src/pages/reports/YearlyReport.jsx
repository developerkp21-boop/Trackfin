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
  <div className="space-y-8">
    <PageHeader
      title="Yearly Report"
      subtitle="Annual financial summary for leadership and compliance."
      actions={
        <Button variant="secondary">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      }
    />

    <div className="grid gap-6 md:grid-cols-2">
      <Card className="space-y-4">
        <p className="text-sm text-ink-500">Fiscal Highlights</p>
        <div className="space-y-2 text-sm text-ink-600 dark:text-ink-300">
          <div className="flex items-center justify-between">
            <span>Total Revenue</span>
            <span className="font-semibold text-ink-900 dark:text-on-brand">$1.24M</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Expenses</span>
            <span className="font-semibold text-ink-900 dark:text-on-brand">$680K</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Net Profit</span>
            <span className="font-semibold text-emerald-500">$560K</span>
          </div>
        </div>
        <Badge variant="success">+12.8% YoY growth</Badge>
      </Card>

      <Card className="space-y-4">
        <p className="text-sm text-ink-500">Compliance Snapshot</p>
        <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-300">
          <li className="flex items-center justify-between">
            <span>Audit readiness score</span>
            <span className="font-semibold text-ink-900 dark:text-on-brand">98%</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Policy exceptions</span>
            <span className="font-semibold text-ink-900 dark:text-on-brand">3</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Tax filings status</span>
            <span className="font-semibold text-emerald-500">On track</span>
          </li>
        </ul>
      </Card>
    </div>

    <Card className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink-900 dark:text-on-brand">Yearly Revenue Mix</p>
        <p className="text-xs text-ink-500">Credit vs debit totals by month</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyChartData}>
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
            <Bar dataKey="credit" fill="rgb(var(--chart-credit))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="debit" fill="rgb(var(--chart-debit))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
)

export default YearlyReport

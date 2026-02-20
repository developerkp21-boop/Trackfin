import { HeartPulse, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { healthScoreData } from '../../data/mockData'

const statusConfig = {
  Poor: { color: '#e77a8c', variant: 'danger', icon: AlertTriangle, range: '0–40' },
  Average: { color: '#e8b25e', variant: 'warning', icon: Info, range: '41–60' },
  Good: { color: '#80c570', variant: 'success', icon: CheckCircle, range: '61–80' },
  Excellent: { color: '#60a5fa', variant: 'info', icon: CheckCircle, range: '81–100' }
}

const HealthScore = () => {
  const { score, status, breakdown, history } = healthScoreData
  const cfg = statusConfig[status]
  const StatusIcon = cfg.icon

  const radialData = [{ name: 'Score', value: score, fill: cfg.color }]

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Financial Health Score"
        subtitle="Understand how financially balanced your ledger is right now."
      />

      <div className="row g-3 g-lg-4">
        {/* Big Score */}
        <div className="col-lg-4">
          <Card className="h-100 text-center">
            <p className="fw-semibold text-app-primary mb-3">Overall Score</p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                  startAngle={210} endAngle={-30}
                  data={[{ value: 100, fill: 'var(--border-subtle)' }, ...radialData]}
                  barSize={18}
                >
                  <RadialBar background={false} dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: -80, marginBottom: 16 }}>
              <h2 className="fw-bold mb-0" style={{ fontSize: '3rem', color: cfg.color }}>{score}</h2>
              <p className="text-app-muted small mb-0">out of 100</p>
            </div>
            <Badge variant={cfg.variant} className="px-3 py-2 d-inline-flex align-items-center gap-2 fs-6 mt-2">
              <StatusIcon size={16} /> {status}
            </Badge>
            <div className="mt-3 p-2 rounded-3 bg-body-tertiary">
              <p className="x-small text-app-muted mb-1 text-uppercase fw-semibold">Score Ranges</p>
              {Object.entries(statusConfig).map(([s, c]) => (
                <div key={s} className="d-flex justify-content-between small">
                  <span style={{ color: c.color }} className="fw-medium">{s}</span>
                  <span className="text-app-muted">{c.range}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Breakdown */}
        <div className="col-lg-8">
          <Card className="h-100">
            <p className="fw-semibold text-app-primary mb-1">Score Breakdown</p>
            <p className="small text-app-secondary mb-4">Weighted factors contributing to your health score</p>
            <div className="d-flex flex-column gap-4">
              {breakdown.map((item) => (
                <div key={item.label}>
                  <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
                    <div>
                      <span className="fw-medium text-app-primary small">{item.label}</span>
                      <span className="ms-2 text-app-muted x-small">({item.weight}% weight)</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold small" style={{ color: item.color }}>{item.score}/100</span>
                      <Badge variant={item.score >= 75 ? 'success' : item.score >= 50 ? 'warning' : 'danger'}>
                        {item.score >= 75 ? 'Good' : item.score >= 50 ? 'Fair' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                  <div className="progress mb-1" style={{ height: 8 }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${item.score}%`, background: item.color, borderRadius: 6 }}
                    />
                  </div>
                  <p className="x-small text-app-muted mb-0">{item.tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Score History Chart */}
      <Card>
        <p className="fw-semibold text-app-primary mb-1">Score Trend</p>
        <p className="small text-app-secondary mb-3">Monthly health score progression</p>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [v, 'Health Score']} />
              <Line type="monotone" dataKey="score" stroke={cfg.color} strokeWidth={2.5} dot={{ fill: cfg.color, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tips */}
      <div className="row g-3">
        <div className="col-12">
          <Card>
            <p className="fw-semibold text-app-primary mb-3">Quick Improvement Actions</p>
            <div className="row g-3">
              {breakdown.filter((b) => b.score < 75).map((item) => (
                <div key={item.label} className="col-md-6">
                  <div className="rounded-3 p-3 border" style={{ borderColor: item.color + '44', background: item.color + '11' }}>
                    <p className="fw-semibold small mb-1" style={{ color: item.color }}>{item.label}</p>
                    <p className="x-small text-app-secondary mb-0">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HealthScore

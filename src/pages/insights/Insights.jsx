import { AlertTriangle, TrendingUp, CheckCircle, Lightbulb, RefreshCw, Cloud, Zap, ArrowRight } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { insightsData } from '../../data/mockData'

const alertIcons = { AlertTriangle, TrendingUp, CheckCircle }
const suggestionIcons = { RefreshCw, Cloud, Zap }

const priorityConfig = {
  high: { variant: 'danger', label: 'High Priority' },
  medium: { variant: 'warning', label: 'Medium' },
  low: { variant: 'secondary', label: 'Low' }
}

const alertLevelColors = {
  danger: { bg: 'bg-danger-subtle', border: '#e77a8c', text: 'text-danger' },
  warning: { bg: 'bg-warning-subtle', border: '#e8b25e', text: 'text-warning' },
  info: { bg: 'bg-info-subtle', border: '#60a5fa', text: 'text-info' },
  success: { bg: 'bg-success-subtle', border: '#80c570', text: 'text-success' }
}

const Insights = () => {
  const { spendingAlerts, savingsSuggestions, optimizationTips } = insightsData

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Smart Insights"
        subtitle="AI-powered financial alerts, suggestions, and optimization tips."
      />

      {/* Spending Alerts */}
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-danger" />
          <h2 className="h5 fw-semibold text-app-primary mb-0">Spending Alerts</h2>
          <Badge variant="danger">{spendingAlerts.length}</Badge>
        </div>
        <div className="d-flex flex-column gap-3">
          {spendingAlerts.map((alert) => {
            const style = alertLevelColors[alert.level]
            const Icon = alertIcons[alert.icon] || AlertTriangle
            return (
              <Card key={alert.id} className={`border-start border-3 ${style.bg}`} style={{ borderLeftColor: style.border + ' !important' }}>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 p-2 flex-shrink-0" style={{ background: style.border + '22' }}>
                    <Icon size={18} className={style.text} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                      <p className="fw-semibold text-app-primary mb-0">{alert.title}</p>
                      <Badge variant={alert.level === 'info' ? 'info' : alert.level}>{alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}</Badge>
                    </div>
                    <p className="small text-app-secondary mb-0">{alert.message}</p>
                    {alert.amount && (
                      <div className="mt-2 d-flex gap-3 flex-wrap">
                        <span className="x-small text-app-muted">Current: <strong className="text-app-primary">${alert.amount.toLocaleString()}</strong></span>
                        {alert.budget && <span className="x-small text-app-muted">Budget: <strong className="text-app-primary">${alert.budget.toLocaleString()}</strong></span>}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Savings Suggestions */}
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-warning" />
          <h2 className="h5 fw-semibold text-app-primary mb-0">Savings Suggestions</h2>
          <Badge variant="warning">{savingsSuggestions.length}</Badge>
        </div>
        <div className="row g-3">
          {savingsSuggestions.map((s) => {
            const Icon = suggestionIcons[s.icon] || Lightbulb
            return (
              <div key={s.id} className="col-md-6 col-xl-4">
                <Card className="h-100">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="rounded-3 p-2 bg-warning-subtle">
                      <Icon size={16} className="text-warning" />
                    </div>
                    <p className="fw-semibold text-app-primary mb-0">{s.title}</p>
                  </div>
                  <p className="small text-app-secondary mb-3 flex-grow-1">{s.description}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="x-small text-app-muted mb-0">Potential Annual Saving</p>
                      <p className="fw-bold text-success mb-0">${s.saving.toLocaleString()}</p>
                    </div>
                    <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1">
                      Apply <ArrowRight size={12} />
                    </button>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Optimization Tips */}
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <CheckCircle size={18} className="text-success" />
          <h2 className="h5 fw-semibold text-app-primary mb-0">Optimization Tips</h2>
          <Badge variant="success">{optimizationTips.length}</Badge>
        </div>
        <div className="d-flex flex-column gap-3">
          {optimizationTips.map((tip) => {
            const priority = priorityConfig[tip.priority]
            return (
              <Card key={tip.id}>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 bg-success-subtle p-2 flex-shrink-0">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                      <p className="fw-semibold text-app-primary mb-0">{tip.title}</p>
                      <div className="d-flex gap-2 align-items-center">
                        <Badge variant="secondary">{tip.category}</Badge>
                        <Badge variant={priority.variant}>{priority.label}</Badge>
                      </div>
                    </div>
                    <p className="small text-app-secondary mb-0">{tip.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Insights

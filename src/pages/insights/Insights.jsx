import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingUp, CheckCircle, Lightbulb, RefreshCw, Cloud, Zap, ArrowRight, Sparkles } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { apiRequest, INSIGHTS_ENDPOINT, INSIGHTS_REFRESH_ENDPOINT } from '../../services/api'
import { toast } from 'react-hot-toast'

const alertIcons = { AlertTriangle, TrendingUp, CheckCircle }
const suggestionIcons = { RefreshCw, Cloud, Zap }

const alertLevelColors = {
  danger: { bg: 'bg-danger-subtle', border: '#e77a8c', text: 'text-danger' },
  warning: { bg: 'bg-warning-subtle', border: '#e8b25e', text: 'text-warning' },
  info: { bg: 'bg-info-subtle', border: '#60a5fa', text: 'text-info' },
  success: { bg: 'bg-success-subtle', border: '#80c570', text: 'text-success' }
}

const Insights = () => {
  const [data, setData] = useState({
    spendingAlerts: [],
    savingsSuggestions: [],
    optimizationTips: []
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const data = await apiRequest(INSIGHTS_ENDPOINT)
      if (data) {
        setData(data)
      }
    } catch (error) {
      toast.error('Failed to load insights')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      toast.loading('AI is analyzing your finances...', { id: 'refresh-ai' })
      const response = await apiRequest(INSIGHTS_REFRESH_ENDPOINT, { method: 'POST' })
      
      if (response) {
        toast.success('New insights generated!', { id: 'refresh-ai' })
        fetchInsights()
      } else {
        toast.error(response?.message || 'Failed to generate insights', { id: 'refresh-ai' })
      }
    } catch (error) {
      toast.error('AI analysis failed. Please check your API key.', { id: 'refresh-ai' })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  if (loading && !data.spendingAlerts.length && !data.savingsSuggestions.length && !data.optimizationTips.length) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-app-secondary">TrackFin AI is gathering insights...</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const hasNoData = !data.spendingAlerts.length && !data.savingsSuggestions.length && !data.optimizationTips.length

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Smart Insights"
        subtitle="AI-powered financial alerts, suggestions, and optimization tips based on your activity."
        actions={
          <Button 
            variant="success" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="d-flex align-items-center gap-2"
          >
            {refreshing ? <RefreshCw size={16} className="spinner" /> : <Sparkles size={16} />}
            {refreshing ? 'Analyzing...' : 'Generate New Insights'}
          </Button>
        }
      />

      {hasNoData ? (
        <Card className="text-center py-5">
          <div className="mb-3 text-app-muted">
            <Sparkles size={48} />
          </div>
          <h5 className="text-app-primary">No insights available yet</h5>
          <p className="text-app-secondary small mb-4">Click the button above to let TrackFin AI analyze your recent transactions and budgets.</p>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>Get Started</Button>
        </Card>
      ) : (
        <>
          {/* Spending Alerts */}
          {data.spendingAlerts.length > 0 && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-danger" />
                <h2 className="h5 fw-semibold text-app-primary mb-0">Spending Alerts</h2>
                <Badge variant="danger">{data.spendingAlerts.length}</Badge>
              </div>
              <div className="d-flex flex-column gap-3">
                {data.spendingAlerts.map((alert) => {
                  const style = alertLevelColors[alert.level] || alertLevelColors.info
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
                          <p className="small text-app-secondary mb-2">{alert.message}</p>
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                             {alert.metadata?.amount && (
                              <div className="d-flex gap-3 flex-wrap">
                                <span className="x-small text-app-muted">Category: <strong className="text-app-primary">{alert.metadata.category}</strong></span>
                                <span className="x-small text-app-muted">Spent: <strong className="text-app-primary">${alert.metadata.amount.toLocaleString()}</strong></span>
                              </div>
                            )}
                            <span className="x-small text-app-muted ms-auto">{formatDate(alert.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Savings Suggestions */}
          {data.savingsSuggestions.length > 0 && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 mt-2">
                <Lightbulb size={18} className="text-warning" />
                <h2 className="h5 fw-semibold text-app-primary mb-0">Savings Suggestions</h2>
                <Badge variant="warning">{data.savingsSuggestions.length}</Badge>
              </div>
              <div className="row g-3">
                {data.savingsSuggestions.map((s) => {
                  const Icon = suggestionIcons[s.icon] || Lightbulb
                  return (
                    <div key={s.id} className="col-md-6 col-xl-4">
                      <Card className="h-100 d-flex flex-column">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-3 p-2 bg-warning-subtle">
                              <Icon size={16} className="text-warning" />
                            </div>
                            <p className="fw-semibold text-app-primary mb-0">{s.title}</p>
                          </div>
                        </div>
                        <p className="small text-app-secondary mb-3 flex-grow-1">{s.message}</p>
                        <div className="d-flex align-items-end justify-content-between mt-auto">
                          <div>
                            {s.metadata?.potential_saving && (
                              <>
                                <p className="x-small text-app-muted mb-0">Potential Saving</p>
                                <p className="fw-bold text-success mb-1">${s.metadata.potential_saving.toLocaleString()}</p>
                              </>
                            )}
                            <p className="x-small text-app-muted mb-0">{formatDate(s.created_at)}</p>
                          </div>
                          <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1">
                            Details <ArrowRight size={12} />
                          </button>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Optimization Tips */}
          {data.optimizationTips.length > 0 && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 mt-2">
                <CheckCircle size={18} className="text-success" />
                <h2 className="h5 fw-semibold text-app-primary mb-0">Optimization Tips</h2>
                <Badge variant="success">{data.optimizationTips.length}</Badge>
              </div>
              <div className="d-flex flex-column gap-3">
                {data.optimizationTips.map((tip) => {
                  return (
                    <Card key={tip.id}>
                      <div className="d-flex align-items-start gap-3">
                        <div className="rounded-3 bg-success-subtle p-2 flex-shrink-0">
                          <CheckCircle size={16} className="text-success" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                            <p className="fw-semibold text-app-primary mb-0">{tip.title}</p>
                            <Badge variant={tip.level || 'success'}>{tip.level?.toUpperCase() || 'GOOD'}</Badge>
                          </div>
                          <p className="small text-app-secondary mb-2">{tip.message}</p>
                          <div className="text-end">
                            <span className="x-small text-app-muted">{formatDate(tip.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Insights

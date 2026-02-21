import { useState } from 'react'
import { AlertTriangle, Monitor, ShieldAlert, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { adminLoginAttempts, adminSuspiciousActivity, adminDeviceSessions } from '../../data/mockData'

// ─────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, sub, iconColor = 'var(--brand-primary)' }) => (
  <div className="d-flex align-items-center gap-2 mb-3">
    <div
      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: '36px', height: '36px', background: `${iconColor}22` }}
    >
      <Icon size={18} style={{ color: iconColor }} />
    </div>
    <div>
      <p className="fw-semibold text-app-primary mb-0">{title}</p>
      <p className="small text-app-secondary mb-0">{sub}</p>
    </div>
  </div>
)

const SecurityMonitoring = () => {
  const [sessions, setSessions] = useState(adminDeviceSessions)
  const [revokeTarget, setRevokeTarget] = useState(null)

  const handleRevoke = () => {
    if (!revokeTarget) return
    setSessions((prev) => prev.filter((s) => s.id !== revokeTarget.id))
    setRevokeTarget(null)
  }

  const severityVariant = { high: 'danger', medium: 'warning', low: 'info' }
  const loginStatusVariant = { blocked: 'danger', warned: 'warning' }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="Security Monitoring"
          subtitle="Monitor login threats, suspicious activity, and manage active device sessions."
        />

        {/* ─── Failed Login Attempts ─── */}
        <Card>
          <SectionHeader
            icon={AlertTriangle}
            title="Failed Login Attempts"
            sub="Accounts with repeated authentication failures"
            iconColor="#e77a8c"
          />
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="small text-app-muted text-uppercase">Email / User</th>
                  <th className="small text-app-muted text-uppercase">IP Address</th>
                  <th className="small text-app-muted text-uppercase">Attempts</th>
                  <th className="small text-app-muted text-uppercase">Last Attempt</th>
                  <th className="small text-app-muted text-uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminLoginAttempts.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-medium text-app-primary">{item.user}</td>
                    <td className="font-monospace small text-app-secondary">{item.ip}</td>
                    <td>
                      <span className={`fw-bold ${item.attempts >= 7 ? 'text-danger' : item.attempts >= 4 ? 'text-warning' : 'text-success'}`}>
                        {item.attempts}x
                      </span>
                    </td>
                    <td className="small text-app-secondary">{item.lastAttempt}</td>
                    <td>
                      <Badge variant={loginStatusVariant[item.status]}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ─── Suspicious Activity Log ─── */}
        <Card>
          <SectionHeader
            icon={ShieldAlert}
            title="Suspicious Activity Log"
            sub="Flagged actions requiring admin review"
            iconColor="#e8b25e"
          />
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="small text-app-muted text-uppercase">User</th>
                  <th className="small text-app-muted text-uppercase">Action</th>
                  <th className="small text-app-muted text-uppercase">IP Address</th>
                  <th className="small text-app-muted text-uppercase">Severity</th>
                  <th className="small text-app-muted text-uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {adminSuspiciousActivity.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold text-app-primary">{item.user}</td>
                    <td className="text-app-secondary">{item.action}</td>
                    <td className="font-monospace small text-app-muted">{item.ip}</td>
                    <td>
                      <Badge variant={severityVariant[item.severity]}>{item.severity}</Badge>
                    </td>
                    <td className="small text-app-secondary">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ─── Device / Session Monitor ─── */}
        <Card>
          <SectionHeader
            icon={Monitor}
            title="Active Device Sessions"
            sub="Manage live user sessions and revoke suspicious tokens"
            iconColor="#60a5fa"
          />
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="small text-app-muted text-uppercase">User</th>
                  <th className="small text-app-muted text-uppercase">Device</th>
                  <th className="small text-app-muted text-uppercase">IP Address</th>
                  <th className="small text-app-muted text-uppercase">Location</th>
                  <th className="small text-app-muted text-uppercase">Last Seen</th>
                  <th className="small text-app-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-semibold text-app-primary">
                      <div className="d-flex align-items-center gap-2">
                        {s.name}
                        {s.current && (
                          <Badge variant="success">current</Badge>
                        )}
                        {s.user}
                      </div>
                    </td>
                    <td className="small text-app-secondary">{s.device}</td>
                    <td className="font-monospace small text-app-muted">{s.ip}</td>
                    <td className="small text-app-secondary">{s.location}</td>
                    <td className="small text-app-secondary">{s.lastSeen}</td>
                    <td className="text-end">
                      {s.current ? (
                        <span className="small text-app-muted fst-italic">Active session</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setRevokeTarget(s)}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ─── Revoke Confirmation Modal ─── */}
      {revokeTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15, 23, 42, 0.45)', zIndex: 1050 }}
        >
          <Card className="w-100" style={{ maxWidth: '28rem' }}>
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <div>
                <h5 className="mb-1 text-app-primary">Revoke Session</h5>
                <p className="small text-app-secondary mb-0">The user will be logged out immediately.</p>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setRevokeTarget(null)}>
                <X size={14} />
              </button>
            </div>
            <p className="mb-4 text-app-secondary">
              Revoke session for <strong className="text-app-primary">{revokeTarget.user}</strong> on{' '}
              <strong className="text-app-primary">{revokeTarget.device}</strong> from {revokeTarget.location}?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setRevokeTarget(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleRevoke}>Revoke Session</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default SecurityMonitoring

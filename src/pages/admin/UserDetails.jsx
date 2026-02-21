import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  KeyRound,
  UserMinus,
  UserPlus,
  Trash2,
  X,
  ShieldCheck
} from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { usersData, adminLedgerTransactions } from '../../data/mockData'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'summary', label: 'Financial Summary' },
  { key: 'transactions', label: 'Transactions' }
]

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('summary')
  const [user, setUser] = useState(() => usersData.find((u) => u.id === id) || null)

  // Modal states
  const [showResetPw, setShowResetPw] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  if (!user) {
    return (
      <div className="d-flex flex-column gap-4">
        <PageHeader title="User Not Found" subtitle="The requested user could not be located." />
        <Card>
          <p className="small text-app-secondary mb-3">No user found with ID: {id}</p>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            <ArrowLeft size={15} /> Back to Users
          </Button>
        </Card>
      </div>
    )
  }

  // Mock financial summary derived from user's transactions
  const userTxs = adminLedgerTransactions.filter((t) => t.user === user.name)
  const totalIncome = userTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = userTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0

  const toggleStatus = () => {
    const newStatus = user.status === 'active' ? 'deactivated' : 'active'
    setUser((u) => ({ ...u, status: newStatus }))
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}.`)
  }

  const handleResetPassword = () => {
    setShowResetPw(false)
    toast.success(`Password reset email sent to ${user.email}.`)
  }

  const handleDelete = () => {
    setShowDelete(false)
    toast.success('User deleted.')
    navigate('/admin/users')
  }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        {/* ─── Header ─── */}
        <PageHeader
          title="User Profile"
          subtitle="Read-only financial profile and account lifecycle controls."
          actions={
            <Button variant="ghost" className="p-0 small" onClick={() => navigate('/admin/users')}>
              <ArrowLeft size={16} /> Back to Users
            </Button>
          }
        />

        {/* ─── Profile Card ─── */}
        <Card>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
            {/* Avatar + Name */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--brand-primary)',
                  fontSize: '1.2rem'
                }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h5 className="mb-0 fw-bold text-app-primary">{user.name}</h5>
                  <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>{user.role}</Badge>
                  <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
                </div>
                <p className="small text-app-muted mb-0 d-flex align-items-center gap-1">
                  <Mail size={13} /> {user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} d-flex align-items-center gap-1`}
                onClick={toggleStatus}
              >
                {user.status === 'active' ? <><UserMinus size={14} /> Suspend</> : <><UserPlus size={14} /> Activate</>}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={() => setShowResetPw(true)}
              >
                <KeyRound size={14} /> Reset Password
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 size={14} /> Delete User
              </button>
            </div>
          </div>

          {/* ─── User Metadata ─── */}
          <div className="row g-3 mt-3 pt-3 border-top border-app-subtle">
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Plan</p>
              <p className="mb-0 fw-semibold text-app-primary">{user.plan}</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Joined Date</p>
              <p className="mb-0 fw-semibold text-app-primary">{user.joinedDate}</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Last Active</p>
              <p className="mb-0 fw-semibold text-app-primary">{user.lastActive}</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="small text-app-muted mb-1">Account ID</p>
              <p className="mb-0 fw-semibold text-app-primary font-monospace small">{user.id}</p>
            </div>
          </div>
        </Card>

        {/* ─── Tabs ─── */}
        <div className="d-flex gap-1 border-bottom border-app-subtle">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`btn btn-sm rounded-top-3 rounded-bottom-0 px-4 py-2 border-0 ${
                activeTab === key
                  ? 'bg-body-secondary text-app-primary fw-semibold'
                  : 'bg-transparent text-app-secondary'
              }`}
              style={{ marginBottom: '-1px', borderBottom: activeTab === key ? '2px solid var(--brand-primary)' : 'none' }}
            >
              <span className="small">{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Financial Summary Tab ─── */}
        {activeTab === 'summary' && (
          <div className="row g-3 g-lg-4">
            {[
              { label: 'Total Income', value: `$${totalIncome.toLocaleString()}`, color: '#80c570' },
              { label: 'Total Expenses', value: `$${totalExpense.toLocaleString()}`, color: '#e77a8c' },
              { label: 'Net Balance', value: `$${balance.toLocaleString()}`, color: balance >= 0 ? '#80c570' : '#e77a8c' },
              { label: 'Savings Rate', value: `${savingsRate}%`, color: 'var(--brand-primary)' }
            ].map((item) => (
              <div key={item.label} className="col-sm-6 col-xl-3">
                <Card className="h-100">
                  <p className="small text-app-secondary mb-1">{item.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: item.color }}>{item.value}</h4>
                </Card>
              </div>
            ))}

            {userTxs.length === 0 && (
              <div className="col-12">
                <Card>
                  <div className="text-center py-4">
                    <ShieldCheck size={32} className="text-app-muted mb-2" />
                    <p className="text-app-secondary small mb-0">No transaction data available for this user.</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ─── Transactions Tab ─── */}
        {activeTab === 'transactions' && (
          <Card>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="small text-app-muted text-uppercase">Date</th>
                    <th className="small text-app-muted text-uppercase">Category</th>
                    <th className="small text-app-muted text-uppercase">Amount</th>
                    <th className="small text-app-muted text-uppercase">Type</th>
                    <th className="small text-app-muted text-uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userTxs.length > 0 ? userTxs.map((tx) => (
                    <tr key={tx.id}>
                      <td className="small text-app-secondary">{tx.date}</td>
                      <td>{tx.category}</td>
                      <td className={`fw-semibold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                      <td>
                        <Badge variant={tx.type === 'income' ? 'success' : 'danger'}>{tx.type}</Badge>
                      </td>
                      <td>
                        <Badge variant={tx.status === 'posted' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-app-secondary small">No transactions found for this user.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* ─── Reset Password Modal ─── */}
      {showResetPw && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15,23,42,0.45)', zIndex: 1050 }}
        >
          <Card className="w-100" style={{ maxWidth: '28rem' }}>
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <h5 className="mb-0 text-app-primary">Reset Password</h5>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowResetPw(false)}>
                <X size={14} />
              </button>
            </div>
            <p className="text-app-secondary mb-4">
              Send a password reset link to <strong className="text-app-primary">{user.email}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setShowResetPw(false)}>Cancel</Button>
              <Button onClick={handleResetPassword}>Send Reset Link</Button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Delete User Modal ─── */}
      {showDelete && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15,23,42,0.45)', zIndex: 1050 }}
        >
          <Card className="w-100" style={{ maxWidth: '28rem' }}>
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <div>
                <h5 className="mb-1 text-app-primary">Delete User</h5>
                <p className="small text-app-secondary mb-0">This action cannot be undone.</p>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowDelete(false)}>
                <X size={14} />
              </button>
            </div>
            <p className="text-app-secondary mb-4">
              Are you sure you want to delete <strong className="text-app-primary">{user.name}</strong>? All their data will be permanently removed.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default UserDetails

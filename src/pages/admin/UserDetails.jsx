import { useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { usersData, recentTransactions } from '../../data/mockData'

const UserDetails = () => {
  const { id } = useParams()
  const user = usersData.find((item) => item.id === id)

  if (!user) {
    return (
      <Card>
        <p className="small text-app-secondary mb-0">User not found.</p>
      </Card>
    )
  }

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader title="User Details" subtitle="Account profile and latest activities." />

      <Card>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <p className="small text-app-secondary mb-1">User</p>
            <p className="h5 fw-semibold text-app-primary mb-1">{user.name}</p>
            <p className="small text-app-muted mb-0">{user.email}</p>
          </div>
          <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
        </div>

        <div className="row g-3">
          <div className="col-sm-4">
            <p className="small text-app-muted mb-1">Role</p>
            <p className="mb-0 fw-semibold text-app-primary text-capitalize">{user.role}</p>
          </div>
          <div className="col-sm-4">
            <p className="small text-app-muted mb-1">Plan</p>
            <p className="mb-0 fw-semibold text-app-primary">{user.plan}</p>
          </div>
          <div className="col-sm-4">
            <p className="small text-app-muted mb-1">Last Active</p>
            <p className="mb-0 fw-semibold text-app-primary">{user.lastActive}</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="fw-semibold text-app-primary mb-3">Recent Transactions</p>
        <div className="d-flex flex-column gap-2">
          {recentTransactions.map((item) => (
            <div key={item.id} className="d-flex align-items-center justify-content-between rounded-3 bg-body-tertiary p-2">
              <div>
                <p className="mb-0 fw-medium text-app-primary">{item.description}</p>
                <p className="small mb-0 text-app-muted">{item.date}</p>
              </div>
              <p className="fw-semibold mb-0 text-app-secondary">
                {item.type === 'credit' ? '+' : '-'}${item.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default UserDetails

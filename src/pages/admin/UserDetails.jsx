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
        <p className="text-sm text-ink-500">User not found.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Details"
        subtitle="Account profile and latest activities."
      />

      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-500">User</p>
            <p className="text-lg font-semibold text-ink-900 dark:text-on-brand">
              {user.name}
            </p>
            <p className="text-sm text-ink-400">{user.email}</p>
          </div>
          <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
            {user.status}
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-ink-400">Role</p>
            <p className="text-sm font-semibold text-ink-800 dark:text-on-brand">
              {user.role}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Plan</p>
            <p className="text-sm font-semibold text-ink-800 dark:text-on-brand">
              {user.plan}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Last Active</p>
            <p className="text-sm font-semibold text-ink-800 dark:text-on-brand">
              {user.lastActive}
            </p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <p className="text-sm font-semibold text-ink-900 dark:text-on-brand">Recent Transactions</p>
        <div className="space-y-3">
          {recentTransactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-ink-800 dark:text-on-brand">{item.description}</p>
                <p className="text-xs text-ink-400">{item.date}</p>
              </div>
              <p className="font-semibold text-ink-700 dark:text-ink-200">
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

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, UserMinus, UserPlus, Trash2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { usersData } from '../../data/mockData'

const ManageUsers = () => {
  const [users, setUsers] = useState(usersData)

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'active' ? 'deactivated' : 'active' }
          : user
      )
    )
  }

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Users"
        subtitle="Activate, review, or remove user access."
        actions={<Button variant="secondary">Invite New User</Button>}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-border-strong">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="text-text-secondary transition hover:bg-bg-secondary/60 dark:text-text-secondary dark:hover:bg-bg-secondary/40"
                >
                  <td className="py-4">
                    <p className="font-semibold text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </td>
                  <td className="py-4 capitalize">{user.role}</td>
                  <td className="py-4">{user.plan}</td>
                  <td className="py-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-4">{user.lastActive}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="rounded-lg border border-border-subtle p-2 text-text-muted transition hover:border-brand-300 hover:text-brand-600 dark:border-border-strong"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleStatus(user.id)}
                        className="rounded-lg border border-border-subtle p-2 text-text-muted transition hover:border-brand-300 hover:text-brand-600 dark:border-border-strong"
                      >
                        {user.status === 'active' ? (
                          <UserMinus className="h-4 w-4" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        className="rounded-lg border border-blush-200 p-2 text-blush-500 transition hover:border-blush-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ManageUsers

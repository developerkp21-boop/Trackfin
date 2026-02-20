import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Search, Trash2, UserMinus, UserPlus, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import Select from '../../components/Select'
import { usersData } from '../../data/mockData'

const ManageUsers = () => {
  const [users, setUsers] = useState(usersData)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase()
      const byText =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      const byRole = roleFilter === 'all' ? true : user.role === roleFilter
      const byStatus = statusFilter === 'all' ? true : user.status === statusFilter
      return byText && byRole && byStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'active' ? 'deactivated' : 'active' }
          : user
      )
    )
  }

  const deleteUser = () => {
    if (!deleteTarget) return
    setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="User Management"
          subtitle="Manage account access, role policies, and lifecycle controls."
          actions={<Button variant="secondary">Invite New User</Button>}
        />

        <Card>
          <div className="row g-3 align-items-end mb-3">
            <div className="col-12 col-md-6 col-xl-5">
              <label className="form-label small text-app-secondary mb-1">Search</label>
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 ms-3 text-app-muted" size={16} style={{ transform: 'translateY(-50%)' }} />
                <input
                  className="form-control rounded-3 ps-5"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3 col-xl-2">
              <Select label="Role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Select>
            </div>

            <div className="col-6 col-md-3 col-xl-2">
              <Select label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </Select>
            </div>

            <div className="col-12 col-xl-3 d-flex justify-content-xl-end">
              <p className="small text-app-secondary mb-0">{filteredUsers.length} users found</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="small text-app-muted text-uppercase">Name</th>
                  <th className="small text-app-muted text-uppercase">Email</th>
                  <th className="small text-app-muted text-uppercase">Role</th>
                  <th className="small text-app-muted text-uppercase">Status</th>
                  <th className="small text-app-muted text-uppercase">Joined Date</th>
                  <th className="small text-app-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-semibold text-app-primary">{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-capitalize">{user.role}</td>
                    <td>
                      <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
                    </td>
                    <td>{user.joinedDate}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-2 flex-wrap">
                        <button type="button" className="btn btn-outline-secondary btn-sm" aria-label="Edit user">
                          <Pencil size={15} />
                        </button>
                        <Link to={`/admin/users/${user.id}`} className="btn btn-outline-secondary btn-sm" aria-label="View user">
                          <Eye size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleStatus(user.id)}
                          className="btn btn-outline-secondary btn-sm"
                          aria-label={user.status === 'active' ? 'Disable user' : 'Enable user'}
                        >
                          {user.status === 'active' ? <UserMinus size={15} /> : <UserPlus size={15} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          className="btn btn-outline-danger btn-sm"
                          aria-label="Delete user"
                        >
                          <Trash2 size={15} />
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

      {deleteTarget && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(15, 23, 42, 0.45)', zIndex: 1050 }}>
          <Card className="w-100" style={{ maxWidth: '28rem' }}>
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <div>
                <h5 className="mb-1 text-app-primary">Delete User</h5>
                <p className="small text-app-secondary mb-0">This action cannot be undone.</p>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setDeleteTarget(null)}>
                <X size={14} />
              </button>
            </div>

            <p className="mb-4 text-app-secondary">
              Are you sure you want to delete <strong className="text-app-primary">{deleteTarget.name}</strong>?
            </p>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteUser}>
                Delete User
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default ManageUsers

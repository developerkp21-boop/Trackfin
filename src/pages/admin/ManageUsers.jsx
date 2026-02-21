import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, KeyRound, Search, Trash2, UserMinus, UserPlus, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import Select from '../../components/Select'
import { usersData } from '../../data/mockData'
import toast from 'react-hot-toast'

const ManageUsers = () => {
  const [users, setUsers] = useState(usersData)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [resetPwTarget, setResetPwTarget] = useState(null)

  const uniquePlans = [...new Set(usersData.map((u) => u.plan))]

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase()
      const byText =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      const byRole = roleFilter === 'all' ? true : user.role === roleFilter
      const byStatus = statusFilter === 'all' ? true : user.status === statusFilter
      const byPlan = planFilter === 'all' ? true : user.plan === planFilter
      const byDateFrom = dateFrom ? user.joinedDate >= dateFrom : true
      const byDateTo = dateTo ? user.joinedDate <= dateTo : true
      return byText && byRole && byStatus && byPlan && byDateFrom && byDateTo
    })
  }, [users, search, roleFilter, statusFilter, planFilter, dateFrom, dateTo])

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'active' ? 'deactivated' : 'active' }
          : user
      )
    )
    const u = users.find((u) => u.id === id)
    toast.success(`${u?.name} ${u?.status === 'active' ? 'suspended' : 'activated'}.`)
  }

  const deleteUser = () => {
    if (!deleteTarget) return
    setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id))
    toast.success(`${deleteTarget.name} deleted.`)
    setDeleteTarget(null)
  }

  const sendPasswordReset = () => {
    if (!resetPwTarget) return
    toast.success(`Password reset email sent to ${resetPwTarget.email}.`)
    setResetPwTarget(null)
  }

  const clearFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
    setPlanFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters =
    search || roleFilter !== 'all' || statusFilter !== 'all' || planFilter !== 'all' || dateFrom || dateTo

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="User Management"
          subtitle="Manage account access, roles, plans, and lifecycle controls."
          actions={<Button variant="secondary">Invite New User</Button>}
        />

        <Card>
          {/* ─── Filters ─── */}
          <div className="row g-3 align-items-end mb-3">
            {/* Search */}
            <div className="col-12 col-md-6 col-xl-4">
              <label className="form-label small text-app-secondary mb-1">Search</label>
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 ms-3 text-app-muted" size={16} style={{ transform: 'translateY(-50%)' }} />
                <input
                  className="form-control rounded-3 ps-5"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Role */}
            <div className="col-6 col-md-3 col-xl-2">
              <Select label="Role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Select>
            </div>

            {/* Status */}
            <div className="col-6 col-md-3 col-xl-2">
              <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </Select>
            </div>

            {/* Plan */}
            <div className="col-6 col-md-3 col-xl-2">
              <Select label="Plan" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                <option value="all">All Plans</option>
                {uniquePlans.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>

            {/* Date From */}
            <div className="col-6 col-md-3 col-xl-2">
              <label className="form-label small text-app-secondary mb-1">Joined From</label>
              <input
                type="date"
                className="form-control rounded-3"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="col-6 col-md-3 col-xl-2">
              <label className="form-label small text-app-secondary mb-1">Joined To</label>
              <input
                type="date"
                className="form-control rounded-3"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Summary + Clear */}
            <div className="col-12 col-xl d-flex align-items-center gap-3 justify-content-xl-end">
              <p className="small text-app-secondary mb-0">
                <span className="fw-semibold text-app-primary">{filteredUsers.length}</span> users found
              </p>
              {hasActiveFilters && (
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ─── Table ─── */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="small text-app-muted text-uppercase">Name</th>
                  <th className="small text-app-muted text-uppercase">Email</th>
                  <th className="small text-app-muted text-uppercase">Role</th>
                  <th className="small text-app-muted text-uppercase">Plan</th>
                  <th className="small text-app-muted text-uppercase">Status</th>
                  <th className="small text-app-muted text-uppercase">Joined</th>
                  <th className="small text-app-muted text-uppercase">Last Active</th>
                  <th className="small text-app-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-app-secondary small">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-semibold text-app-primary">{user.name}</td>
                      <td className="text-app-secondary small">{user.email}</td>
                      <td>
                        <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>{user.role}</Badge>
                      </td>
                      <td className="small text-app-secondary">{user.plan}</td>
                      <td>
                        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
                      </td>
                      <td className="small text-app-secondary">{user.joinedDate}</td>
                      <td className="small text-app-secondary">{user.lastActive}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="btn btn-outline-secondary btn-sm"
                            aria-label="View user"
                            title="View Profile"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleStatus(user.id)}
                            className="btn btn-outline-secondary btn-sm"
                            aria-label={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                            title={user.status === 'active' ? 'Suspend' : 'Activate'}
                          >
                            {user.status === 'active' ? <UserMinus size={15} /> : <UserPlus size={15} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setResetPwTarget(user)}
                            className="btn btn-outline-secondary btn-sm"
                            aria-label="Reset password"
                            title="Reset Password"
                          >
                            <KeyRound size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(user)}
                            className="btn btn-outline-danger btn-sm"
                            aria-label="Delete user"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15, 23, 42, 0.45)', zIndex: 1050 }}
        >
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
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" onClick={deleteUser}>Delete User</Button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Reset Password Modal ─── */}
      {resetPwTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15, 23, 42, 0.45)', zIndex: 1050 }}
        >
          <Card className="w-100" style={{ maxWidth: '28rem' }}>
            <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
              <h5 className="mb-0 text-app-primary">Reset Password</h5>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setResetPwTarget(null)}>
                <X size={14} />
              </button>
            </div>
            <p className="mb-4 text-app-secondary">
              Send a password reset link to <strong className="text-app-primary">{resetPwTarget.email}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setResetPwTarget(null)}>Cancel</Button>
              <Button onClick={sendPasswordReset}>Send Reset Link</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default ManageUsers

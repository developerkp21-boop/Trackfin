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
import './ManageUsers.css'

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
      <div className="d-flex flex-column gap-4 manage-users-wrapper">
        <PageHeader
          title="User Management"
          subtitle="Manage account access, roles, plans, and lifecycle controls."
          actions={<Button variant="secondary">Invite New User</Button>}
        />

        <Card>
          {/* ─── Filters ─── */}
          <div className="filter-section">
            <div className="row g-3">
              <div className="col-lg-4 col-md-6">
                <label className="form-label small fw-bold text-app-secondary mb-1">Search User</label>
                <div className="position-relative search-input-wrapper">
                  <Search className="position-absolute top-50 start-0 ms-3 text-app-muted search-icon" size={16} style={{ transform: 'translateY(-50%)' }} />
                  <input
                    className="form-control rounded-3 ps-5 bg-white border-light shadow-sm"
                    placeholder="Name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-2 col-md-3 col-6">
                <Select label="Role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} wrapperClassName="mb-0" isSearchable>
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Select>
              </div>

              <div className="col-lg-2 col-md-3 col-6">
                <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="mb-0" isSearchable>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="deactivated">Deactivated</option>
                </Select>
              </div>

              <div className="col-lg-4 col-md-12 d-flex flex-column flex-sm-row gap-2 align-items-sm-end">
                <div className="flex-grow-1">
                  <label className="form-label small fw-bold text-app-secondary mb-1">Joined From</label>
                  <input
                    type="date"
                    className="form-control rounded-3 border-light bg-white shadow-sm small py-1"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters} disabled={!hasActiveFilters}>
                    <X size={14} className="me-1" /> Clear
                  </Button>
                  <p className="small text-app-muted mb-0 flex-shrink-0">
                    {filteredUsers.length} found
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Table ─── */}
          <div className="table-responsive">
            <table className="table align-middle mb-0 manage-users-table">
              <thead className="bg-light d-none d-lg-table-header-group">
                <tr>
                  <th className="small text-app-muted text-uppercase fw-bold border-0">Name</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0">Email</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0">Role</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0">Plan</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0">Status</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0 d-none d-xl-table-cell">Joined</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0 d-none d-xl-table-cell text-center">Last Active</th>
                  <th className="small text-app-muted text-uppercase fw-bold border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-app-secondary small">
                      <div className="d-flex flex-column align-items-center gap-2">
                        <Search size={32} className="text-app-muted opacity-25" />
                        <p className="mb-0">No users match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      {/* Standard Columns (Desktop Only) */}
                      <td data-label="Name" className="fw-semibold text-app-primary d-none d-lg-table-cell">{user.name}</td>
                      <td data-label="Email" className="text-app-secondary small d-none d-lg-table-cell">{user.email}</td>
                      <td data-label="Role" className="d-none d-lg-table-cell">
                        <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>{user.role}</Badge>
                      </td>
                      <td data-label="Plan" className="small text-app-secondary d-none d-lg-table-cell">{user.plan}</td>
                      <td data-label="Status" className="d-none d-lg-table-cell">
                        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
                      </td>
                      <td data-label="Joined" className="small text-app-secondary d-none d-xl-table-cell">{user.joinedDate}</td>
                      <td data-label="Last Active" className="small text-app-secondary d-none d-xl-table-cell text-center">{user.lastActive}</td>
                      
                      {/* Mobile Column Structure (Mobile Only) */}
                      <td className="w-100 d-lg-none p-0 border-0 mobile-card-container">
                        <div className="mobile-card-grid">
                          {/* Left Column */}
                          <div className="mobile-card-left">
                            <h6 className="mobile-name mb-1">{user.name}</h6>
                            <div className="mobile-email mb-2 text-lowercase">{user.email}</div>
                            <div className="mobile-role-text"><b>Role:</b> {user.role}</div>
                            <div className="mobile-date-text mt-1">{user.joinedDate}</div>
                          </div>

                          {/* Right Column */}
                          <div className="mobile-card-right">
                            <div className="mb-1 text-end w-100">
                              <span className="mobile-plan-name">{user.plan}</span>
                            </div>
                            <div className="mb-2 text-end w-100">
                              <Badge variant={user.status === 'active' ? 'success' : 'warning'} className="mobile-status-badge">
                                {user.status}
                              </Badge>
                            </div>
                            
                            <div className="manage-user-actions-mobile justify-content-end mb-2">
                              <Link to={`/admin/users/${user.id}`} className="btn-icon-outline" title="View Profile">
                                <Eye size={12} />
                              </Link>
                              <button onClick={() => setResetPwTarget(user)} className="btn-icon-outline" title="Reset Password">
                                <KeyRound size={12} />
                              </button>
                              <button onClick={() => toggleStatus(user.id)} className="btn-icon-outline" title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                                {user.status === 'active' ? <UserMinus size={12} /> : <UserPlus size={12} />}
                              </button>
                              <button onClick={() => setDeleteTarget(user)} className="btn-icon-outline btn-delete" title="Delete">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Desktop Actions (Desktop Only) */}
                      <td className="text-end desktop-actions d-none d-lg-table-cell">
                        <div className="d-flex justify-content-end gap-1">
                          <Link to={`/admin/users/${user.id}`} className="btn btn-light btn-sm rounded-2 text-app-secondary" title="View Details"><Eye size={15} /></Link>
                          <button onClick={() => setResetPwTarget(user)} className="btn btn-light btn-sm rounded-2 text-app-secondary" title="Reset Password"><KeyRound size={15} /></button>
                          <button onClick={() => toggleStatus(user.id)} className="btn btn-light btn-sm rounded-2 text-app-secondary" title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                            {user.status === 'active' ? <UserMinus size={15} /> : <UserPlus size={15} />}
                          </button>
                          <button onClick={() => setDeleteTarget(user)} className="btn btn-light-danger btn-sm rounded-2 text-danger" title="Delete Account"><Trash2 size={15} /></button>
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
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 modal-backdrop-custom"
        >
          <Card className="w-100 modal-content-custom shadow-lg" style={{ maxWidth: '28rem' }}>
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
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 modal-backdrop-custom"
        >
          <Card className="w-100 modal-content-custom shadow-lg" style={{ maxWidth: '28rem' }}>
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

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
        <style>
          {`
            /* Desktop remains unchanged (≥ 1024px) */
            @media (min-width: 1024px) {
              .manage-user-card-label { display: none; }
              .user-details-stacked { display: none !important; }
            }

            /* Mobile View (≤ 768px) */
            @media (max-width: 768px) {
              .table-responsive {
                overflow: visible !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .table {
                background: transparent !important;
                border: none !important;
                border-collapse: separate !important;
                border-spacing: 0 0.5rem !important;
              }
              .table thead {
                display: none !important;
              }
              .table tbody tr {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                background: #ffffff !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 0.5rem !important;
                padding: 0.5rem 0.625rem !important;
                margin-bottom: 0.5rem !important;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
                gap: 0.375rem !important;
                width: 100% !important;
                position: relative;
              }
              .table tbody td {
                display: block !important;
                border: none !important;
                padding: 0 !important;
                background: transparent !important;
              }

              /* Section 1: Info (Name, Email, Role) */
              .col-user-info {
                flex: 1 1 50% !important; 
                display: flex !important;
                flex-direction: column !important;
                gap: 0 !important;
                min-width: 140px !important;
              }
              .mobile-name {
                font-size: 0.9rem !important;
                font-weight: 700 !important;
                color: #111827 !important;
                margin: 0 !important;
                line-height: 1.2 !important;
                word-break: break-word;
              }
              .mobile-email {
                font-size: 0.675rem !important;
                color: #6b7280 !important;
                margin: 0 !important;
                line-height: 1.2 !important;
                word-break: break-all;
              }
              .mobile-role-text {
                font-size: 0.675rem !important;
                color: #6b7280 !important;
                line-height: 1.2 !important;
              }
              .mobile-role-text b {
                font-weight: 600 !important;
                color: #374151 !important;
              }

              /* Section 2: Badge (Absolute or Flex) */
              .col-user-badge {
                flex: 0 0 auto !important;
                display: flex !important;
                justify-content: center !important;
                align-items: flex-start !important;
                padding-top: 0.125rem !important;
              }

              /* Section 3: Status/Plan/Actions */
              .col-user-status {
                flex: 1 0 auto !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-end !important;
                gap: 0.125rem !important;
                text-align: right !important;
                min-width: 120px !important;
              }
              .mobile-plan-name {
                font-size: 0.7rem !important;
                font-weight: 600 !important;
                color: #4b5563 !important;
                line-height: 1.2 !important;
              }
              .mobile-date-text {
                font-size: 0.625rem !important;
                color: #9ca3af !important;
                margin: 0 !important;
                line-height: 1.2 !important;
              }
              .manage-user-actions-mobile {
                display: flex !important;
                flex-wrap: wrap !important;
                justify-content: flex-end !important;
                gap: 0.125rem !important;
              }
              .btn-icon-outline {
                width: 26px !important;
                height: 26px !important;
                padding: 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 0.375rem !important;
                background: #ffffff !important;
                color: #6b7280 !important;
              }
              .btn-icon-outline svg {
                width: 13px !important;
                height: 13px !important;
              }

              /* Extra Scaling: On very small screens, make it a true stack if needed */
              @media (max-width: 340px) {
                .col-user-info { flex: 1 1 100% !important; order: 1; }
                .col-user-badge { position: absolute; top: 0.5rem; right: 0.625rem; order: 2; }
                .col-user-status { flex: 1 1 100% !important; align-items: flex-start !important; text-align: left !important; order: 3; margin-top: 0.25rem; border-top: 1px dashed #f3f4f6; padding-top: 0.25rem; }
                .manage-user-actions-mobile { justify-content: flex-start !important; }
              }
              .btn-icon-outline:hover {
                border-color: #cbd5e1 !important;
                background: #f8fafc !important;
              }
              .btn-icon-outline.btn-delete {
                border-color: #ffd8df !important;
                color: #ef4444 !important;
              }
              .btn-icon-outline.btn-delete:hover {
                background: #fff1f2 !important;
              }

              /* Hide standard columns in mobile card */
              .table tbody td[data-label="Name"],
              .table tbody td[data-label="Email"],
              .table tbody td[data-label="Role"],
              .table tbody td[data-label="Plan"],
              .table tbody td[data-label="Status"],
              .table tbody td[data-label="Joined"],
              .table tbody td[data-label="Last Active"],
              .table tbody td.user-details-stacked,
              .table tbody td:last-child:not(.col-user-status) {
                display: none !important;
              }
            }
          `}
        </style>
        <PageHeader
          title="User Management"
          subtitle="Manage account access, roles, plans, and lifecycle controls."
          actions={<Button variant="secondary">Invite New User</Button>}
        />

        <Card>
          {/* ─── Filters ─── */}
          <div className="row g-2 align-items-end mb-3">
            <div className="col-12">
              <label className="form-label small text-app-secondary mb-1">Search</label>
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 ms-3 text-app-muted" size={16} style={{ transform: 'translateY(-50%)' }} />
                <input
                  className="form-control rounded-3 ps-5 bg-light border-0"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6">
              <label className="form-label small text-app-secondary mb-1">Role</label>
              <select className="form-select rounded-3 border-light bg-light text-app-secondary small" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="col-6">
              <label className="form-label small text-app-secondary mb-1">&nbsp;</label>
              <select className="form-select rounded-3 border-light bg-light text-app-secondary small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mt-2">
              <div className="flex-grow-1">
                <label className="form-label small text-app-secondary mb-1">Joined From</label>
                <input
                  type="date"
                  className="form-control rounded-3 border-light bg-light text-center small py-1"
                  style={{maxWidth: '160px'}}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <p className="small text-app-muted mb-0 pt-3">
                {filteredUsers.length} users found
              </p>
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
                      {/* Standard Columns (Desktop) */}
                      <td data-label="Name" className="fw-semibold text-app-primary">{user.name}</td>
                      <td data-label="Email" className="text-app-secondary small">{user.email}</td>
                      <td data-label="Role">
                        <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>{user.role}</Badge>
                      </td>
                      <td data-label="Plan" className="small text-app-secondary">{user.plan}</td>
                      <td data-label="Status">
                        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>{user.status}</Badge>
                      </td>
                      <td data-label="Joined" className="small text-app-secondary">{user.joinedDate}</td>
                      <td data-label="Last Active" className="small text-app-secondary">{user.lastActive}</td>
                      
                      {/* Mobile Column Structure (3 Cols) */}
                      <td className="col-user-info">
                        <h6 className="mobile-name">{user.name}</h6>
                        <div className="mobile-email text-lowercase">{user.email}</div>
                        <div className="mobile-role-text"><b>Role:</b> {user.role}</div>
                      </td>

                      <td className="col-user-badge">
                        <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>{user.role}</Badge>
                      </td>

                      <td className="col-user-status">
                        <div className="mobile-plan-name">{user.plan}</div>
                        
                        {user.status === 'active' ? (
                          <div className="manage-user-actions-mobile">
                            <Link to={`/admin/users/${user.id}`} className="btn-icon-outline" title="View Profile">
                              <Eye size={14} />
                            </Link>
                            <button onClick={() => setResetPwTarget(user)} className="btn-icon-outline" title="Reset Password">
                              <KeyRound size={14} />
                            </button>
                            <button onClick={() => toggleStatus(user.id)} className="btn-icon-outline" title="Suspend">
                              <UserMinus size={14} />
                            </button>
                            <button onClick={() => setDeleteTarget(user)} className="btn-icon-outline btn-delete" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="my-1">
                            <Badge variant="warning" className="px-3">{user.status}</Badge>
                          </div>
                        )}

                        <div className="mobile-date-text">{user.joinedDate}</div>
                      </td>

                      {/* Desktop Actions */}
                      <td className="text-end d-none d-lg-table-cell">
                        <div className="d-flex justify-content-end gap-2">
                          <Link to={`/admin/users/${user.id}`} className="btn btn-outline-secondary btn-sm"><Eye size={15} /></Link>
                          <button onClick={() => setResetPwTarget(user)} className="btn btn-outline-secondary btn-sm"><KeyRound size={15} /></button>
                          <button onClick={() => toggleStatus(user.id)} className="btn btn-outline-secondary btn-sm">
                            {user.status === 'active' ? <UserMinus size={15} /> : <UserPlus size={15} />}
                          </button>
                          <button onClick={() => setDeleteTarget(user)} className="btn btn-outline-danger btn-sm"><Trash2 size={15} /></button>
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

/**
 * adminApi.js
 * Centralized Axios-like service for all Admin API calls.
 * Uses /api/trackfin/admin/* prefix with Bearer token authentication.
 *
 * When the Laravel backend is ready, these functions are plug-and-play.
 * Currently returns mock data from mockData.js as a development fallback.
 */

import {
  adminPlatformStats,
  adminUserGrowth,
  adminTxGrowth,
  adminTopCategories,
  adminActivityFeed,
  adminLedgerTransactions,
  usersData,
  adminInsights,
  adminHighRiskUsers,
  adminLoginAttempts,
  adminSuspiciousActivity,
  adminDeviceSessions,
  adminSystemFeatures,
  adminAnnouncementsList,
  adminReportStats,
  adminRevenueTrend,
  adminExportHistory,
} from '../data/mockData'

// ─────────────────────────────────────────────
// Axios config (ready for backend integration)
// ─────────────────────────────────────────────
const ADMIN_API_BASE =
  (import.meta.env.VITE_TRACKFIN_API_BASE || '/api/trackfin') + '/admin'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

const getAuthHeaders = () => {
  const token = localStorage.getItem('trackfin-token')
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  }
}

const adminFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${ADMIN_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return response.json()
}

// ─────────────────────────────────────────────
// Helper: simulate async API latency on mock
// ─────────────────────────────────────────────
const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms))

// ─────────────────────────────────────────────
// DASHBOARD / STATS
// ─────────────────────────────────────────────

/** GET /admin/stats — Platform KPI overview */
export const getAdminStats = () => {
  if (USE_MOCK) return mockDelay(adminPlatformStats)
  return adminFetch('/stats')
}

/** GET /admin/growth/users — Monthly user growth */
export const getUserGrowth = () => {
  if (USE_MOCK) return mockDelay(adminUserGrowth)
  return adminFetch('/growth/users')
}

/** GET /admin/growth/transactions — Monthly transaction growth */
export const getTxGrowth = () => {
  if (USE_MOCK) return mockDelay(adminTxGrowth)
  return adminFetch('/growth/transactions')
}

/** GET /admin/categories/top — Top expense categories */
export const getTopCategories = () => {
  if (USE_MOCK) return mockDelay(adminTopCategories)
  return adminFetch('/categories/top')
}

/** GET /admin/activity — System activity feed */
export const getActivityFeed = () => {
  if (USE_MOCK) return mockDelay(adminActivityFeed)
  return adminFetch('/activity')
}

// ─────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────

/** GET /admin/users?search=&role=&status=&page= — User list */
export const getUserList = (params = {}) => {
  if (USE_MOCK) return mockDelay(usersData)
  const query = new URLSearchParams(params).toString()
  return adminFetch(`/users${query ? `?${query}` : ''}`)
}

/** GET /admin/users/:id — Single user profile */
export const getUserById = (id) => {
  if (USE_MOCK) {
    const user = usersData.find((u) => u.id === id)
    return mockDelay(user || null)
  }
  return adminFetch(`/users/${id}`)
}

/** PUT /admin/users/:id/suspend — Suspend user */
export const suspendUser = (id) => {
  if (USE_MOCK) return mockDelay({ success: true })
  return adminFetch(`/users/${id}/suspend`, { method: 'PUT' })
}

/** PUT /admin/users/:id/activate — Activate user */
export const activateUser = (id) => {
  if (USE_MOCK) return mockDelay({ success: true })
  return adminFetch(`/users/${id}/activate`, { method: 'PUT' })
}

/** DELETE /admin/users/:id — Delete user */
export const deleteUser = (id) => {
  if (USE_MOCK) return mockDelay({ success: true })
  return adminFetch(`/users/${id}`, { method: 'DELETE' })
}

/** POST /admin/users/:id/reset-password — Trigger password reset */
export const resetUserPassword = (id) => {
  if (USE_MOCK) return mockDelay({ success: true })
  return adminFetch(`/users/${id}/reset-password`, { method: 'POST' })
}

// ─────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────

/** GET /admin/transactions — Global transaction ledger */
export const getAdminTransactions = (params = {}) => {
  if (USE_MOCK) return mockDelay(adminLedgerTransactions)
  const query = new URLSearchParams(params).toString()
  return adminFetch(`/transactions${query ? `?${query}` : ''}`)
}

// ─────────────────────────────────────────────
// FINANCIAL INSIGHTS
// ─────────────────────────────────────────────

/** GET /admin/insights — Aggregated financial insights */
export const getFinancialInsights = () => {
  if (USE_MOCK) return mockDelay(adminInsights)
  return adminFetch('/insights')
}

/** GET /admin/high-risk-users — Users with low health score */
export const getHighRiskUsers = () => {
  if (USE_MOCK) return mockDelay(adminHighRiskUsers)
  return adminFetch('/high-risk-users')
}

// ─────────────────────────────────────────────
// SECURITY MONITORING
// ─────────────────────────────────────────────

/** GET /admin/security/login-attempts — Failed login log */
export const getLoginAttempts = () => {
  if (USE_MOCK) return mockDelay(adminLoginAttempts)
  return adminFetch('/security/login-attempts')
}

/** GET /admin/security/suspicious-activity — Suspicious activity log */
export const getSuspiciousActivity = () => {
  if (USE_MOCK) return mockDelay(adminSuspiciousActivity)
  return adminFetch('/security/suspicious-activity')
}

/** GET /admin/security/sessions — Active device sessions */
export const getDeviceSessions = () => {
  if (USE_MOCK) return mockDelay(adminDeviceSessions)
  return adminFetch('/security/sessions')
}

/** DELETE /admin/security/sessions/:id — Revoke session/token */
export const revokeSession = (id) => {
  if (USE_MOCK) return mockDelay({ success: true })
  return adminFetch(`/security/sessions/${id}`, { method: 'DELETE' })
}

// ─────────────────────────────────────────────
// SYSTEM SETTINGS
// ─────────────────────────────────────────────

/** GET /admin/settings — Platform settings + features */
export const getSystemSettings = () => {
  if (USE_MOCK) return mockDelay(adminSystemFeatures)
  return adminFetch('/settings')
}

/** PUT /admin/settings — Update platform settings */
export const updateSystemSettings = (payload) => {
  if (USE_MOCK) return mockDelay({ success: true })
  return adminFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/** GET /admin/announcements — List announcements */
export const getAnnouncements = () => {
  if (USE_MOCK) return mockDelay(adminAnnouncementsList)
  return adminFetch('/announcements')
}

/** POST /admin/announcements — Create announcement */
export const createAnnouncement = (payload) => {
  if (USE_MOCK) return mockDelay({ ...payload, id: `ANN-${Date.now()}` })
  return adminFetch('/announcements', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ─────────────────────────────────────────────
// REPORTS & EXPORT
// ─────────────────────────────────────────────

/** GET /admin/reports/stats — Analytics summary */
export const getAdminReportStats = () => {
  if (USE_MOCK) return mockDelay({ stats: adminReportStats, revenueTrend: adminRevenueTrend, exportHistory: adminExportHistory })
  return adminFetch('/reports/stats')
}

/**
 * Client-side CSV export from mock data.
 * When backend is ready, fetch the blob from the endpoint instead.
 */
export const exportCSV = (filename, rows, columns) => {
  const header = columns.map((c) => c.label).join(',')
  const body = rows
    .map((row) => columns.map((c) => `"${row[c.key] ?? ''}"`).join(','))
    .join('\n')
  const csvContent = `${header}\n${body}`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportUsersCSV = () => {
  exportCSV(
    'trackfin_users.csv',
    usersData,
    [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'plan', label: 'Plan' },
      { key: 'joinedDate', label: 'Joined Date' },
      { key: 'lastActive', label: 'Last Active' },
    ]
  )
}

export const exportTransactionsCSV = () => {
  exportCSV(
    'trackfin_transactions.csv',
    adminLedgerTransactions,
    [
      { key: 'id', label: 'ID' },
      { key: 'date', label: 'Date' },
      { key: 'user', label: 'User' },
      { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status' },
    ]
  )
}

export const exportAnalyticsSummary = () => {
  exportCSV(
    'trackfin_analytics.csv',
    adminReportStats,
    [
      { key: 'label', label: 'Metric' },
      { key: 'value', label: 'Value' },
      { key: 'change', label: 'Change vs Last Month' },
    ]
  )
}

export const summaryStats = {
  totalBalance: 128450.55,
  totalCredit: 54200.2,
  totalDebit: 21680.4
}

export const recentTransactions = [
  {
    id: 'TXN-1032',
    date: '2026-02-05',
    description: 'Stripe payout - Invoice #2943',
    category: 'Sales',
    type: 'credit',
    amount: 4200
  },
  {
    id: 'TXN-1031',
    date: '2026-02-04',
    description: 'AWS Infrastructure',
    category: 'Operations',
    type: 'debit',
    amount: 980
  },
  {
    id: 'TXN-1029',
    date: '2026-02-03',
    description: 'Payroll - January',
    category: 'Payroll',
    type: 'debit',
    amount: 15800
  },
  {
    id: 'TXN-1028',
    date: '2026-02-03',
    description: 'Subscription Revenue',
    category: 'Sales',
    type: 'credit',
    amount: 9600
  }
]

export const monthlyChartData = [
  { month: 'Aug', credit: 12000, debit: 4200 },
  { month: 'Sep', credit: 18200, debit: 6400 },
  { month: 'Oct', credit: 16500, debit: 7200 },
  { month: 'Nov', credit: 21000, debit: 8800 },
  { month: 'Dec', credit: 19800, debit: 7600 },
  { month: 'Jan', credit: 24500, debit: 10200 },
  { month: 'Feb', credit: 22200, debit: 8400 }
]

export const transactionsData = [
  {
    id: 'TXN-1001',
    date: '2026-01-10',
    description: 'Invoice #2031 - Acme Corp',
    category: 'Sales',
    type: 'credit',
    amount: 8500
  },
  {
    id: 'TXN-1002',
    date: '2026-01-12',
    description: 'Google Workspace',
    category: 'Operations',
    type: 'debit',
    amount: 240
  },
  {
    id: 'TXN-1003',
    date: '2026-01-14',
    description: 'Stripe payout - Invoice #2018',
    category: 'Sales',
    type: 'credit',
    amount: 6200
  },
  {
    id: 'TXN-1004',
    date: '2026-01-17',
    description: 'Office rent',
    category: 'Facilities',
    type: 'debit',
    amount: 3200
  },
  {
    id: 'TXN-1005',
    date: '2026-01-20',
    description: 'Consulting - FinEdge LLC',
    category: 'Services',
    type: 'credit',
    amount: 7400
  },
  {
    id: 'TXN-1006',
    date: '2026-01-25',
    description: 'Payroll - January',
    category: 'Payroll',
    type: 'debit',
    amount: 14800
  },
  {
    id: 'TXN-1007',
    date: '2026-01-28',
    description: 'Insurance premium',
    category: 'Compliance',
    type: 'debit',
    amount: 1200
  },
  {
    id: 'TXN-1008',
    date: '2026-02-02',
    description: 'Invoice #2045 - Orbit Labs',
    category: 'Sales',
    type: 'credit',
    amount: 9900
  }
]

export const usersData = [
  {
    id: 'USR-1001',
    name: 'Avery Maxwell',
    email: 'avery@trackfin.com',
    role: 'admin',
    status: 'active',
    plan: 'Enterprise',
    lastActive: '2026-02-06'
  },
  {
    id: 'USR-1002',
    name: 'Jordan Lee',
    email: 'jordan@trackfin.com',
    role: 'user',
    status: 'active',
    plan: 'Growth',
    lastActive: '2026-02-04'
  },
  {
    id: 'USR-1003',
    name: 'Priya Sharma',
    email: 'priya@trackfin.com',
    role: 'user',
    status: 'deactivated',
    plan: 'Starter',
    lastActive: '2026-01-28'
  },
  {
    id: 'USR-1004',
    name: 'Noah Kim',
    email: 'noah@trackfin.com',
    role: 'user',
    status: 'active',
    plan: 'Growth',
    lastActive: '2026-02-05'
  }
]

export const adminOverviewStats = [
  {
    label: 'Total Users',
    value: '1,248',
    change: '+12.4%'
  },
  {
    label: 'Total Transactions',
    value: '18,402',
    change: '+8.2%'
  },
  {
    label: 'System Revenue',
    value: '$486,920',
    change: '+14.9%'
  },
  {
    label: 'Churn Rate',
    value: '2.1%',
    change: '-0.3%'
  }
]

export const adminChartData = [
  { month: 'Aug', revenue: 52000, users: 180 },
  { month: 'Sep', revenue: 61000, users: 220 },
  { month: 'Oct', revenue: 59000, users: 260 },
  { month: 'Nov', revenue: 71000, users: 310 },
  { month: 'Dec', revenue: 77000, users: 340 },
  { month: 'Jan', revenue: 86000, users: 380 },
  { month: 'Feb', revenue: 74000, users: 360 }
]

export const reportsSummary = [
  {
    title: 'Operating Margin',
    value: '24.6%',
    trend: '+1.4%'
  },
  {
    title: 'Net Cash Flow',
    value: '$84,300',
    trend: '+9.1%'
  },
  {
    title: 'Expenses Ratio',
    value: '42%',
    trend: '-2.3%'
  }
]

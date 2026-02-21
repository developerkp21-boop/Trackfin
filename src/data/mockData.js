// ─────────────────────────────────────────────
// SUMMARY STATS
// ─────────────────────────────────────────────
export const summaryStats = {
  totalBalance: 128450.55,
  totalCredit: 54200.2,
  totalDebit: 21680.4
}

// ─────────────────────────────────────────────
// MONTHLY CHART DATA
// ─────────────────────────────────────────────
export const monthlyChartData = [
  { month: 'Aug', credit: 12000, debit: 4200 },
  { month: 'Sep', credit: 18200, debit: 6400 },
  { month: 'Oct', credit: 16500, debit: 7200 },
  { month: 'Nov', credit: 21000, debit: 8800 },
  { month: 'Dec', credit: 19800, debit: 7600 },
  { month: 'Jan', credit: 24500, debit: 10200 },
  { month: 'Feb', credit: 22200, debit: 8400 }
]

// ─────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────
export const transactionsData = [
  {
    id: 'TXN-1001',
    date: '2026-01-10',
    description: 'Invoice #2031 - Acme Corp',
    category: 'Sales',
    type: 'credit',
    amount: 8500,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1002',
    date: '2026-01-12',
    description: 'Google Workspace Subscription',
    category: 'Operations',
    type: 'debit',
    amount: 240,
    paymentMethod: 'Card',
    account: 'Business Credit Card'
  },
  {
    id: 'TXN-1003',
    date: '2026-01-14',
    description: 'Stripe payout - Invoice #2018',
    category: 'Sales',
    type: 'credit',
    amount: 6200,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1004',
    date: '2026-01-17',
    description: 'Office rent - January',
    category: 'Facilities',
    type: 'debit',
    amount: 3200,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1005',
    date: '2026-01-20',
    description: 'Consulting - FinEdge LLC',
    category: 'Services',
    type: 'credit',
    amount: 7400,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1006',
    date: '2026-01-25',
    description: 'Payroll - January',
    category: 'Payroll',
    type: 'debit',
    amount: 14800,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1007',
    date: '2026-01-28',
    description: 'Insurance premium',
    category: 'Compliance',
    type: 'debit',
    amount: 1200,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1008',
    date: '2026-02-02',
    description: 'Invoice #2045 - Orbit Labs',
    category: 'Sales',
    type: 'credit',
    amount: 9900,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  },
  {
    id: 'TXN-1009',
    date: '2026-02-05',
    description: 'AWS Infrastructure',
    category: 'Operations',
    type: 'debit',
    amount: 980,
    paymentMethod: 'Card',
    account: 'Business Credit Card'
  },
  {
    id: 'TXN-1010',
    date: '2026-02-08',
    description: 'Freelance - Design Project',
    category: 'Services',
    type: 'credit',
    amount: 3800,
    paymentMethod: 'UPI',
    account: 'Cash Wallet'
  },
  {
    id: 'TXN-1011',
    date: '2026-02-10',
    description: 'Marketing - Facebook Ads',
    category: 'Marketing',
    type: 'debit',
    amount: 1600,
    paymentMethod: 'Card',
    account: 'Business Credit Card'
  },
  {
    id: 'TXN-1012',
    date: '2026-02-14',
    description: 'Client Retainer - NovaSoft',
    category: 'Sales',
    type: 'credit',
    amount: 5500,
    paymentMethod: 'Bank',
    account: 'Main Bank'
  }
]

export const recentTransactions = transactionsData.slice(-4).reverse()

// ─────────────────────────────────────────────
// UPCOMING BILLS
// ─────────────────────────────────────────────
export const upcomingBills = [
  { id: 'BILL-1', name: 'Office Rent', amount: 3200, dueDate: '2026-03-01', category: 'Facilities', status: 'upcoming' },
  { id: 'BILL-2', name: 'AWS Server', amount: 980, dueDate: '2026-03-05', category: 'Operations', status: 'upcoming' },
  { id: 'BILL-3', name: 'Insurance Premium', amount: 1200, dueDate: '2026-03-10', category: 'Compliance', status: 'upcoming' },
  { id: 'BILL-4', name: 'Google Workspace', amount: 240, dueDate: '2026-03-12', category: 'Operations', status: 'upcoming' },
  { id: 'BILL-5', name: 'Payroll', amount: 14800, dueDate: '2026-03-25', category: 'Payroll', status: 'upcoming' }
]

// ─────────────────────────────────────────────
// ACCOUNTS
// ─────────────────────────────────────────────
export const accountsData = [
  { id: 'ACC-1001', name: 'Main Bank Account', type: 'Bank', balance: 58200, color: '#60a5fa' },
  { id: 'ACC-1002', name: 'Cash Wallet', type: 'Cash', balance: 4600, color: '#80c570' },
  { id: 'ACC-1003', name: 'Business Credit Card', type: 'Card', balance: 12900, color: '#e77a8c' },
  { id: 'ACC-1004', name: 'Savings Account', type: 'Savings', balance: 52750, color: '#e8b25e' }
]

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
export const categoriesData = [
  { id: 'CAT-1', name: 'Sales', type: 'income', color: '#80c570', icon: 'TrendingUp', budget: 40000 },
  { id: 'CAT-2', name: 'Services', type: 'income', color: '#60a5fa', icon: 'Briefcase', budget: 20000 },
  { id: 'CAT-3', name: 'Freelance', type: 'income', color: '#a78bfa', icon: 'Laptop', budget: 10000 },
  { id: 'CAT-4', name: 'Operations', type: 'expense', color: '#e77a8c', icon: 'Settings', budget: 5000 },
  { id: 'CAT-5', name: 'Payroll', type: 'expense', color: '#f97316', icon: 'Users', budget: 18000 },
  { id: 'CAT-6', name: 'Marketing', type: 'expense', color: '#e8b25e', icon: 'Megaphone', budget: 3000 },
  { id: 'CAT-7', name: 'Facilities', type: 'expense', color: '#64748b', icon: 'Building', budget: 4000 },
  { id: 'CAT-8', name: 'Compliance', type: 'expense', color: '#0ea5e9', icon: 'Shield', budget: 2000 }
]

// ─────────────────────────────────────────────
// BUDGET
// ─────────────────────────────────────────────
export const budgetGoalsData = {
  monthlyBudget: 30000,
  spent: 21940,
  alerts: [
    { id: 'ALT-1', level: 'info', message: 'Marketing budget is currently at 72% utilization.' },
    { id: 'ALT-2', level: 'warning', message: 'Operations expenses crossed 85% of allocated monthly limit.' }
  ]
}

export const categoryBudgets = [
  { id: 'CB-1', category: 'Operations', budget: 5000, spent: 4250, color: '#e77a8c' },
  { id: 'CB-2', category: 'Payroll', budget: 18000, spent: 14800, color: '#f97316' },
  { id: 'CB-3', category: 'Marketing', budget: 3000, spent: 1600, color: '#e8b25e' },
  { id: 'CB-4', category: 'Facilities', budget: 4000, spent: 3200, color: '#64748b' },
  { id: 'CB-5', category: 'Compliance', budget: 2000, spent: 1200, color: '#0ea5e9' }
]

// ─────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────
export const goalsData = [
  {
    id: 'GOAL-1',
    name: 'Emergency Fund',
    targetAmount: 50000,
    savedAmount: 32500,
    deadline: '2026-12-31',
    color: '#80c570',
    icon: 'Shield',
    description: 'Build a 6-month emergency cushion'
  },
  {
    id: 'GOAL-2',
    name: 'Office Equipment',
    targetAmount: 15000,
    savedAmount: 8200,
    deadline: '2026-06-30',
    color: '#60a5fa',
    icon: 'Monitor',
    description: 'New workstations and setup upgrade'
  },
  {
    id: 'GOAL-3',
    name: 'Business Expansion',
    targetAmount: 100000,
    savedAmount: 22000,
    deadline: '2027-03-31',
    color: '#a78bfa',
    icon: 'TrendingUp',
    description: 'Capital for opening second office'
  },
  {
    id: 'GOAL-4',
    name: 'Tax Reserve',
    targetAmount: 20000,
    savedAmount: 18500,
    deadline: '2026-03-31',
    color: '#e8b25e',
    icon: 'Receipt',
    description: 'Q1 advance tax payment preparation'
  }
]

// ─────────────────────────────────────────────
// NET WORTH
// ─────────────────────────────────────────────
export const assetsData = [
  { id: 'ASS-1', name: 'Main Bank Account', category: 'liquid', value: 58200 },
  { id: 'ASS-2', name: 'Savings Account', category: 'liquid', value: 52750 },
  { id: 'ASS-3', name: 'Cash Wallet', category: 'liquid', value: 4600 },
  { id: 'ASS-4', name: 'Office Equipment', category: 'fixed', value: 28000 },
  { id: 'ASS-5', name: 'Vehicle', category: 'fixed', value: 45000 },
  { id: 'ASS-6', name: 'Mutual Funds', category: 'investment', value: 38400 },
  { id: 'ASS-7', name: 'Fixed Deposit', category: 'investment', value: 25000 }
]

export const liabilitiesData = [
  { id: 'LIA-1', name: 'Business Credit Card', category: 'credit', value: 12900 },
  { id: 'LIA-2', name: 'Vehicle Loan', category: 'loan', value: 22000 },
  { id: 'LIA-3', name: 'Equipment Lease', category: 'loan', value: 8500 }
]

export const netWorthHistory = [
  { month: 'Aug', netWorth: 178000 },
  { month: 'Sep', netWorth: 184500 },
  { month: 'Oct', netWorth: 190200 },
  { month: 'Nov', netWorth: 198000 },
  { month: 'Dec', netWorth: 204300 },
  { month: 'Jan', netWorth: 212500 },
  { month: 'Feb', netWorth: 208550 }
]

// ─────────────────────────────────────────────
// FINANCIAL HEALTH SCORE
// ─────────────────────────────────────────────
export const healthScoreData = {
  score: 74,
  status: 'Good',
  statusColor: '#80c570',
  breakdown: [
    { label: 'Savings Rate', score: 82, weight: 25, tip: 'You save 28% of income — excellent habit.', color: '#80c570' },
    { label: 'Budget Adherence', score: 68, weight: 25, tip: 'Slightly over budget in Operations. Review spending.', color: '#e8b25e' },
    { label: 'Debt-to-Asset Ratio', score: 79, weight: 20, tip: 'Liabilities are 19% of total assets — healthy range.', color: '#60a5fa' },
    { label: 'Goal Progress', score: 65, weight: 20, tip: '3 of 4 goals on track. Business Expansion needs attention.', color: '#a78bfa' },
    { label: 'Expense Diversity', score: 72, weight: 10, tip: 'Good spending diversity across categories.', color: '#0ea5e9' }
  ],
  history: [
    { month: 'Aug', score: 62 },
    { month: 'Sep', score: 65 },
    { month: 'Oct', score: 68 },
    { month: 'Nov', score: 71 },
    { month: 'Dec', score: 70 },
    { month: 'Jan', score: 73 },
    { month: 'Feb', score: 74 }
  ]
}

// ─────────────────────────────────────────────
// SMART INSIGHTS
// ─────────────────────────────────────────────
export const insightsData = {
  spendingAlerts: [
    {
      id: 'INS-1',
      level: 'danger',
      title: 'Operations Over Budget',
      message: 'Operations spending is at 85% of monthly budget with 10 days remaining.',
      amount: 4250,
      budget: 5000,
      icon: 'AlertTriangle'
    },
    {
      id: 'INS-2',
      level: 'warning',
      title: 'Marketing Spike Detected',
      message: 'Marketing spend increased 42% compared to last month average.',
      amount: 1600,
      icon: 'TrendingUp'
    },
    {
      id: 'INS-3',
      level: 'info',
      title: 'Payroll is Stable',
      message: 'Payroll costs remained consistent within ±3% over the last 3 months.',
      icon: 'CheckCircle'
    }
  ],
  savingsSuggestions: [
    {
      id: 'SUG-1',
      title: 'Switch to Annual Subscription',
      description: 'Google Workspace monthly plan costs 20% more than annual. Savings: ~$580/yr.',
      saving: 580,
      icon: 'RefreshCw'
    },
    {
      id: 'SUG-2',
      title: 'Consolidate Cloud Services',
      description: 'Combining AWS + GCP redundancies could cut infra costs by 15%.',
      saving: 1764,
      icon: 'Cloud'
    },
    {
      id: 'SUG-3',
      title: 'Automate Ad Bidding',
      description: 'Switching to smart bidding for Facebook Ads can improve ROI by 25%.',
      saving: 400,
      icon: 'Zap'
    }
  ],
  optimizationTips: [
    {
      id: 'TIP-1',
      title: 'Set Up Auto-Transfer to Savings',
      description: 'Automate 20% of monthly income to your savings account on every payday.',
      category: 'Savings',
      priority: 'high'
    },
    {
      id: 'TIP-2',
      title: 'Review Recurring Subscriptions',
      description: 'You have 4 active recurring expenses. Review quarterly to eliminate unused services.',
      category: 'Expense',
      priority: 'medium'
    },
    {
      id: 'TIP-3',
      title: 'Diversify Income Sources',
      description: '78% of income comes from Sales. Adding a passive income stream reduces risk.',
      category: 'Income',
      priority: 'medium'
    },
    {
      id: 'TIP-4',
      title: 'Build Your Emergency Fund Faster',
      description: 'At the current rate, Emergency Fund goal will be complete in 5 months. Adding $500/month cuts it to 3.',
      category: 'Goals',
      priority: 'low'
    }
  ]
}

// ─────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────
export const reportsSummary = [
  { title: 'Operating Margin', value: '24.6%', trend: '+1.4%' },
  { title: 'Net Cash Flow', value: '$84,300', trend: '+9.1%' },
  { title: 'Expenses Ratio', value: '42%', trend: '-2.3%' }
]

export const yearlyChartData = [
  { month: 'Mar 25', credit: 38000, debit: 18000 },
  { month: 'Apr 25', credit: 42000, debit: 20000 },
  { month: 'May 25', credit: 45000, debit: 21000 },
  { month: 'Jun 25', credit: 50000, debit: 23000 },
  { month: 'Jul 25', credit: 48000, debit: 22000 },
  { month: 'Aug 25', credit: 55000, debit: 24000 },
  { month: 'Sep 25', credit: 58000, debit: 26000 },
  { month: 'Oct 25', credit: 61000, debit: 27000 },
  { month: 'Nov 25', credit: 65000, debit: 29000 },
  { month: 'Dec 25', credit: 68000, debit: 31000 },
  { month: 'Jan 26', credit: 72000, debit: 33000 },
  { month: 'Feb 26', credit: 69000, debit: 30000 }
]

// ─────────────────────────────────────────────
// ADMIN DATA
// ─────────────────────────────────────────────
export const usersData = [
  { id: 'USR-1001', name: 'Avery Maxwell', email: 'avery@trackfin.com', role: 'admin', status: 'active', plan: 'Enterprise', joinedDate: '2024-11-02', lastActive: '2026-02-06' },
  { id: 'USR-1002', name: 'Jordan Lee', email: 'jordan@trackfin.com', role: 'user', status: 'active', plan: 'Growth', joinedDate: '2025-02-14', lastActive: '2026-02-04' },
  { id: 'USR-1003', name: 'Priya Sharma', email: 'priya@trackfin.com', role: 'user', status: 'deactivated', plan: 'Starter', joinedDate: '2025-06-09', lastActive: '2026-01-28' },
  { id: 'USR-1004', name: 'Noah Kim', email: 'noah@trackfin.com', role: 'user', status: 'active', plan: 'Growth', joinedDate: '2025-09-19', lastActive: '2026-02-05' },
  { id: 'USR-1005', name: 'Elena Cruz', email: 'elena@trackfin.com', role: 'user', status: 'active', plan: 'Starter', joinedDate: '2025-12-03', lastActive: '2026-02-07' }
]

export const adminLedgerTransactions = [
  { id: 'LED-8001', date: '2026-02-07', user: 'Avery Maxwell', category: 'Sales', amount: 11200, type: 'income', status: 'posted' },
  { id: 'LED-8002', date: '2026-02-06', user: 'Jordan Lee', category: 'Operations', amount: 640, type: 'expense', status: 'pending' },
  { id: 'LED-8003', date: '2026-02-06', user: 'Noah Kim', category: 'Payroll', amount: 9400, type: 'expense', status: 'posted' },
  { id: 'LED-8004', date: '2026-02-05', user: 'Elena Cruz', category: 'Services', amount: 3800, type: 'income', status: 'posted' },
  { id: 'LED-8005', date: '2026-02-04', user: 'Priya Sharma', category: 'Compliance', amount: 1150, type: 'expense', status: 'failed' },
  { id: 'LED-8006', date: '2026-02-03', user: 'Avery Maxwell', category: 'Facilities', amount: 2400, type: 'expense', status: 'posted' },
  { id: 'LED-8007', date: '2026-02-02', user: 'Jordan Lee', category: 'Sales', amount: 9100, type: 'income', status: 'posted' },
  { id: 'LED-8008', date: '2026-02-01', user: 'Noah Kim', category: 'Sales', amount: 7600, type: 'income', status: 'pending' }
]

export const adminUserActivity = [
  { id: 'ACT-1', user: 'Avery Maxwell', action: 'Updated security policy', time: '2 min ago', level: 'info' },
  { id: 'ACT-2', user: 'Jordan Lee', action: 'Submitted expense entry', time: '18 min ago', level: 'success' },
  { id: 'ACT-3', user: 'Priya Sharma', action: 'Failed transaction review', time: '42 min ago', level: 'warning' },
  { id: 'ACT-4', user: 'Elena Cruz', action: 'Created monthly report note', time: '1 hr ago', level: 'info' }
]

export const adminOverviewStats = [
  { label: 'Total Users', value: '1,248', change: '+12.4%' },
  { label: 'Total Transactions', value: '18,402', change: '+8.2%' },
  { label: 'System Revenue', value: '$486,920', change: '+14.9%' },
  { label: 'Churn Rate', value: '2.1%', change: '-0.3%' }
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

// ─────────────────────────────────────────────
// ADMIN – PLATFORM KPI STATS (6 cards)
// ─────────────────────────────────────────────
export const adminPlatformStats = {
  totalUsers: 1248,
  activeUsers: 893,
  totalTransactions: 18402,
  systemBalance: 2841640,
  totalGoals: 3124,
  totalBudgets: 2876
}

// ─────────────────────────────────────────────
// ADMIN – USER GROWTH (per month)
// ─────────────────────────────────────────────
export const adminUserGrowth = [
  { month: 'Aug', users: 780 },
  { month: 'Sep', users: 860 },
  { month: 'Oct', users: 940 },
  { month: 'Nov', users: 1020 },
  { month: 'Dec', users: 1080 },
  { month: 'Jan', users: 1160 },
  { month: 'Feb', users: 1248 }
]

// ─────────────────────────────────────────────
// ADMIN – TRANSACTION GROWTH (per month)
// ─────────────────────────────────────────────
export const adminTxGrowth = [
  { month: 'Aug', transactions: 9200 },
  { month: 'Sep', transactions: 11400 },
  { month: 'Oct', transactions: 12800 },
  { month: 'Nov', transactions: 14100 },
  { month: 'Dec', transactions: 15500 },
  { month: 'Jan', transactions: 17200 },
  { month: 'Feb', transactions: 18402 }
]

// ─────────────────────────────────────────────
// ADMIN – TOP EXPENSE CATEGORIES (aggregated)
// ─────────────────────────────────────────────
export const adminTopCategories = [
  { category: 'Housing', amount: 342800, color: '#60a5fa' },
  { category: 'Food & Dining', amount: 218400, color: '#80c570' },
  { category: 'Transport', amount: 156200, color: '#e8b25e' },
  { category: 'Healthcare', amount: 98600, color: '#a78bfa' },
  { category: 'Entertainment', amount: 87400, color: '#e77a8c' },
  { category: 'Utilities', amount: 74200, color: '#0ea5e9' },
  { category: 'Education', amount: 61800, color: '#f97316' }
]

// ─────────────────────────────────────────────
// ADMIN – SYSTEM ACTIVITY FEED
// ─────────────────────────────────────────────
export const adminActivityFeed = [
  { id: 'FEED-1', user: 'Avery Maxwell', action: 'Updated system security policy', time: '2 min ago', level: 'warning' },
  { id: 'FEED-2', user: 'Jordan Lee', action: 'Submitted 3 new expense entries', time: '18 min ago', level: 'success' },
  { id: 'FEED-3', user: 'Elena Cruz', action: 'Created a new budget', time: '34 min ago', level: 'info' },
  { id: 'FEED-4', user: 'Noah Kim', action: 'Reached Emergency Fund goal', time: '1 hr ago', level: 'success' },
  { id: 'FEED-5', user: 'Priya Sharma', action: 'Failed login attempt (3x)', time: '2 hr ago', level: 'danger' },
  { id: 'FEED-6', user: 'Marcus Chen', action: 'Password reset requested', time: '3 hr ago', level: 'warning' },
  { id: 'FEED-7', user: 'Sofia Ruiz', action: 'Exported transaction report', time: '4 hr ago', level: 'info' },
  { id: 'FEED-8', user: 'Liam Nguyen', action: 'Account deactivated by admin', time: '5 hr ago', level: 'danger' }
]

// ─────────────────────────────────────────────
// ADMIN – FINANCIAL INSIGHTS
// ─────────────────────────────────────────────
export const adminInsights = {
  avgSavingsRate: 28.4,
  avgDebtRatio: 19.2,
  mostUsedAccountType: 'Bank',
  mostCommonCategory: 'Food & Dining',
  accountTypeDistribution: [
    { name: 'Bank', value: 42, color: '#60a5fa' },
    { name: 'Savings', value: 28, color: '#80c570' },
    { name: 'Credit Card', value: 18, color: '#e77a8c' },
    { name: 'Cash', value: 12, color: '#e8b25e' }
  ],
  savingsRateBySegment: [
    { segment: '18–25', rate: 12.4 },
    { segment: '26–35', rate: 24.8 },
    { segment: '36–45', rate: 32.1 },
    { segment: '46–55', rate: 28.7 },
    { segment: '55+', rate: 22.3 }
  ]
}

export const adminHighRiskUsers = [
  { id: 'USR-2014', name: 'Liam Nguyen', email: 'liam@trackfin.com', healthScore: 28, debtRatio: 71, status: 'active', risk: 'critical' },
  { id: 'USR-2031', name: 'Priya Sharma', email: 'priya@trackfin.com', healthScore: 34, debtRatio: 63, status: 'deactivated', risk: 'high' },
  { id: 'USR-2055', name: 'Marcus Chen', email: 'marcus@trackfin.com', healthScore: 41, debtRatio: 58, status: 'active', risk: 'high' },
  { id: 'USR-2068', name: 'Sofia Ruiz', email: 'sofia@trackfin.com', healthScore: 48, debtRatio: 49, status: 'active', risk: 'medium' },
  { id: 'USR-2074', name: 'Carter Bloom', email: 'carter@trackfin.com', healthScore: 52, debtRatio: 44, status: 'active', risk: 'medium' }
]

// ─────────────────────────────────────────────
// ADMIN – SECURITY MONITORING
// ─────────────────────────────────────────────
export const adminLoginAttempts = [
  { id: 'LOG-1', user: 'priya@trackfin.com', ip: '192.168.1.44', attempts: 5, lastAttempt: '2026-02-21 11:42:18', status: 'blocked' },
  { id: 'LOG-2', user: 'unknown@evil.com', ip: '45.33.32.156', attempts: 12, lastAttempt: '2026-02-21 10:15:09', status: 'blocked' },
  { id: 'LOG-3', user: 'carter@trackfin.com', ip: '192.168.1.108', attempts: 3, lastAttempt: '2026-02-21 09:08:44', status: 'warned' },
  { id: 'LOG-4', user: 'test@trackfin.com', ip: '10.0.0.22', attempts: 2, lastAttempt: '2026-02-20 22:31:10', status: 'warned' },
  { id: 'LOG-5', user: 'admin@trackfin.com', ip: '203.0.113.50', attempts: 7, lastAttempt: '2026-02-20 18:55:02', status: 'blocked' }
]

export const adminSuspiciousActivity = [
  { id: 'SUS-1', user: 'Liam Nguyen', action: 'Bulk export of all transactions', severity: 'high', timestamp: '2026-02-21 11:02:34', ip: '45.33.32.156' },
  { id: 'SUS-2', user: 'Priya Sharma', action: 'Login from new country (RU)', severity: 'high', timestamp: '2026-02-21 09:48:21', ip: '91.108.4.207' },
  { id: 'SUS-3', user: 'Marcus Chen', action: 'Edited 14 transactions in 2 minutes', severity: 'medium', timestamp: '2026-02-20 17:22:09', ip: '192.168.0.56' },
  { id: 'SUS-4', user: 'Carter Bloom', action: 'Multiple failed OTP attempts', severity: 'medium', timestamp: '2026-02-20 14:10:55', ip: '10.0.0.77' },
  { id: 'SUS-5', user: 'Sofia Ruiz', action: 'API key regenerated 3x today', severity: 'low', timestamp: '2026-02-20 11:34:18', ip: '172.16.0.12' }
]

export const adminDeviceSessions = [
  { id: 'SES-1', user: 'Avery Maxwell', device: 'Chrome / macOS', ip: '192.168.1.2', location: 'Mumbai, IN', lastSeen: '2 min ago', current: true },
  { id: 'SES-2', user: 'Jordan Lee', device: 'Safari / iOS', ip: '10.0.1.44', location: 'Bangalore, IN', lastSeen: '22 min ago', current: false },
  { id: 'SES-3', user: 'Noah Kim', device: 'Firefox / Windows', ip: '192.168.0.98', location: 'Delhi, IN', lastSeen: '1 hr ago', current: false },
  { id: 'SES-4', user: 'Liam Nguyen', device: 'Chrome / Android', ip: '45.33.32.156', location: 'Moscow, RU', lastSeen: '2 hr ago', current: false },
  { id: 'SES-5', user: 'Elena Cruz', device: 'Edge / Windows', ip: '172.16.0.20', location: 'Pune, IN', lastSeen: '3 hr ago', current: false },
  { id: 'SES-6', user: 'Marcus Chen', device: 'Chrome / Linux', ip: '192.168.0.56', location: 'Chennai, IN', lastSeen: '5 hr ago', current: false }
]

// ─────────────────────────────────────────────
// ADMIN – SYSTEM SETTINGS
// ─────────────────────────────────────────────
export const adminSystemFeatures = [
  { id: 'FEAT-1', key: 'smart_insights', label: 'Smart Insights', description: 'AI-powered spending recommendations for users.', enabled: true },
  { id: 'FEAT-2', key: 'budget_alerts', label: 'Budget Alerts', description: 'Push and email alerts when users exceed budgets.', enabled: true },
  { id: 'FEAT-3', key: 'net_worth_tracker', label: 'Net Worth Tracker', description: 'Asset and liability tracking module.', enabled: true },
  { id: 'FEAT-4', key: 'health_score', label: 'Financial Health Score', description: 'Composite score based on savings, debt, goals.', enabled: false },
  { id: 'FEAT-5', key: 'export_reports', label: 'Export Reports', description: 'Allow users to export CSV/PDF reports.', enabled: true },
  { id: 'FEAT-6', key: 'two_factor_auth', label: 'Two-Factor Authentication', description: 'Optional 2FA via email or authenticator app.', enabled: false }
]

export const adminAnnouncementsList = [
  { id: 'ANN-1', title: 'Scheduled Maintenance – Feb 25', message: 'The platform will be in maintenance mode from 02:00–04:00 UTC on Feb 25.', type: 'warning', createdAt: '2026-02-18', active: true },
  { id: 'ANN-2', title: 'New Feature: Health Score v2', message: 'We have upgraded the Financial Health Score engine with better precision.', type: 'info', createdAt: '2026-02-10', active: true },
  { id: 'ANN-3', title: 'Tax Season Resources Available', message: 'Tax preparation guides and export templates are now available in Reports.', type: 'success', createdAt: '2026-02-01', active: false }
]

// ─────────────────────────────────────────────
// ADMIN – REPORTS
// ─────────────────────────────────────────────
export const adminReportStats = [
  { label: 'Total Revenue', value: '$2,841,640', change: '+14.9%', positive: true },
  { label: 'Total Users', value: '1,248', change: '+12.4%', positive: true },
  { label: 'Active User Rate', value: '71.6%', change: '+2.1%', positive: true },
  { label: 'Transaction Count', value: '18,402', change: '+8.2%', positive: true }
]

export const adminRevenueTrend = [
  { month: 'Aug', revenue: 187000 },
  { month: 'Sep', revenue: 214000 },
  { month: 'Oct', revenue: 228000 },
  { month: 'Nov', revenue: 251000 },
  { month: 'Dec', revenue: 272000 },
  { month: 'Jan', revenue: 298000 },
  { month: 'Feb', revenue: 274000 }
]

export const adminExportHistory = [
  { id: 'EXP-1', type: 'Users CSV', requestedBy: 'Avery Maxwell', size: '24 KB', createdAt: '2026-02-20 14:32', status: 'completed' },
  { id: 'EXP-2', type: 'Transactions CSV', requestedBy: 'Avery Maxwell', size: '148 KB', createdAt: '2026-02-18 09:15', status: 'completed' },
  { id: 'EXP-3', type: 'Analytics Summary', requestedBy: 'Avery Maxwell', size: '8 KB', createdAt: '2026-02-15 16:45', status: 'completed' },
  { id: 'EXP-4', type: 'Transactions CSV', requestedBy: 'Jordan Lee', size: '76 KB', createdAt: '2026-02-12 11:20', status: 'completed' }
]

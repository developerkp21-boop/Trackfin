import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  BarChart3,
  Target,
  UserCircle,
  Shield,
  Users,
  Settings,
  Tag,
  Trophy,
  Scale,
  HeartPulse,
  Lightbulb,
  TrendingUp,
  Lock,
  FileText
} from 'lucide-react'

export const userNavItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: ReceiptText },
  { label: 'Accounts', path: '/accounts', icon: Wallet },
  { label: 'Categories', path: '/categories', icon: Tag },
  { label: 'Budget & Goals', path: '/budget', icon: Target },
  { label: 'Goals', path: '/goals', icon: Trophy },
  { label: 'Net Worth', path: '/net-worth', icon: Scale },
  { label: 'Health Score', path: '/health', icon: HeartPulse },
  { label: 'Smart Insights', path: '/insights', icon: Lightbulb },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Profile', path: '/profile', icon: UserCircle }
]

export const adminNavItems = [
  { label: 'Dashboard', path: '/admin', icon: Shield },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Transactions', path: '/admin/transactions', icon: ReceiptText },
  { label: 'Financial Insights', path: '/admin/insights', icon: TrendingUp },
  { label: 'Security', path: '/admin/security', icon: Lock },
  { label: 'System Settings', path: '/admin/settings', icon: Settings },
  { label: 'Reports & Export', path: '/admin/reports', icon: FileText }
]

export const adminNavGroups = [
  {
    label: 'Overview',
    items: adminNavItems.slice(0, 1)
  },
  {
    label: 'Users',
    items: adminNavItems.slice(1, 2)
  },
  {
    label: 'Finance',
    items: adminNavItems.slice(2, 4)
  },
  {
    label: 'Security',
    items: adminNavItems.slice(4, 5)
  },
  {
    label: 'Platform',
    items: adminNavItems.slice(5, 7)
  }
]

import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PieChart,
  UserCircle,
  Shield,
  Users,
  Settings,
  FileText,
} from "lucide-react";

export const userNavItems = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Add Transaction",
    path: "/transactions/add",
    icon: PlusCircle,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ReceiptText,
  },
  {
    label: "Monthly Report",
    path: "/reports/monthly",
    icon: PieChart,
  },
  {
    label: "Yearly Report",
    path: "/reports/yearly",
    icon: FileText,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

export const adminNavItems = [
  {
    label: "Admin Overview",
    path: "/admin",
    icon: Shield,
  },
  {
    label: "Manage Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "All Transactions",
    path: "/admin/transactions",
    icon: ReceiptText,
  },
  {
    label: "System Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

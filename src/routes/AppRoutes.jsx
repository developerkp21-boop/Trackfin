import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import UserRoute from './UserRoute'
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthPage from '../pages/auth/AuthPage'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import Overview from '../pages/dashboard/Overview'
import TransactionList from '../pages/transactions/TransactionList'
import Accounts from '../pages/accounts/Accounts'
import Categories from '../pages/categories/Categories'
import BudgetGoals from '../pages/budget/BudgetGoals'
import Goals from '../pages/goals/Goals'
import NetWorth from '../pages/networth/NetWorth'
import HealthScore from '../pages/health/HealthScore'
import Insights from '../pages/insights/Insights'
import Reports from '../pages/reports/Reports'
import MonthlyReport from '../pages/reports/MonthlyReport'
import YearlyReport from '../pages/reports/YearlyReport'
import Profile from '../pages/profile/Profile'
import AdminOverview from '../pages/admin/AdminOverview'
import ManageUsers from '../pages/admin/ManageUsers'
import UserDetails from '../pages/admin/UserDetails'
import AdminTransactions from '../pages/admin/AdminTransactions'
import SystemSettings from '../pages/admin/SystemSettings'
import NotFound from '../pages/NotFound'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth" replace />} />

    <Route path="/auth" element={<AuthPage />} />
    <Route path="/login" element={<Navigate to="/auth?tab=signin" replace />} />
    <Route path="/register" element={<Navigate to="/auth?tab=signup" replace />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    <Route
      element={
        <ProtectedRoute>
          <UserRoute>
            <UserLayout />
          </UserRoute>
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Overview />} />
      <Route path="/transactions" element={<TransactionList />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/budget" element={<BudgetGoals />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/net-worth" element={<NetWorth />} />
      <Route path="/health" element={<HealthScore />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/monthly" element={<MonthlyReport />} />
      <Route path="/reports/yearly" element={<YearlyReport />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    <Route
      path="/admin"
      element={
        //<ProtectedRoute>
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        //</ProtectedRoute>
      }
    >
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="users/:id" element={<UserDetails />} />
      <Route path="transactions" element={<AdminTransactions />} />
      <Route path="settings" element={<SystemSettings />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRoutes

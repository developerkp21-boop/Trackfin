import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Overview from "../pages/dashboard/Overview";
import AddTransaction from "../pages/transactions/AddTransaction";
import TransactionList from "../pages/transactions/TransactionList";
import MonthlyReport from "../pages/reports/MonthlyReport";
import YearlyReport from "../pages/reports/YearlyReport";
import Profile from "../pages/profile/Profile";
import AdminOverview from "../pages/admin/AdminOverview";
import ManageUsers from "../pages/admin/ManageUsers";
import UserDetails from "../pages/admin/UserDetails";
import AdminTransactions from "../pages/admin/AdminTransactions";
import SystemSettings from "../pages/admin/SystemSettings";
import NotFound from "../pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Overview />} />
      <Route path="transactions" element={<TransactionList />} />
      <Route path="transactions/add" element={<AddTransaction />} />
      <Route path="reports/monthly" element={<MonthlyReport />} />
      <Route path="reports/yearly" element={<YearlyReport />} />
      <Route path="profile" element={<Profile />} />

      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
        }
      />
      <Route
        path="admin/users"
        element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        }
      />
      <Route
        path="admin/users/:id"
        element={
          <AdminRoute>
            <UserDetails />
          </AdminRoute>
        }
      />
      <Route
        path="admin/transactions"
        element={
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        }
      />
      <Route
        path="admin/settings"
        element={
          <AdminRoute>
            <SystemSettings />
          </AdminRoute>
        }
      />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

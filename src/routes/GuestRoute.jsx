import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingSpinner label="Checking session" />;
  }

  if (isAuthenticated) {
    const role = user?.role || "user";
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

export default GuestRoute;

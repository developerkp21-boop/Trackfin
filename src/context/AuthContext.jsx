import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiRequest } from "../services/api";
import { ENABLE_AUTH_GUARD } from "../config/featureFlags";

const AuthContext = createContext(null);
const ENABLE_DEMO_AUTH = import.meta.env.VITE_ENABLE_DEMO_AUTH === "true";
const AUTH_API_BASE = (
  import.meta.env.VITE_AUTH_API_BASE || "/api/trackfin/auth"
).replace(/\/$/, "");
const TRACKFIN_API_BASE = (
  import.meta.env.VITE_TRACKFIN_API_BASE ||
  AUTH_API_BASE.replace(/\/auth$/, "")
).replace(/\/$/, "");
const AUTH_LOGIN_ENDPOINT = `${AUTH_API_BASE}/login`;
const AUTH_REGISTER_ENDPOINT = `${AUTH_API_BASE}/register`;
const AUTH_LOGOUT_ENDPOINT = `${AUTH_API_BASE}/logout`;
const AUTH_ME_ENDPOINT = `${AUTH_API_BASE}/me`;
const ADMIN_DASHBOARD_ENDPOINT = `${TRACKFIN_API_BASE}/admin/dashboard`;
const USER_DASHBOARD_ENDPOINT = `${TRACKFIN_API_BASE}/user/dashboard`;

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (value) => {
    if (typeof value !== "string") return null;
    const normalized = value.trim().toLowerCase();
    return normalized || null;
  };

  const extractRoleFromUser = (incomingUser) => {
    if (!incomingUser || typeof incomingUser !== "object") return null;

    const directRole =
      normalizeRole(incomingUser.role) ||
      normalizeRole(incomingUser.userRole) ||
      normalizeRole(incomingUser.user_type);
    if (directRole) return directRole;

    const roleList = Array.isArray(incomingUser.roles)
      ? incomingUser.roles
      : typeof incomingUser.roles === "string"
        ? [incomingUser.roles]
        : [];

    return roleList.map((role) => normalizeRole(role)).find(Boolean) || null;
  };

  const normalizeUser = (incomingUser) => {
    if (!incomingUser) return null;

    const rawRoles = Array.isArray(incomingUser.roles)
      ? incomingUser.roles
      : typeof incomingUser.roles === "string"
        ? [incomingUser.roles]
        : [];
    const roles = rawRoles
      .map((role) => normalizeRole(role))
      .filter(Boolean);
    const primaryRole =
      normalizeRole(incomingUser.role) ||
      normalizeRole(incomingUser.userRole) ||
      normalizeRole(incomingUser.user_type) ||
      roles[0] ||
      "user";

    const uniqueRoles = roles.includes(primaryRole)
      ? roles
      : [primaryRole, ...roles];

    return {
      ...incomingUser,
      role: primaryRole,
      roles: uniqueRoles,
    };
  };

  const loadStoredSession = () => {
    const storedToken = localStorage.getItem("trackfin-token");
    const storedUser = localStorage.getItem("trackfin-user");
    const hasValidToken =
      Boolean(storedToken) &&
      storedToken !== "undefined" &&
      storedToken !== "null";

    if (hasValidToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (error) {
        localStorage.removeItem("trackfin-token");
        localStorage.removeItem("trackfin-user");
        setToken(null);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    loadStoredSession();
    setLoading(false);
  }, []);

  const saveSession = (newToken, newUser) => {
    const normalizedUser = normalizeUser(newUser);

    setToken(newToken);
    setUser(normalizedUser);
    localStorage.setItem("trackfin-token", newToken);
    localStorage.setItem("trackfin-user", JSON.stringify(normalizedUser));
  };

  const resolveAuthPayload = (response) => {
    if (!response || typeof response !== "object") {
      return { token: null, user: null };
    }

    const data =
      response.data && typeof response.data === "object"
        ? response.data
        : response;

    const token =
      data.token ||
      data.accessToken ||
      data.access_token ||
      data.jwt ||
      data.idToken ||
      null;

    const user =
      data.user ||
      data.profile ||
      (data.account && typeof data.account === "object"
        ? data.account
        : null) ||
      null;

    return { token, user };
  };

  const resolveRoleByAccess = async (authToken, fallbackRole = "user") => {
    if (!authToken) return fallbackRole;

    try {
      await apiRequest(ADMIN_DASHBOARD_ENDPOINT, { method: "GET" }, authToken);
      return "admin";
    } catch (error) {
      try {
        await apiRequest(USER_DASHBOARD_ENDPOINT, { method: "GET" }, authToken);
        return "user";
      } catch (innerError) {
        return fallbackRole;
      }
    }
  };

  const ensureUserRole = async (authToken, incomingUser) => {
    const explicitRole = extractRoleFromUser(incomingUser);
    if (explicitRole) return { ...incomingUser, role: explicitRole };

    const resolvedRole = await resolveRoleByAccess(authToken, "user");
    return { ...(incomingUser || {}), role: resolvedRole };
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("trackfin-token");
    localStorage.removeItem("trackfin-user");
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiRequest(AUTH_LOGIN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const { token: authToken, user: authUser } = resolveAuthPayload(response);
      if (!authToken || !authUser) {
        throw new Error("Invalid login response");
      }

      const userWithRole = await ensureUserRole(authToken, authUser);
      saveSession(authToken, userWithRole);
      toast.success("Welcome back!");
      navigate(
        normalizeUser(userWithRole)?.role === "admin" ? "/admin" : "/dashboard",
      );
    } catch (error) {
      if (ENABLE_DEMO_AUTH) {
        const role = email?.includes("admin") ? "admin" : "user";
        saveSession("demo-token", {
          name: email?.split("@")[0] || "Demo User",
          email,
          role,
        });
        toast.success("Signed in with demo profile.");
        navigate(role === "admin" ? "/admin" : "/dashboard");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await apiRequest(AUTH_REGISTER_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const { token: authToken, user: authUser } = resolveAuthPayload(response);
      if (!authToken || !authUser) {
        throw new Error("Invalid registration response");
      }

      const userWithRole = await ensureUserRole(authToken, authUser);
      saveSession(authToken, userWithRole);
      toast.success("Account created successfully.");
      navigate(normalizeUser(userWithRole)?.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      if (ENABLE_DEMO_AUTH) {
        saveSession("demo-token", {
          name: payload.name || "New User",
          email: payload.email,
          role: "user",
        });
        toast.success("Account created with demo profile.");
        navigate("/dashboard");
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest(AUTH_LOGOUT_ENDPOINT, { method: "POST" }, token);
    } catch (error) {
      // Even if the API fails, we still clear the session.
    } finally {
      clearSession();
      navigate("/auth?tab=signin");
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const response = await apiRequest(
        AUTH_ME_ENDPOINT,
        { method: "GET" },
        token,
      );
      const { user: meUser } = resolveAuthPayload(response);
      if (!meUser) return;
      const userWithRole = await ensureUserRole(token, meUser);
      saveSession(token, userWithRole);
    } catch (error) {
      if (import.meta.env.DEV) return;
      toast.error("Session expired. Please sign in again.");
      clearSession();
      navigate("/auth?tab=signin");
    }
  };

  const updateProfile = (payload) => {
    const updatedUser = { ...user, ...payload };
    saveSession(token, updatedUser);
  };

  const authGuardEnabled = ENABLE_AUTH_GUARD;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authGuardEnabled,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };

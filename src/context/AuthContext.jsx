import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiRequest } from "../services/api";
import { ENABLE_AUTH_GUARD } from "../config/featureFlags";

const AuthContext = createContext(null);
// Demo auth removed for security
const AUTH_API_BASE = (
  import.meta.env.VITE_AUTH_API_BASE || "/api/trackfin/auth"
).replace(/\/$/, "");
const TRACKFIN_API_BASE = (
  import.meta.env.VITE_TRACKFIN_API_BASE || AUTH_API_BASE.replace(/\/auth$/, "")
).replace(/\/$/, "");
const AUTH_LOGIN_ENDPOINT = `${AUTH_API_BASE}/login`;
const AUTH_REGISTER_ENDPOINT = `${AUTH_API_BASE}/register`;
const AUTH_VERIFY_OTP_ENDPOINT = `${AUTH_API_BASE}/verify-otp`;
const AUTH_RESEND_OTP_ENDPOINT = `${AUTH_API_BASE}/resend-otp`;
const AUTH_LOGOUT_ENDPOINT = `${AUTH_API_BASE}/logout`;
const AUTH_ME_ENDPOINT = `${AUTH_API_BASE}/me`;
const AUTH_PROFILE_ENDPOINT = `${TRACKFIN_API_BASE}/profile`;
const AUTH_PASSWORD_ENDPOINT = `${TRACKFIN_API_BASE}/profile/password`;
const ADMIN_DASHBOARD_ENDPOINT = `${TRACKFIN_API_BASE}/admin/dashboard`;
const USER_DASHBOARD_ENDPOINT = `${TRACKFIN_API_BASE}/user/dashboard`;

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

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
    const roles = rawRoles.map((role) => normalizeRole(role)).filter(Boolean);
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

  const saveSession = (newUser, newToken = null) => {
    const normalizedUser = normalizeUser(newUser);
    setToken(newToken);
    setUser(normalizedUser);
    if (newToken) {
      localStorage.setItem("trackfin_token", newToken);
    }
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
      data.plainTextToken ||
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

  const resolveRoleByAccess = async (fallbackRole = "user") => {
    try {
      await apiRequest(ADMIN_DASHBOARD_ENDPOINT, { method: "GET" });
      return "admin";
    } catch {
      try {
        await apiRequest(USER_DASHBOARD_ENDPOINT, { method: "GET" });
        return "user";
      } catch {
        return fallbackRole;
      }
    }
  };

  const ensureUserRole = async (incomingUser) => {
    const explicitRole = extractRoleFromUser(incomingUser);
    if (explicitRole) return { ...incomingUser, role: explicitRole };

    const resolvedRole = await resolveRoleByAccess("user");
    return { ...(incomingUser || {}), role: resolvedRole };
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("trackfin_token");
  };

  const finalizeInitialization = () => {
    setIsInitializing(false);
  };

  // Bootstraps auth from secure cookie on first load.
  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      try {
        const storedToken = localStorage.getItem("trackfin_token");
        if (storedToken) {
          setToken(storedToken);
        } else {
          // If no token, we can stop here
          if (isMounted) setLoading(false);
          return;
        }

        const response = await apiRequest(AUTH_ME_ENDPOINT, { method: "GET" });
        const { user: meUser } = resolveAuthPayload(response);
        if (!meUser) {
          if (isMounted) clearSession();
          return;
        }

        const userWithRole = await ensureUserRole(meUser);
        if (isMounted) saveSession(userWithRole, storedToken);
      } catch {
        if (isMounted) clearSession();
      } finally {
        if (isMounted) finalizeInitialization();
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inactivity Timer (120 minutes)
  useEffect(() => {
    if (!user) return;

    const INACTIVITY_LIMIT = 120 * 60 * 1000; // 120 minutes in ms
    let timeoutId;

    const handleLogout = () => {
      toast("Logging out due to inactivity", { icon: "🕒" });
      logout();
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, INACTIVITY_LIMIT);
    };

    // Events to track activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer),
    );

    resetTimer(); // Initialize timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const normalizeAuthError = (error, fallbackMessage) => {
    if (error instanceof Error) {
      if (!error.message) {
        error.message = fallbackMessage;
      }
      return error;
    }

    const normalizedError = new Error(fallbackMessage);
    if (error && typeof error === "object") {
      normalizedError.status = error.status || null;
      normalizedError.payload = error.payload || null;
      normalizedError.errors = error.errors || null;
    }
    return normalizedError;
  };

  const createVerificationRequiredError = (
    message = "Email verification is required.",
    email = "",
  ) => {
    const error = new Error(message);
    error.requiresVerification = true;
    error.email = email;
    error.payload = {
      requires_verification: true,
      email,
      message,
    };
    return error;
  };

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await apiRequest(AUTH_LOGIN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      if (response?.requires_verification) {
        throw createVerificationRequiredError(
          response.message || "Email verification is pending.",
          response.email || email,
        );
      }

      const { user: authUser } = resolveAuthPayload(response);
      if (!authUser) {
        throw new Error("Invalid login response");
      }

      const userWithRole = await ensureUserRole(authUser);
      saveSession(userWithRole, resolveAuthPayload(response).token);
      toast.success("Welcome back!");
      navigate(
        normalizeUser(userWithRole)?.role === "admin" ? "/admin" : "/dashboard",
      );
    } catch (error) {
      throw normalizeAuthError(error, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const apiPayload = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        password_confirmation:
          payload.password_confirmation || payload.password,
      };

      const response = await apiRequest(AUTH_REGISTER_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(apiPayload),
      });

      if (response?.requires_verification) {
        throw createVerificationRequiredError(
          response.message || "Please verify your email using OTP.",
          response.email || payload.email,
        );
      }

      const { user: authUser } = resolveAuthPayload(response);
      if (!authUser) {
        throw new Error("Invalid registration response");
      }

      const userWithRole = await ensureUserRole(authUser);
      saveSession(userWithRole, resolveAuthPayload(response).token);
      toast.success("Account created successfully.");
      navigate(
        normalizeUser(userWithRole)?.role === "admin" ? "/admin" : "/dashboard",
      );
    } catch (error) {
      throw normalizeAuthError(error, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await apiRequest(AUTH_VERIFY_OTP_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      const { user: authUser } = resolveAuthPayload(response);
      if (!authUser) {
        throw new Error("Invalid OTP verification response");
      }

      const userWithRole = await ensureUserRole(authUser);
      saveSession(userWithRole, resolveAuthPayload(response).token);
      toast.success("Email verified successfully.");
      navigate(
        normalizeUser(userWithRole)?.role === "admin" ? "/admin" : "/dashboard",
      );
    } catch (error) {
      throw normalizeAuthError(error, "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    const response = await apiRequest(AUTH_RESEND_OTP_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const message =
      (response && typeof response === "object" && response.message) ||
      "OTP sent successfully.";
    toast.success(message);
    return response;
  };

  const logout = async () => {
    const finalizeLogout = () => {
      clearSession();
      navigate("/auth/signin");
    };

    if (!user) {
      finalizeLogout();
      return;
    }

    try {
      await apiRequest(AUTH_LOGOUT_ENDPOINT, { method: "POST" });
      finalizeLogout();
    } catch (error) {
      if (error?.status === 401) {
        finalizeLogout();
        return;
      }

      toast.error("Logout failed on server. Please try again.");
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await apiRequest(AUTH_ME_ENDPOINT, { method: "GET" });
      const { user: meUser } = resolveAuthPayload(response);
      if (!meUser) {
        clearSession();
        return;
      }

      const userWithRole = await ensureUserRole(meUser);
      saveSession(userWithRole, token);
    } catch (error) {
      clearSession();
      if (error?.status !== 401) {
        toast.error("Session expired. Please sign in again.");
      }
    }
  };

  const updateProfile = async (payload) => {
    try {
      const isFormData = payload instanceof FormData;

      if (isFormData) {
        payload.append("_method", "PUT");
      }

      const response = await apiRequest(AUTH_PROFILE_ENDPOINT, {
        method: isFormData ? "POST" : "PUT",
        body: isFormData ? payload : JSON.stringify(payload),
      });
      if (response?.user) {
        const userWithRole = await ensureUserRole(response.user);
        saveSession(userWithRole, token);
        return true;
      }
      return false;
    } catch (error) {
      throw normalizeAuthError(error, "Failed to update profile");
    }
  };

  const updatePassword = async (payload) => {
    try {
      await apiRequest(AUTH_PASSWORD_ENDPOINT, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return true;
    } catch (error) {
      throw normalizeAuthError(error, "Failed to update password");
    }
  };

  const authGuardEnabled = ENABLE_AUTH_GUARD;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isInitializing,
        authGuardEnabled,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        refreshProfile,
        updateProfile,
        updatePassword,
        isAuthenticated: Boolean(user),
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

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };

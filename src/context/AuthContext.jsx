import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiRequest } from "../services/api";
import { ENABLE_AUTH_GUARD } from "../config/featureFlags";

const AuthContext = createContext(null);
const ENABLE_DEMO_AUTH = import.meta.env.VITE_ENABLE_DEMO_AUTH === "true";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (incomingUser) => {
    if (!incomingUser) return null;

    const roles = Array.isArray(incomingUser.roles) ? incomingUser.roles : [];

    return {
      ...incomingUser,
      role: incomingUser.role || roles[0] || "user",
      roles,
    };
  };

  const loadStoredSession = () => {
    const storedToken = localStorage.getItem("trackfin-token");
    const storedUser = localStorage.getItem("trackfin-user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (error) {
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

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("trackfin-token");
    localStorage.removeItem("trackfin-user");
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiRequest("/api/trackfin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveSession(response.token, response.user);
      toast.success("Welcome back!");
      navigate(response.user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      if (import.meta.env.DEV && ENABLE_DEMO_AUTH) {
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
      const response = await apiRequest("/api/trackfin/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      saveSession(response.token, response.user);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      if (import.meta.env.DEV && ENABLE_DEMO_AUTH) {
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
      await apiRequest("/api/trackfin/auth/logout", { method: "POST" }, token);
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
        "/api/trackfin/auth/me",
        { method: "GET" },
        token,
      );
      saveSession(token, response);
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

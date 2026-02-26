const VITE_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
const API_BASE_URL = VITE_API_BASE_URL.endsWith("/api")
  ? `${VITE_API_BASE_URL}/v1`
  : VITE_API_BASE_URL.includes("/api/")
    ? VITE_API_BASE_URL
    : `${VITE_API_BASE_URL}/api/v1`;

const resolveUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

const createApiError = (response, payload) => {
  const message =
    (typeof payload === "object" &&
      payload !== null &&
      (payload.message || payload.error)) ||
    (typeof payload === "string" && payload) ||
    "Request failed";

  const error = new Error(message);
  error.status = response.status;
  error.payload = payload;

  if (typeof payload === "object" && payload !== null) {
    error.errors = payload.errors || null;
  } else {
    error.errors = null;
  }

  return error;
};

export const apiRequest = async (endpoint, options = {}, tokenOverride) => {
  const token = tokenOverride || localStorage.getItem("trackfin_token");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(resolveUrl(endpoint), {
    credentials: "include",
    cache: "no-store",
    headers,
    ...options,
  });

  const isJsonResponse = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJsonResponse
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw createApiError(response, payload);
  }

  if (response.status === 204) {
    return { success: true };
  }

  if (typeof payload === "object" && payload !== null) {
    // Standard response handling
    if (Object.hasOwn(payload, "data")) {
      return payload.data ?? {};
    }

    return payload;
  }

  return { success: true };
};

export const AUTH_LOGIN_ENDPOINT = "/trackfin/auth/login";
export const AUTH_REGISTER_ENDPOINT = "/trackfin/auth/register";
export const AUTH_FORGOT_PASSWORD_ENDPOINT = "/trackfin/auth/forgot-password";
export const AUTH_RESET_PASSWORD_ENDPOINT = "/trackfin/auth/reset-password";
export const AUTH_VERIFY_OTP_ENDPOINT = "/trackfin/auth/verify-otp";
export const AUTH_RESEND_OTP_ENDPOINT = "/trackfin/auth/resend-otp";
export const AUTH_ME_ENDPOINT = "/trackfin/auth/me";
export const AUTH_LOGOUT_ENDPOINT = "/trackfin/auth/logout";
export const PROFILE_ENDPOINT = "/trackfin/profile";
export const PROFILE_PASSWORD_ENDPOINT = "/trackfin/profile/password";
export const PROFILE_ACTIVITY_ENDPOINT = "/trackfin/profile/activity";
export const PROFILE_SESSIONS_ENDPOINT = "/trackfin/profile/sessions";
export const PROFILE_EXPORT_ENDPOINT = "/trackfin/profile/export";
export const PROFILE_DELETE_ENDPOINT = "/trackfin/profile/delete";
export const ADMIN_DASHBOARD_ENDPOINT = "/trackfin/admin/dashboard";
export const USER_DASHBOARD_ENDPOINT = "/trackfin/user/dashboard";

export const CATEGORIES_ENDPOINT = "/trackfin/categories";
export const PAYMENT_METHODS_ENDPOINT = "/trackfin/accounts";
export const TRANSACTIONS_ENDPOINT = "/trackfin/transactions";
export const GOALS_ENDPOINT = "/trackfin/goals";
export const BUDGETS_ENDPOINT = "/trackfin/budgets";
export const NOTIFICATIONS_ENDPOINT = "/trackfin/notifications";
export const ADMIN_SETTINGS_ENDPOINT = "/trackfin/admin/settings";
export const ADMIN_ANNOUNCEMENTS_ENDPOINT = "/trackfin/admin/announcements";
export const REPORTS_ENDPOINT = "/trackfin/reports";
export const ADMIN_SESSIONS_ENDPOINT = "/trackfin/admin/security/sessions";
export const ADMIN_FAILED_LOGINS_ENDPOINT =
  "/trackfin/admin/security/failed-logins";
export const ADMIN_SUSPICIOUS_ENDPOINT = "/trackfin/admin/security/suspicious";
export const ADMIN_USERS_ENDPOINT = "/trackfin/admin/users";

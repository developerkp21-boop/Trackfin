const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(resolveUrl(endpoint), {
    credentials: "include",
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
    return {};
  }

  if (typeof payload === "object" && payload !== null) {
    if (Object.hasOwn(payload, "data")) {
      return payload.data ?? {};
    }

    return payload;
  }

  return {};
};

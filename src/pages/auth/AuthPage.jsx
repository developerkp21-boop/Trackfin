import { useMemo, useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

const DEMO_AUTH_ENABLED = import.meta.env.VITE_ENABLE_DEMO_AUTH === "true";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 6;

const extractFieldErrors = (error, allowedFields) => {
  const source =
    error?.errors && typeof error.errors === "object"
      ? error.errors
      : error?.payload?.errors && typeof error.payload.errors === "object"
        ? error.payload.errors
        : null;

  if (!source) {
    return {};
  }

  return allowedFields.reduce((accumulator, field) => {
    const value = source[field];
    if (!value) return accumulator;
    accumulator[field] = Array.isArray(value) ? value[0] : String(value);
    return accumulator;
  }, {});
};

const resolveVerificationState = (error) => {
  if (error?.requiresVerification) {
    return {
      required: true,
      email: error.email || "",
      message: error.message || "Email verification is required.",
    };
  }

  if (error?.payload?.requires_verification) {
    return {
      required: true,
      email: error.payload.email || "",
      message: error.payload.message || "Email verification is required.",
    };
  }

  return { required: false, email: "", message: "" };
};

const AuthPage = () => {
  const { login, register, verifyOtp, resendOtp, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [searchParams] = useSearchParams();

  const queryTab = searchParams.get("tab");
  const resolvedTab = tab || queryTab;
  const initialTab = resolvedTab === "signup" ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [loginValues, setLoginValues] = useState({ email: "", password: "" });
  const [registerValues, setRegisterValues] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [otpContext, setOtpContext] = useState({
    active: false,
    email: "",
    source: "signin",
  });
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const fromRoute = useMemo(() => location.state?.from, [location.state]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginValues((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterValues((prev) => ({ ...prev, [name]: value }));
    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOtpChange = (event) => {
    const onlyDigits = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpValue(onlyDigits);
    if (otpError) {
      setOtpError("");
    }
  };

  const validateLogin = () => {
    const errors = {};
    const email = loginValues.email.trim();

    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email))
      errors.email = "Enter a valid email address.";
    if (!loginValues.password) errors.password = "Password is required.";

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    const name = registerValues.name.trim();
    const email = registerValues.email.trim();

    if (!name) errors.name = "Name is required.";
    else if (name.length > MAX_NAME_LENGTH)
      errors.name = "Name may not be greater than 255 characters.";

    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email))
      errors.email = "Enter a valid email address.";
    else if (email.length > MAX_EMAIL_LENGTH)
      errors.email = "Email may not be greater than 255 characters.";

    if (!registerValues.password) errors.password = "Password is required.";
    if (
      registerValues.password.length > 0 &&
      registerValues.password.length < MIN_PASSWORD_LENGTH
    ) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (registerValues.password !== registerValues.password_confirmation) {
      errors.password_confirmation = "Password confirmation does not match.";
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setOtpError("");
    setOtpInfo("");
    if (!validateLogin()) return;
    try {
      await login(loginValues.email.trim(), loginValues.password);
    } catch (error) {
      const verificationState = resolveVerificationState(error);
      if (verificationState.required) {
        setOtpContext({
          active: true,
          email: verificationState.email || loginValues.email.trim(),
          source: "signin",
        });
        setOtpInfo(
          verificationState.message || "Enter OTP sent to your email.",
        );
        setResendTimer(60);
        return;
      }

      const fieldErrors = extractFieldErrors(error, ["email", "password"]);
      if (Object.keys(fieldErrors).length > 0) {
        setLoginErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }

      setLoginErrors((prev) => ({
        ...prev,
        password: error?.message || "Unable to sign in. Please try again.",
      }));
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setOtpError("");
    setOtpInfo("");
    if (!validateRegister()) return;
    try {
      await register({
        ...registerValues,
        name: registerValues.name.trim(),
        email: registerValues.email.trim(),
      });
    } catch (error) {
      const verificationState = resolveVerificationState(error);
      if (verificationState.required) {
        setOtpContext({
          active: true,
          email: verificationState.email || registerValues.email.trim(),
          source: "signup",
        });
        setOtpInfo(
          verificationState.message || "Enter OTP sent to your email.",
        );
        setResendTimer(60);
        return;
      }

      const fieldErrors = extractFieldErrors(error, [
        "name",
        "email",
        "password",
        "password_confirmation",
      ]);
      if (Object.keys(fieldErrors).length > 0) {
        setRegisterErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }

      setRegisterErrors((prev) => ({
        ...prev,
        email:
          error?.message ||
          "Unable to create account right now. Please try again.",
      }));
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (!otpValue || otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyOtp(otpContext.email, otpValue);
    } catch (error) {
      setOtpError(
        error?.message || "OTP verification failed. Please try again.",
      );
    }
  };

  const handleResendOtp = async () => {
    setResendingOtp(true);
    setOtpError("");
    try {
      const response = await resendOtp(otpContext.email);
      setOtpInfo(response?.message || "OTP sent successfully.");
      setResendTimer(60);
    } catch (error) {
      setOtpError(error?.message || "Unable to resend OTP right now.");
    } finally {
      setResendingOtp(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setOtpContext({ active: false, email: "", source: tab });
    setOtpValue("");
    setOtpError("");
    setOtpInfo("");
    navigate(`/auth/${tab === "signup" ? "signup" : "signin"}`, {
      replace: true,
    });
  };

  return (
    <AuthLayout
      title="Welcome to TrackFin"
      subtitle="Mobile-ready finance workflows with secure access control."
      footer={
        <span>
          Need help?{" "}
          <Link
            className="text-success fw-semibold text-decoration-none"
            to="/forgot-password"
          >
            Reset password
          </Link>
        </span>
      }
    >
      <div className="glass-card rounded-4 p-2 auth-tab-nav mb-3">
        <div className="d-flex gap-2">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "signin" ? "active" : ""}`}
            onClick={() => switchTab("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => switchTab("signup")}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm glass-card">
        <div className="card-body p-3 p-sm-4 card-body-mobile">
          {fromRoute && activeTab === "signin" && (
            <div className="alert alert-info py-2 small mb-3">
              Please sign in to continue.
            </div>
          )}

          {otpContext.active ? (
            <div className="d-flex flex-column align-items-center text-center">
              <div className="mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3"
                  style={{ width: "56px", height: "56px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                  </svg>
                </div>
                <h5 className="fw-bold text-app-primary mb-2">
                  Check your email
                </h5>
                <p className="small text-app-secondary mb-0">
                  We've sent a 6-digit verification code to
                  <br />
                  <span className="fw-semibold text-app-primary">
                    {otpContext.email}
                  </span>
                </p>
              </div>

              {otpInfo && (
                <div
                  className="alert alert-success py-2 px-3 small w-100 mb-4 border-0"
                  style={{ background: "rgba(25, 135, 84, 0.1)" }}
                >
                  {otpInfo}
                </div>
              )}

              <form
                className="w-100 d-flex flex-column gap-3"
                onSubmit={handleOtpSubmit}
              >
                <div>
                  <Input
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit OTP"
                    value={otpValue}
                    onChange={handleOtpChange}
                    error={otpError}
                    className={`text-center fw-bold letter-spacing-lg mb-1 ${otpValue && !otpError ? "is-valid" : ""}`}
                    style={{ fontSize: "1.25rem", letterSpacing: "0.5em" }}
                    maxLength="6"
                  />
                  {!otpError && (
                    <p className="small text-app-muted mt-1 mb-0 text-start">
                      Code expires in 10 minutes.
                    </p>
                  )}
                </div>

                <div className="d-flex flex-column gap-2 mt-2">
                  <Button
                    type="submit"
                    className="w-100 py-2"
                    variant="success"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Email Address"}
                  </Button>

                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      className="w-100 py-2 bg-transparent text-app-secondary border-0 hover-bg-light"
                      variant="outline"
                      disabled={resendingOtp || resendTimer > 0}
                      onClick={handleResendOtp}
                    >
                      {resendingOtp
                        ? "Sending..."
                        : resendTimer > 0
                          ? `Resend code in ${resendTimer}s`
                          : "Resend code"}
                    </Button>
                    <Button
                      type="button"
                      className="w-100 py-2 bg-transparent text-app-secondary border-0 hover-bg-light"
                      variant="ghost"
                      onClick={() => {
                        setOtpContext({
                          active: false,
                          email: "",
                          source: activeTab,
                        });
                        setOtpValue("");
                        setOtpError("");
                        setOtpInfo("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          ) : activeTab === "signin" ? (
            <form
              className="d-flex flex-column gap-2"
              onSubmit={handleLoginSubmit}
            >
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={loginValues.email}
                onChange={handleLoginChange}
                error={loginErrors.email}
                className={
                  loginValues.email && !loginErrors.email ? "is-valid" : ""
                }
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={loginValues.password}
                onChange={handleLoginChange}
                error={loginErrors.password}
                className={
                  loginValues.password && !loginErrors.password
                    ? "is-valid"
                    : ""
                }
              />
              <div className="d-flex align-items-center justify-content-between small flex-wrap gap-2">
                <div className="form-check m-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label
                    className="form-check-label text-app-secondary"
                    htmlFor="rememberMe"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  className="fw-semibold text-decoration-none text-success"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-100 mt-2"
                variant="success"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          ) : (
            <form
              className="d-flex flex-column gap-2"
              onSubmit={handleRegisterSubmit}
            >
              <Input
                label="Full name"
                name="name"
                placeholder="Alex Carter"
                value={registerValues.name}
                onChange={handleRegisterChange}
                error={registerErrors.name}
                className={
                  registerValues.name && !registerErrors.name ? "is-valid" : ""
                }
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                placeholder="alex@company.com"
                value={registerValues.email}
                onChange={handleRegisterChange}
                error={registerErrors.email}
                className={
                  registerValues.email && !registerErrors.email
                    ? "is-valid"
                    : ""
                }
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={registerValues.password}
                onChange={handleRegisterChange}
                error={registerErrors.password}
                className={
                  registerValues.password && !registerErrors.password
                    ? "is-valid"
                    : ""
                }
              />
              <Input
                label="Confirm Password"
                name="password_confirmation"
                type="password"
                placeholder="••••••••"
                value={registerValues.password_confirmation}
                onChange={handleRegisterChange}
                error={registerErrors.password_confirmation}
                className={
                  registerValues.password_confirmation &&
                  !registerErrors.password_confirmation
                    ? "is-valid"
                    : ""
                }
              />
              <Button
                type="submit"
                className="w-100 mt-2"
                variant="success"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <p className="small text-app-secondary mb-0">
                By creating an account, you agree to our Terms and Privacy
                Policy.
              </p>
            </form>
          )}
        </div>
      </div>

      {DEMO_AUTH_ENABLED ? (
        <div className="auth-tip rounded-3 p-3 small mt-3">
          <p className="text-app-secondary text-center mb-2 fw-semibold">
            🚀 Demo Credentials
          </p>
          <div className="d-flex flex-column gap-1">
            <div
              className="d-flex align-items-center justify-content-between px-2 py-1 rounded-2"
              style={{
                background: "rgba(var(--brand-primary-rgb, 99,102,241),0.08)",
              }}
            >
              <span className="text-app-secondary">Admin Dashboard</span>
              <code className="small fw-semibold text-success">
                admin@demo.com
              </code>
            </div>
            <div
              className="d-flex align-items-center justify-content-between px-2 py-1 rounded-2"
              style={{
                background: "rgba(var(--brand-primary-rgb, 99,102,241),0.05)",
              }}
            >
              <span className="text-app-secondary">User Dashboard</span>
              <code
                className="small fw-semibold"
                style={{ color: "var(--brand-primary)" }}
              >
                user@demo.com
              </code>
            </div>
          </div>
          <p
            className="text-app-muted text-center mt-2 mb-0"
            style={{ fontSize: "0.72rem" }}
          >
            Any password works in demo mode
          </p>
        </div>
      ) : (
        <div className="auth-tip rounded-3 p-3 small text-app-secondary text-center mt-3">
          Use registered account credentials to sign in. Admin access depends on
          assigned role.
        </div>
      )}
    </AuthLayout>
  );
};

export default AuthPage;

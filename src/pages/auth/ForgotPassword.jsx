import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import OtpInput from "../../components/OtpInput";
import toast from "react-hot-toast";
import {
  apiRequest,
  AUTH_FORGOT_PASSWORD_ENDPOINT,
  AUTH_RESET_PASSWORD_ENDPOINT,
} from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step 1: Send OTP to email; Step 2: Verify OTP & Reset Password
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(AUTH_FORGOT_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response && response.success !== false) {
        toast.success(
          response.message || "OTP sent successfully to your email.",
        );
        setStep(2);
      } else {
        toast.error(
          response?.message || "Failed to send OTP. Please try again.",
        );
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(AUTH_RESET_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (response && response.success !== false) {
        toast.success(
          response.message || "Password reset successfully! Please login.",
        );
        navigate("/auth/signin");
      } else {
        toast.error(
          response?.message ||
            "Failed to reset password. Please check your OTP.",
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Reset your password" : "Set new password"}
      subtitle={
        step === 1
          ? "Enter your email to receive a 6-digit verification code."
          : "Enter the OTP sent to your email and choose a new password."
      }
      footer={
        <p className="mb-0">
          Remembered your password?{" "}
          <Link
            className="fw-semibold text-success text-decoration-none"
            to="/auth/signin"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <Card>
        {step === 1 ? (
          <form className="d-flex flex-column gap-3" onSubmit={handleSendOtp}>
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="finance@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-100 mt-2" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form
            className="d-flex flex-column gap-3"
            onSubmit={handleResetPassword}
          >
            <div className="alert alert-info py-2 fs-7 mb-0 rounded-3 border-0 bg-info-subtle text-info-emphasis">
              OTP sent to <strong>{email}</strong>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 ms-2 text-decoration-none"
                onClick={() => setStep(1)}
              >
                (Change)
              </button>
            </div>

            <div className="mb-1">
              <label className="form-label small fw-medium text-app-secondary">
                6-Digit Verification Code (OTP)
              </label>
              <OtpInput
                value={otp}
                onChange={(val) => setOtp(val)}
                error={null} // toast handles errors here
              />
            </div>

            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              name="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />

            <Button type="submit" className="w-100 mt-2" disabled={loading}>
              {loading
                ? "Verifying & Resetting..."
                : "Verify OTP & Reset Password"}
            </Button>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./../styles/auth.css";
import { resetPassword } from "../api";

export default function ResetPassword() {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {

    if (!password) return "Password is required";

    if (password.length < 8)
      return "Password must be at least 8 characters";

    if (password !== confirmPassword)
      return "Passwords do not match";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError("");

    try {
      setLoading(true);

      await resetPassword({password, resetToken: token});

      setSuccess(true);

      setTimeout(() => navigate("/login"), 2500);

    } catch {
      setError("Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Invalid Reset Link</h2>

          <p className="error">
            This password reset link is missing or invalid.
          </p>

          <div className="auth-footer">
            <Link to="/forgot-password">
              Request another reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {!success ? (
          <>
            <h2>Create New Password</h2>

            <p className="auth-subtitle">
              Enter your new password below.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>

              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>

            </form>
          </>
        ) : (
          <>
            <h2>Password Updated!</h2>

            <p className="success-message">
              Your password has been successfully updated.
            </p>

            <div className="auth-footer">
              Redirecting to login...
            </div>
          </>
        )}

      </div>
    </div>
  );
}
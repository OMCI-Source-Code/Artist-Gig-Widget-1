import { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/auth.css";
import { forgotPassword } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@canadianmusicians\.coop$/;

    if (!email) return "Email is required";
    if (!regex.test(email)) return "Invalid email";

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

      await forgotPassword(email);

      setSuccess(true);
    } catch {
      setError("Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {!success ? (
          <>
            <h2>Forgot Password</h2>

            <p className="auth-subtitle">
              Enter your email and we'll send you a password reset link.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

            </form>
          </>
        ) : (
          <>
            <h2>Check Your Email</h2>

            <p className="success-message">
              If an account exists for <strong>{email}</strong>, a password
              reset link has been sent.
            </p>
          </>
        )}

        <div className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </div>

      </div>
    </div>
  );
}
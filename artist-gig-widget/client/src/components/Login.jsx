import React, { useState, useEffect } from 'react';
import { login as apiLogin } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import "./../styles/auth.css";


export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)
  const [forgotPW, setForgotPW] = useState(false)
  const [forgotPWMessage, setForgotPWMessage] = useState('')

  const { login } = useAuth();




  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(form);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length > 0) return;
    try {
      console.log(form)
      const res = await apiLogin({
        email: form.email,
        password: form.password,
      });

      if (!res?.token) {
        localStorage.clear();
        setFormErrors({ api: "Invalid email or password" });
        return;
      }
      console.log("login res token")
      login(res.token);

      if (res.user.user_role === "artist") {
        navigate("/dashboard");
      } else if (res.user.user_role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setFormErrors({ api: "Invalid email or password" });
    }
  }

  const handleForgotPW = async (e) => {
    e.preventDefault();

    const errors = validate(form);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length > 0) return;

    try {
      const res = // route to update password
      
      setForgotPWMessage("Password Reset Email Sent")
    } catch (err) {
      setFormErrors({ api: "Invalid email or password" });
    }
  }

  useEffect(() => {
    console.log(formErrors)
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(form)
    }
  }, [formErrors])

  const validate = (values) => {
    const errors = {}
    const regex = /^[a-zA-Z0-9._%+-]+@canadianmusicians\.coop$/


    if (!values.email) {
      errors.email = "Email is Required"
    } else if (!regex.test(values.email)) {
      errors.email = "Email Format Invalid"
    }

    if (!values.password) {
      errors.password = "Password is Required"
    }
    return errors;

  }

  return (
    <div className="auth-page">
      <div className="auth-card">

          <div>
            <h2>Welcome Back</h2>
            <form className="auth-form" onSubmit={handleSubmit}>

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              {formErrors.email && (
                <p className="error">{formErrors.email}</p>
              )}

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              {formErrors.password && (
                <p className="error">{formErrors.password}</p>
              )}

              {formErrors.api && (
                <p className="error">{formErrors.api}</p>
              )}

              <button type="submit">
                Login
              </button>

            </form>

            <div className="auth-footer">
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </div>
            <div className="auth-footer">
              <div className="auth-footer">
    <Link to="/forgot-password">
        Forgot Password?
    </Link>
</div>
            </div>
          </div>





      </div>
    </div>
  );
}
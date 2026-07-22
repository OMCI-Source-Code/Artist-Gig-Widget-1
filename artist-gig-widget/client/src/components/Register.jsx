import { useState, useEffect } from "react";
import { register } from '../api.js';
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./../styles/auth.css";

export default function Register() {
      const navigate = useNavigate();
      const [form, setForm] = useState({ name: '', artist_name: '', website: '', email: '', password: '' });
      const [formErrors, setFormErrors] = useState({});
      const [isSubmit, setIsSubmit] = useState(false)

      const { login } = useAuth();

      const handleSubmit = async (e) => {
            e.preventDefault()
            const errors = validate(form);
            setFormErrors(errors);
            setIsSubmit(true);

            if (Object.keys(errors).length > 0) return;

            try {
                  const res = await register(form)

                  login(res.user, res.token);
                  navigate("/dashboard");
            } catch (e) {
                  console.log(e)
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

            if (!values.name) {
                  errors.name = "Artist Name is Required"
            }

            if (!values.email) {
                  errors.email = "Email is Required"
            } else if (!regex.test(values.email)) {
                  errors.email = "Email Format Invalid"
            }

            if (!values.password) {
                  errors.password = "Password is Required"
            } else if (values.password.length < 5) {
                  errors.password = "Password Must Be More Than 5 Characters"
            } else if (values.password.length > 40) {
                  errors.password = "Password Must Be Less Than 40 Characters"
            }
            return errors;

      }

     return (
    <div className="auth-page">

        <div className="auth-card">

            <h2>Create Account</h2>

            <form className="auth-form" onSubmit={handleSubmit}>

                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={e =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
                {formErrors.name && (
                    <p className="error">{formErrors.name}</p>
                )}

                <input
                    placeholder="Artist Name"
                    value={form.artist_name}
                    onChange={e =>
                        setForm({ ...form, artist_name: e.target.value })
                    }
                />
                {formErrors.artist_name && (
                    <p className="error">{formErrors.artist_name}</p>
                )}

                <input
                    placeholder="Website (optional)"
                    value={form.website}
                    onChange={e =>
                        setForm({ ...form, website: e.target.value })
                    }
                />

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

                <button type="submit">
                    Register
                </button>

            </form>

            <div className="auth-footer">
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </div>

        </div>

    </div>
);
}
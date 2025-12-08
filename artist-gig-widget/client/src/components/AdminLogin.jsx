import React, { use, useState } from "react";
import { adminLogin } from "../api";
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
      const { login } = useAuth();
      const [form, setForm] = useState({ email: '', password: '' })
      const [token, setToken] = useState(localStorage.getItem('token'));
      const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('admin') || 'null'));

      async function submit(e) {
            e.preventDefault();
            try {
                  const res = await adminLogin(form);
                  setToken(res.token);
                  setAdmin(res.admin);
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('admin', JSON.stringify(res.admin));
                  login("admin");
                  alert('Success! You can go to the Admin Dashboard now.');
            } catch (e) {
                  alert(e.message);
            }

      }

      return (
            <div>
                  <h2>Admin Login</h2>
                  <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
                        <input
                              type="email"
                              placeholder="Email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <input
                              type="password"
                              placeholder="Password"
                              value={form.password}
                              onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <button type="submit">Login As Admin</button>
                  </form>

            </div>
      )
}
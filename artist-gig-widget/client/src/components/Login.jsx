import React, { useState } from 'react';
import { login, register } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';



export default function Login() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', website: '', email: '', password: '' });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [artist, setArtist] = useState(JSON.parse(localStorage.getItem('artist') || 'null'));


  async function submit(e) {
    e.preventDefault();
    try {
      const res = mode === 'register'
        ? await register(form)
        : await login({ email: form.email, password: form.password });

      setToken(res.token);
      setArtist(res.artist);
      localStorage.setItem('token', res.token);
      localStorage.setItem('artist', JSON.stringify(res.artist));
      login("user");
      alert('Success! You can go to Dashboard now.');
    } catch (e) {
      alert(e.message);
    }
  }


  return (
    <div>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        {mode === 'register' && (
          <>
            <input placeholder="Artist Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Website (optional)" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
          </>
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">{mode === 'register' ? 'Create account' : 'Login'}</button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginTop: 8 }}>
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
      {token && artist && (
        <div style={{ marginTop: 12 }}>
          <div>Logged in as <strong>{artist.name}</strong></div>
          <div>Artist ID: <code>{artist.id}</code></div>
        </div>
      )}
    </div>
  );
}
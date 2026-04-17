import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">HealthConnect</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input className="input" placeholder="Email" type="email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="input mt-3" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="btn mt-4 w-full">Login</button>
        <p className="mt-4 text-sm text-center">No account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
      </form>
    </div>
  );
}

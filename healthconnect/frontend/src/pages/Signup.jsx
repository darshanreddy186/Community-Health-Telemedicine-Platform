import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '', availability: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input className="input" placeholder="Full Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="input mt-3" placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="input mt-3" placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <select className="input mt-3" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {form.role === 'doctor' && (
          <>
            <input className="input mt-3" placeholder="Specialization" value={form.specialization}
              onChange={e => setForm({ ...form, specialization: e.target.value })} />
            <input className="input mt-3" placeholder="Availability (e.g. Mon-Fri 9am-5pm)" value={form.availability}
              onChange={e => setForm({ ...form, availability: e.target.value })} />
          </>
        )}
        <button type="submit" className="btn mt-4 w-full">Sign Up</button>
        <p className="mt-4 text-sm text-center">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}

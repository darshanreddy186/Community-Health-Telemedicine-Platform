import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
          active ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-500'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-blue-600 shadow-md px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
        <span className="text-2xl">🏥</span> HealthConnect
      </Link>
      <div className="flex items-center gap-2">
        {auth?.user.role === 'patient' && (
          <>
            {navLink('/doctors', 'Doctors')}
            {navLink('/appointments', 'Appointments')}
            {navLink('/records', 'Records')}
          </>
        )}
        {auth?.user.role === 'doctor' && navLink('/appointments', 'Appointments')}
        <div className="ml-4 flex items-center gap-3 border-l border-blue-400 pl-4">
          <NotificationBell />
          <span className="text-sm text-blue-100 capitalize">{auth?.user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-white text-blue-600 px-3 py-1 rounded-md font-medium hover:bg-blue-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

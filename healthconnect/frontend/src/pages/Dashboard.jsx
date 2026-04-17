import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppointmentCalendar from '../components/AppointmentCalendar';

const PATIENT_CARDS = [
  { to: '/doctors', label: 'Browse Doctors', icon: '👨‍⚕️', desc: 'Find specialists and book appointments', color: 'bg-blue-50 border-blue-100 hover:border-blue-300' },
  { to: '/appointments', label: 'My Appointments', icon: '📅', desc: 'View and manage your bookings', color: 'bg-green-50 border-green-100 hover:border-green-300' },
  { to: '/records', label: 'Medical Records', icon: '📁', desc: 'Upload and access your health files', color: 'bg-yellow-50 border-yellow-100 hover:border-yellow-300' },
];

const DOCTOR_CARDS = [
  { to: '/appointments', label: 'My Appointments', icon: '📅', desc: 'View your scheduled appointments', color: 'bg-green-50 border-green-100 hover:border-green-300' },
];

export default function Dashboard() {
  const { auth } = useAuth();
  const { user } = auth;
  const cards = user.role === 'patient' ? PATIENT_CARDS : DOCTOR_CARDS;

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [topDoctors, setTopDoctors] = useState([]);

  useEffect(() => {
    api.get('/appointments').then(r => setAppointments(r.data)).catch(() => {});
    if (user.role === 'patient') {
      api.get('/doctors').then(r => {
        const sorted = [...r.data].sort((a, b) => b.rating - a.rating);
        setTopDoctors(sorted.slice(0, 3));
      }).catch(() => {});
    }
  }, []);

  // Today's date as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppts = appointments
    .filter(a => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const selectedAppts = selectedDate
    ? appointments.filter(a => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))
    : [];

  return (
    <div className="mt-8 max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-500 mt-1 capitalize text-sm">Logged in as {user.role}</p>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className={`border rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 ${card.color}`}
          >
            <span className="text-3xl">{card.icon}</span>
            <div>
              <p className="font-semibold text-gray-800">{card.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Top Doctors — patients only */}
      {user.role === 'patient' && topDoctors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">⭐ Top Doctors</h2>
            <Link to="/doctors" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topDoctors.map((doc, i) => (
              <div key={doc._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                    {['❤️','🦷','🧴','🧠','👶','🦴','🧘'][i] || '👨‍⚕️'}
                  </div>
                  {i === 0 && (
                    <span className="absolute -top-1 -right-1 text-sm">🥇</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500 truncate">{doc.specialization}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600 font-medium">{doc.rating?.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">· {doc.experience}y exp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar + Today's Appointments side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Appointment Calendar</h2>
          <AppointmentCalendar
            appointments={appointments}
            onDayClick={(date) => setSelectedDate(prev => prev === date ? null : date)}
          />
          {/* Selected day appointments */}
          {selectedDate && (
            <div className="mt-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <p className="font-semibold text-gray-700 text-sm mb-3">
                📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              {selectedAppts.length === 0 ? (
                <p className="text-sm text-gray-400">No appointments on this day.</p>
              ) : (
                <div className="space-y-2">
                  {selectedAppts.map(a => (
                    <ApptRow key={a._id} appt={a} role={user.role} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today's Appointments */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Today's Appointments</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            {todayAppts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">🗓️</p>
                <p className="text-gray-400 text-sm">No appointments scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppts.map(a => (
                  <ApptRow key={a._id} appt={a} role={user.role} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApptRow({ appt, role }) {
  const name = role === 'patient'
    ? `Dr. ${appt.doctor?.name}`
    : appt.patient?.name;

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm">
          {role === 'patient' ? '👨‍⚕️' : '🧑‍💼'}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">{appt.time}</p>
        </div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        appt.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
      }`}>
        {appt.status}
      </span>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const load = () => api.get('/appointments').then(r => setAppointments(r.data));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    await api.patch(`/appointments/${id}/cancel`);
    load();
  };

  const openChat = (appt) => {
    const otherId = auth.user.role === 'patient' ? appt.doctor._id : appt.patient._id;
    const roomId = [auth.user.id, otherId].sort().join('_');
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <p className="text-gray-500 text-sm mt-1">Your scheduled and past appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-gray-700 font-semibold text-lg">No appointments yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {auth.user.role === 'patient' ? 'Browse doctors and book your first appointment.' : 'Your scheduled appointments will appear here.'}
          </p>
          {auth.user.role === 'patient' && (
            <a href="/doctors" className="inline-block mt-4 btn text-sm">Find a Doctor</a>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => (
            <div key={appt._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                  {auth.user.role === 'patient' ? '👨‍⚕️' : '🧑‍💼'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {auth.user.role === 'patient' ? `Dr. ${appt.doctor?.name}` : appt.patient?.name}
                  </p>
                  <p className="text-sm text-gray-500">{appt.date} at {appt.time}</p>
                  {auth.user.role === 'patient' && (
                    <p className="text-xs text-gray-400">{appt.doctor?.specialization}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  appt.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {appt.status}
                </span>
                <button onClick={() => openChat(appt)} className="btn-outline text-sm">Chat</button>
                {appt.status === 'booked' && (
                  <button onClick={() => cancel(appt._id)} className="text-red-500 text-sm hover:underline">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

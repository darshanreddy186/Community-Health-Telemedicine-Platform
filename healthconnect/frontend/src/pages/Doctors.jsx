import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleMsg, setToggleMsg] = useState('');
  const { auth } = useAuth();
  const navigate = useNavigate();
  const isDoctor = auth.user.role === 'doctor';

  const load = () => {
    setLoading(true);
    api.get('/doctors')
      .then(r => setDoctors(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Returns a promise so DoctorCard can handle success/error itself
  const book = async (doctorId, date, time) => {
    const res = await api.post('/appointments', { doctor: doctorId, date, time });
    return res.data;
  };

  const openChat = (doctorId) => {
    const roomId = [auth.user.id, doctorId].sort().join('_');
    navigate(`/chat/${roomId}`);
  };

  const toggleAvailability = async () => {
    try {
      const { data } = await api.patch('/doctors/availability');
      setDoctors(prev => prev.map(d =>
        d._id === auth.user.id ? { ...d, isAvailable: data.isAvailable } : d
      ));
      setToggleMsg(data.isAvailable ? 'You are now available.' : 'You are now unavailable.');
      setTimeout(() => setToggleMsg(''), 3000);
    } catch {
      setToggleMsg('Failed to update availability.');
    }
  };

  const myCard = isDoctor ? doctors.find(d => d._id === auth.user.id) : null;

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isDoctor ? 'My Profile' : 'Find a Doctor'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isDoctor
            ? 'Manage your availability status'
            : 'Click "Book Appointment" on any doctor card to schedule a visit'}
        </p>
      </div>

      {/* Doctor's own availability toggle */}
      {isDoctor && (
        <div className="max-w-sm">
          {toggleMsg && (
            <p className="text-sm text-green-600 mb-3 font-medium">{toggleMsg}</p>
          )}
          {myCard ? (
            <DoctorCard doctor={myCard} showToggle onToggle={toggleAvailability} />
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-gray-400 shadow-sm">
              <p className="text-3xl mb-2">👨‍⚕️</p>
              <p className="text-sm">Your profile is not listed yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Patient view */}
      {!isDoctor && (
        <>
          {loading && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3 animate-pulse">🏥</p>
              <p className="text-sm">Loading doctors...</p>
            </div>
          )}

          {!loading && doctors.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <p className="text-5xl mb-4">👨‍⚕️</p>
              <p className="text-gray-700 font-semibold text-lg">No doctors available</p>
              <p className="text-gray-400 text-sm mt-1">Please check back later or contact support.</p>
            </div>
          )}

          {!loading && doctors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map(doc => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  onBook={book}
                  onChat={openChat}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

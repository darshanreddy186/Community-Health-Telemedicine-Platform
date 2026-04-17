import React, { useState } from 'react';

const SPECIALTY_ICONS = {
  Cardiologist: '❤️',
  Dentist: '🦷',
  Dermatologist: '🧴',
  Neurologist: '🧠',
  Pediatrician: '👶',
  'Orthopedic Surgeon': '🦴',
  Psychiatrist: '🧘',
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm leading-none">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      </span>
      <span className="text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function DoctorCard({ doctor, onBook, onChat, showToggle, onToggle }) {
  const icon = SPECIALTY_ICONS[doctor.specialization] || '👨‍⚕️';
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState({ text: '', type: '' });
  const [booking, setBooking] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleBook = async () => {
    if (!date || !time) {
      setStatus({ text: 'Please pick a date and time.', type: 'error' });
      return;
    }
    setBooking(true);
    setStatus({ text: '', type: '' });
    try {
      await onBook(doctor._id, date, time);
      setStatus({ text: '✅ Appointment booked!', type: 'success' });
      setDate('');
      setTime('');
      setShowForm(false);
    } catch (err) {
      setStatus({ text: err?.message || 'Booking failed.', type: 'error' });
    } finally {
      setBooking(false);
      setTimeout(() => setStatus({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border flex flex-col transition-shadow duration-200
      ${doctor.isAvailable ? 'border-gray-100 hover:shadow-md' : 'border-gray-200 opacity-75'}`}>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{doctor.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                doctor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {doctor.isAvailable ? '● Available' : '○ Unavailable'}
              </span>
            </div>
            <span className="inline-block mt-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {doctor.specialization}
            </span>
          </div>
        </div>

        {/* Rating + stats */}
        <div className="flex flex-col gap-1">
          {doctor.rating > 0 && <StarRating rating={doctor.rating} />}
          <div className="flex gap-3 text-xs text-gray-500">
            <span>🎓 {doctor.experience} yrs exp</span>
            <span>📅 {doctor.availability}</span>
          </div>
        </div>

        {/* Slots */}
        {doctor.availableSlots?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {doctor.availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => { setTime(slot.replace(' AM','').replace(' PM','') + (slot.includes('PM') && !slot.startsWith('12') ? '' : '')); setShowForm(true); }}
                className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md hover:bg-green-100 transition"
              >
                {slot}
              </button>
            ))}
          </div>
        )}

        {/* Doctor availability toggle */}
        {showToggle && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600 font-medium">My Availability</span>
            <button
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                doctor.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                doctor.isAvailable ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        )}
      </div>

      {/* Booking section — patients only */}
      {!showToggle && (
        <div className="border-t border-gray-100 p-4 flex flex-col gap-3">
          {/* Inline booking form */}
          {showForm ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Time</label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>
              </div>

              {status.text && (
                <p className={`text-xs font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {status.text}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBook}
                  disabled={booking || !date || !time}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setStatus({ text: '', type: '' }); }}
                  className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                disabled={!doctor.isAvailable}
                className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {doctor.isAvailable ? 'Book Appointment' : 'Not Available'}
              </button>
              <button
                onClick={() => onChat(doctor._id)}
                className="px-4 py-2 border border-blue-200 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition"
              >
                💬
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';

export default function AppointmentCalendar({ appointments, onDayClick }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const { year, month } = current;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Build a set of date strings that have appointments: "YYYY-MM-DD"
  const apptDates = new Set(
    appointments
      .filter(a => a.status === 'booked')
      .map(a => a.date)
  );

  const pad = (n) => String(n).padStart(2, '0');

  const prev = () => setCurrent(c => c.month === 0
    ? { year: c.year - 1, month: 11 }
    : { year: c.year, month: c.month - 1 });

  const next = () => setCurrent(c => c.month === 11
    ? { year: c.year + 1, month: 0 }
    : { year: c.year, month: c.month + 1 });

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const dateStr = (day) => `${year}-${pad(month + 1)}-${pad(day)}`;

  const hasAppt = (day) => apptDates.has(dateStr(day));

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">‹</button>
        <p className="font-semibold text-gray-800">{MONTHS[month]} {year}</p>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">›</button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div key={i}>
            {day ? (
              <button
                onClick={() => onDayClick(dateStr(day))}
                className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition relative
                  ${isToday(day) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}
                  ${hasAppt(day) && !isToday(day) ? 'ring-2 ring-blue-300' : ''}
                `}
              >
                {day}
                {hasAppt(day) && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isToday(day) ? 'bg-white' : 'bg-blue-500'}`} />
                )}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Dates with <span className="text-blue-500 font-medium">●</span> have appointments
      </p>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import api from '../api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const load = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch {}
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const handleOpen = async () => {
    setOpen(o => !o);
    if (!open && unread > 0) {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-1.5 rounded-md text-white hover:bg-blue-500 transition"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-800 text-sm">Notifications</p>
            <span className="text-xs text-gray-400">{notifications.length} total</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <div key={n._id} className={`px-4 py-3 border-b border-gray-50 flex gap-3 items-start ${!n.read ? 'bg-blue-50' : ''}`}>
                  <span className="text-lg mt-0.5">{n.type === 'booked' ? '✅' : '❌'}</span>
                  <div>
                    <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

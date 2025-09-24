import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { notifications, markAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (n) => {
    markAsRead(n.id);
    setOpen(false);
    // ถ้าเป็นข้อความ ให้ scroll ไปยังข้อความนั้น
    if (n.type === 'message' && n.link) {
      navigate(n.link + '#' + (n.messageId || ''));
    } else if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 font-bold">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl z-50 border">
          <div className="p-4 border-b font-bold text-gray-700 flex justify-between items-center">
            Notifications
            <button className="text-xs text-indigo-500 hover:underline" onClick={() => setOpen(false)}>Close</button>
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y">
            {notifications.length === 0 && (
              <li className="p-4 text-gray-400 text-center">No notifications</li>
            )}
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition ${n.read ? 'bg-gray-50 text-gray-400' : 'bg-indigo-50 text-gray-800 font-semibold'}`}
                onClick={() => handleClick(n)}
              >
                <div className="relative">
                  {n.avatar ? (
                    <img src={n.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-lg font-bold text-indigo-700">{n.title[0]}</div>
                  )}
                  {!n.read && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{n.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.createdAt.toLocaleString ? n.createdAt.toLocaleString() : n.createdAt}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

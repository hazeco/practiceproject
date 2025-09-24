
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMessageNotifications } from '../utils/notification';

const NotificationContext = createContext();


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // ฟังก์ชันโหลด noti
    const loadNoti = () => {
      fetchMessageNotifications().then((msgs) => {
        const readMap = JSON.parse(localStorage.getItem('admin_notification_read') || '{}');
        setNotifications(msgs.map(n => ({ ...n, read: !!readMap[n.id] })));
      });
    };
    loadNoti(); // โหลดครั้งแรก
    const interval = setInterval(loadNoti, 10000); // โหลดซ้ำทุก 10 วินาที
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // บันทึกลง localStorage
    const readMap = JSON.parse(localStorage.getItem('admin_notification_read') || '{}');
    readMap[id] = true;
    localStorage.setItem('admin_notification_read', JSON.stringify(readMap));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

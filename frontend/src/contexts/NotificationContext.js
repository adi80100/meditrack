import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}; 
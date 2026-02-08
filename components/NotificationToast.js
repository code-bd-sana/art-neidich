"use client";

import { useState, useEffect } from "react";

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNewNotification = (event) => {
      const payload = event.detail;
      const newNotification = {
        id: Date.now(),
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // Keep last 5

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id),
        );
      }, 5000);
    };

    window.addEventListener("new-notification", handleNewNotification);

    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        maxWidth: "400px",
      }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            animation: "slideIn 0.3s ease-out",
          }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong style={{ fontSize: "16px", color: "#333" }}>
              {notification.title}
            </strong>
            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#999",
              }}>
              ×
            </button>
          </div>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            {notification.body}
          </p>
          <small style={{ color: "#999", marginTop: "5px" }}>
            {notification.timestamp.toLocaleTimeString()}
          </small>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

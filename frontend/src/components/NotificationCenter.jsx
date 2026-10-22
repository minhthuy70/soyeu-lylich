import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState({
    profileCompletion: true,
    resumeUpdates: true,
    security: true,
    system: true,
    achievements: true,
    profileViews: true,
    resumeShares: true,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchPreferences();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/mark-read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setMessage('Notification marked as read');
      }
    } catch (error) {
      setMessage('Error marking notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })));
        setUnreadCount(0);
        setMessage('All notifications marked as read');
      }
    } catch (error) {
      setMessage('Error marking all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fetchUnreadCount();
        setMessage('Notification deleted');
      }
    } catch (error) {
      setMessage('Error deleting notification');
    }
  };

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(preferences),
      });
      if (response.ok) {
        setMessage('Preferences saved successfully');
      } else {
        setMessage('Failed to save preferences');
      }
    } catch (error) {
      setMessage('Error saving preferences');
    }
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      PROFILE_COMPLETION: '📝',
      RESUME_UPDATE: '📄',
      SECURITY: '🔒',
      SYSTEM: '⚙️',
      ACHIEVEMENT: '🏆',
      PROFILE_VIEW: '👁️',
      RESUME_SHARE: '📤',
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="notification-center loading">Loading notifications...</div>;
  }

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>Notifications</h2>
        <div className="notification-actions">
          <span className={`badge ${unreadCount > 0 ? 'active' : ''}`}>
            {unreadCount} unread
          </span>
          <button onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </button>
          <button onClick={() => setShowPreferences(!showPreferences)}>
            {showPreferences ? 'Close' : 'Preferences'}
          </button>
        </div>
      </div>

      {showPreferences && (
        <div className="notification-preferences">
          <h3>Notification Preferences</h3>
          <div className="preferences-grid">
            {Object.entries(preferences).map(([key, value]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => togglePreference(key)}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
              </label>
            ))}
          </div>
          <button onClick={savePreferences}>Save Preferences</button>
        </div>
      )}

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{formatDate(notification.createdAt)}</div>
              </div>
              <div className="notification-actions">
                {!notification.isRead && (
                  <button onClick={() => markAsRead(notification.id)}>Mark Read</button>
                )}
                <button onClick={() => deleteNotification(notification.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

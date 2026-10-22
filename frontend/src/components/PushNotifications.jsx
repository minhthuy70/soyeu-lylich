import React, { useState, useEffect } from 'react';
import './PushNotifications.css';

export default function PushNotifications() {
  const [permission, setPermission] = useState('default');
  const [preferences, setPreferences] = useState({
    enabled: true,
    categories: ['profile-views', 'profile-shares', 'achievement-unlocks'],
    quietHours: { start: '22:00', end: '08:00' },
  });
  const [testTitle, setTestTitle] = useState('');
  const [testBody, setTestBody] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check notification permission on mount
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setMessage('This browser does not support notifications');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Register service worker
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/sw.js');
          setMessage('Notifications enabled and service worker registered');
        } else {
          setMessage('Notifications enabled (service worker not supported)');
        }
      } else {
        setMessage('Notification permission denied');
      }
    } catch (error) {
      setMessage('Error requesting notification permission');
    }
  };

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/push-notifications/preferences', {
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

  const sendTestNotification = async () => {
    if (!testTitle || !testBody) {
      setMessage('Please enter title and body');
      return;
    }

    try {
      const response = await fetch('/api/push-notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ title: testTitle, body: testBody }),
      });

      if (response.ok) {
        setMessage('Test notification sent');
        setTestTitle('');
        setTestBody('');
      } else {
        setMessage('Failed to send test notification');
      }
    } catch (error) {
      setMessage('Error sending test notification');
    }
  };

  const toggleCategory = (category) => {
    setPreferences((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <div className="push-notifications">
      <div className="notifications-header">
        <h2>Push Notifications</h2>
        <p>Manage your notification preferences</p>
      </div>

      <div className="notifications-content">
        {/* Permission Section */}
        <div className="notification-section">
          <h3>Notification Permission</h3>
          <div className="permission-status">
            <span className={`status-badge ${permission}`}>
              {permission === 'granted' ? '✓ Enabled' : '✗ Disabled'}
            </span>
            {permission !== 'granted' && (
              <button onClick={requestPermission}>Enable Notifications</button>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="notification-section">
          <h3>Notification Preferences</h3>
          <div className="preferences-form">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.enabled}
                  onChange={(e) =>
                    setPreferences({ ...preferences, enabled: e.target.checked })
                  }
                />
                Enable Notifications
              </label>
            </div>

            <div className="form-group">
              <label>Notification Categories</label>
              <div className="category-options">
                {['profile-views', 'profile-shares', 'achievement-unlocks', 'system-updates'].map(
                  (category) => (
                    <label key={category}>
                      <input
                        type="checkbox"
                        checked={preferences.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      {category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Quiet Hours</label>
              <div className="quiet-hours">
                <input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      quietHours: { ...preferences.quietHours, start: e.target.value },
                    })
                  }
                />
                <span>to</span>
                <input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      quietHours: { ...preferences.quietHours, end: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <button onClick={savePreferences}>Save Preferences</button>
          </div>
        </div>

        {/* Test Section */}
        <div className="notification-section">
          <h3>Test Notification</h3>
          <div className="test-form">
            <input
              type="text"
              placeholder="Notification title"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
            />
            <textarea
              placeholder="Notification body"
              value={testBody}
              onChange={(e) => setTestBody(e.target.value)}
              rows={3}
            />
            <button onClick={sendTestNotification}>Send Test Notification</button>
          </div>
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

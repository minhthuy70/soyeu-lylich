import React from 'react';
import './OfflinePage.css';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="offline-page">
      <div className="offline-content">
        <div className="offline-icon">📡</div>
        <h1>You're Offline</h1>
        <p>
          It looks like you've lost your internet connection. Please check your
          network settings and try again.
        </p>
        <button onClick={handleRetry} className="retry-button">
          Retry Connection
        </button>
        <div className="offline-tips">
          <h3>Troubleshooting Tips:</h3>
          <ul>
            <li>Check your internet connection</li>
            <li>Try refreshing the page</li>
            <li>Check if your router is working</li>
            <li>Try a different browser or device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

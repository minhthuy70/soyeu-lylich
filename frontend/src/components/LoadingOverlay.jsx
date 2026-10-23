import React from 'react';
import './LoadingOverlay.css';

export default function LoadingOverlay({ message = 'Loading...', transparent = false }) {
  return (
    <div className={`loading-overlay ${transparent ? 'transparent' : ''}`}>
      <div className="loading-overlay__content">
        <div className="loading-overlay__spinner"></div>
        <p className="loading-overlay__message">{message}</p>
      </div>
    </div>
  );
}

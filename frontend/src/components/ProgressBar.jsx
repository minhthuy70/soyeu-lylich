import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ progress = 0, label = '', showPercentage = true, color = 'blue' }) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-bar-container">
      {label && <span className="progress-bar__label">{label}</span>}
      <div className="progress-bar-wrapper">
        <div
          className={`progress-bar progress-bar--${color}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {showPercentage && percentage > 5 && (
            <span className="progress-bar__text">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

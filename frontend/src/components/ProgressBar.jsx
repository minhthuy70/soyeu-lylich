import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ progress, size = 'medium', color = 'blue', showLabel = true }) {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'progress-small';
      case 'medium':
        return 'progress-medium';
      case 'large':
        return 'progress-large';
      default:
        return 'progress-medium';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'progress-blue';
      case 'green':
        return 'progress-green';
      case 'red':
        return 'progress-red';
      case 'yellow':
        return 'progress-yellow';
      default:
        return 'progress-blue';
    }
  };

  return (
    <div className="progress-container">
      {showLabel && (
        <span className="progress-label">{Math.round(progress)}%</span>
      )}
      <div className={`progress-bar ${getSizeClass()}`}>
        <div
          className={`progress-fill ${getColorClass()}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

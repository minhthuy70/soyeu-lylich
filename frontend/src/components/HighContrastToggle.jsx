import React, { useState, useEffect } from 'react';
import './HighContrastToggle.css';

export default function HighContrastToggle({ enabled = false, onChange }) {
  const [isHighContrast, setIsHighContrast] = useState(enabled);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const handleToggle = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    onChange(newValue);
  };

  return (
    <div className="high-contrast-toggle">
      <label className="high-contrast-toggle__label">
        <input
          type="checkbox"
          checked={isHighContrast}
          onChange={handleToggle}
          className="high-contrast-toggle__input"
        />
        <span className="high-contrast-toggle__slider" />
        <span className="high-contrast-toggle__text">High Contrast Mode</span>
      </label>
      <p className="high-contrast-toggle__description">
        Increases contrast for better visibility
      </p>
    </div>
  );
}

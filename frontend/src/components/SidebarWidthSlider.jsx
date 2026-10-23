import React from 'react';
import './SidebarWidthSlider.css';

export default function SidebarWidthSlider({ value = 250, onChange, min = 180, max = 400, step = 10 }) {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className="sidebar-width-slider">
      <label className="sidebar-width-slider__label">
        Sidebar Width: <span className="sidebar-width-slider__value">{value}px</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="sidebar-width-slider__input"
      />
      <div className="sidebar-width-slider__preview">
        <div
          className="sidebar-width-slider__preview-bar"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

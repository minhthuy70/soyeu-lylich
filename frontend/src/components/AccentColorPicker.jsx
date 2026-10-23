import React, { useState } from 'react';
import './AccentColorPicker.css';

const PRESET_COLORS = [
  { name: 'Blue', value: '#007bff' },
  { name: 'Green', value: '#28a745' },
  { name: 'Red', value: '#dc3545' },
  { name: 'Purple', value: '#6f42c1' },
  { name: 'Orange', value: '#fd7e14' },
  { name: 'Teal', value: '#20c997' },
  { name: 'Pink', value: '#e83e8c' },
  { name: 'Indigo', value: '#6610f2' },
];

export default function AccentColorPicker({ value = '#007bff', onChange }) {
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color) => {
    setCustomColor(color);
    onChange(color);
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="accent-color-picker">
      <label className="accent-color-picker__label">Accent Color</label>
      <div className="accent-color-picker__presets">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            className={`accent-color-picker__preset ${
              customColor === color.value ? 'accent-color-picker__preset--active' : ''
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorSelect(color.value)}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
      <div className="accent-color-picker__custom">
        <label className="accent-color-picker__custom-label">Custom Color:</label>
        <input
          type="color"
          value={customColor}
          onChange={handleCustomColorChange}
          className="accent-color-picker__input"
        />
        <input
          type="text"
          value={customColor}
          onChange={(e) => handleCustomColorChange(e.target.value)}
          className="accent-color-picker__text-input"
          placeholder="#007bff"
        />
      </div>
    </div>
  );
}

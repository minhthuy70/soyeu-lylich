import React from 'react';
import './LayoutCustomizer.css';

const LAYOUT_OPTIONS = [
  { id: 'sidebar-left', name: 'Sidebar Left', icon: '◀' },
  { id: 'sidebar-right', name: 'Sidebar Right', icon: '▶' },
  { id: 'full-width', name: 'Full Width', icon: '⬌' },
  { id: 'centered', name: 'Centered', icon: '⬍' },
];

const CONTENT_WIDTH_OPTIONS = [
  { id: 'narrow', name: 'Narrow', value: '800px' },
  { id: 'normal', name: 'Normal', value: '1200px' },
  { id: 'wide', name: 'Wide', value: '1400px' },
  { id: 'full', name: 'Full', value: '100%' },
];

export default function LayoutCustomizer({ layout = 'sidebar-left', contentWidth = 'normal', onLayoutChange, onContentWidthChange }) {
  return (
    <div className="layout-customizer">
      <div className="layout-customizer__section">
        <h3 className="layout-customizer__title">Sidebar Position</h3>
        <div className="layout-customizer__options">
          {LAYOUT_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`layout-customizer__option ${
                layout === option.id ? 'layout-customizer__option--active' : ''
              }`}
              onClick={() => onLayoutChange(option.id)}
            >
              <span className="layout-customizer__icon">{option.icon}</span>
              <span className="layout-customizer__name">{option.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="layout-customizer__section">
        <h3 className="layout-customizer__title">Content Width</h3>
        <div className="layout-customizer__options">
          {CONTENT_WIDTH_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`layout-customizer__option ${
                contentWidth === option.id ? 'layout-customizer__option--active' : ''
              }`}
              onClick={() => onContentWidthChange(option.id)}
            >
              <span className="layout-customizer__name">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

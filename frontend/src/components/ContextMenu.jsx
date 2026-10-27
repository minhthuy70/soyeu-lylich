import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

export default function ContextMenu({ items, onClose, position }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleItemClick = (item) => {
    item.onClick();
    onClose();
  };

  const positionStyle = {
    top: position?.y || 0,
    left: position?.x || 0,
  };

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={positionStyle}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`context-menu-item ${item.divider ? 'divider' : ''} ${item.danger ? 'danger' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          {item.icon && <span className="context-menu-icon">{item.icon}</span>}
          <span className="context-menu-label">{item.label}</span>
          {item.shortcut && <span className="context-menu-shortcut">{item.shortcut}</span>}
        </div>
      ))}
    </div>
  );
}

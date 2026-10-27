import React, { useState, useRef } from 'react';
import './Tooltip.css';

export default function Tooltip({ children, content, position = 'top', delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'tooltip-top';
      case 'bottom':
        return 'tooltip-bottom';
      case 'left':
        return 'tooltip-left';
      case 'right':
        return 'tooltip-right';
      default:
        return 'tooltip-top';
    }
  };

  return (
    <div
      className="tooltip-container"
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip ${getPositionClasses()}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

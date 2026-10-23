import React, { useState, useEffect, useRef } from 'react';
import './BottomSheet.css';

export default function BottomSheet({ isOpen, onClose, children, height = 'auto' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  return (
    <>
      {isOpen && (
        <div className="bottom-sheet-overlay" onClick={onClose} />
      )}
      <div
        ref={sheetRef}
        className={`bottom-sheet ${isOpen ? 'bottom-sheet--open' : ''}`}
        style={{
          transform: isOpen
            ? `translateY(${currentY}px)`
            : 'translateY(100%)',
          height: height === 'auto' ? 'auto' : height,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bottom-sheet__handle" />
        <div className="bottom-sheet__content">{children}</div>
      </div>
    </>
  );
}

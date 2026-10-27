import React, { useEffect } from 'react';
import './Modal.css';
import { useFocusTrap } from '../hooks/useAccessibility.js';

export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'modal-small';
      case 'medium':
        return 'modal-medium';
      case 'large':
        return 'modal-large';
      case 'fullscreen':
        return 'modal-fullscreen';
      default:
        return 'modal-medium';
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`modal ${getSizeClass()}`}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

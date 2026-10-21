import React, { useEffect } from 'react';
import './Modal.css';
import { useFocusTrap } from '../hooks/useAccessibility.js';

export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRef = useFocusTrap(isOpen);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className={`modal ${getSizeClass()}`}>
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

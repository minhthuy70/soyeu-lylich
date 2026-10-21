import React from 'react';
import Modal from './Modal.jsx';
import './ConfirmDialog.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'danger':
        return 'confirm-danger';
      case 'warning':
        return 'confirm-warning';
      case 'info':
        return 'confirm-info';
      default:
        return 'confirm-danger';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`btn ${getVariantClass()}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

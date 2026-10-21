import React, { useState, useRef } from 'react';
import './DragDrop.css';

export default function DragDrop({ children, onDrop, onDragOver, accept }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const dropZoneRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCount((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCount((prev) => prev - 1);
    if (dragCount - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) {
      onDragOver(e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCount(0);

    const files = Array.from(e.dataTransfer.files);
    
    if (accept) {
      const acceptedFiles = files.filter((file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return accept.includes(fileExtension);
      });
      if (onDrop) {
        onDrop(acceptedFiles);
      }
    } else {
      if (onDrop) {
        onDrop(files);
      }
    }
  };

  return (
    <div
      ref={dropZoneRef}
      className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <span className="drag-icon">📁</span>
            <p>Drop files here</p>
          </div>
        </div>
      )}
    </div>
  );
}

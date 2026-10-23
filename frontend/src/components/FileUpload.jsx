import React, { useState, useRef } from 'react';
import './FileUpload.css';

export default function FileUpload({ onUploadSuccess, uploadType = 'image' }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const inputRef = useRef(null);

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const allowedTypes = uploadType === 'image' ? allowedImageTypes : allowedDocTypes;

  const validateFile = (file) => {
    if (!file) {
      setMessage('No file selected');
      return false;
    }

    if (file.size > maxFileSize) {
      setMessage(`File size exceeds maximum limit of ${maxFileSize / 1024 / 1024}MB`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setMessage(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setMessage('');
    setUploadedFile(null);

    if (!validateFile(file)) {
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const endpoint = uploadType === 'image' ? '/api/upload/image' : '/api/upload/document';

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setUploadedFile(response);
          setMessage('File uploaded successfully');
          if (onUploadSuccess) {
            onUploadSuccess(response);
          }
        } else {
          setMessage('Failed to upload file');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setMessage('Error uploading file');
        setUploading(false);
      });

      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
      xhr.send(formData);
    } catch (error) {
      setMessage('Error uploading file');
      setUploading(false);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleDelete = async () => {
    if (!uploadedFile) return;

    try {
      const response = await fetch(`/api/upload/${uploadedFile.fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        setUploadedFile(null);
        setMessage('File deleted successfully');
      } else {
        setMessage('Failed to delete file');
      }
    } catch (error) {
      setMessage('Error deleting file');
    }
  };

  return (
    <div className="file-upload">
      <div
        className={`drop-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept={allowedTypes.join(',')}
          style={{ display: 'none' }}
        />
        <div className="drop-zone-content">
          <p className="drop-zone-text">
            {uploading ? (
              <span>Uploading... {Math.round(uploadProgress)}%</span>
            ) : (
              <>
                Drag and drop your file here, or{' '}
                <button onClick={onButtonClick} disabled={uploading}>
                  browse
                </button>
              </>
            )}
          </p>
          <p className="drop-zone-hint">
            Maximum file size: {maxFileSize / 1024 / 1024}MB
          </p>
          <p className="drop-zone-hint">
            Allowed types: {allowedTypes.join(', ')}
          </p>
        </div>
      </div>

      {uploadedFile && (
        <div className="uploaded-file">
          <div className="file-info">
            <strong>Uploaded:</strong> {uploadedFile.originalName}
            <br />
            <strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB
            <br />
            <strong>URL:</strong> {uploadedFile.url}
          </div>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

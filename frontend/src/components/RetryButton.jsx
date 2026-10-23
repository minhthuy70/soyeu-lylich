import React, { useState } from 'react';
import './RetryButton.css';

export default function RetryButton({ onRetry, isRetrying, retryCount = 0, maxRetries = 3 }) {
  const [retryDelay, setRetryDelay] = useState(1000);

  const handleRetry = async () => {
    if (isRetrying || retryCount >= maxRetries) {
      return;
    }

    await onRetry(retryDelay);
  };

  const canRetry = !isRetrying && retryCount < maxRetries;

  return (
    <button
      className={`retry-button ${!canRetry ? 'disabled' : ''}`}
      onClick={handleRetry}
      disabled={!canRetry}
    >
      {isRetrying ? (
        <span className="retry-button__text">Retrying...</span>
      ) : (
        <>
          <span className="retry-button__icon">↻</span>
          <span className="retry-button__text">
            {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : 'Retry'}
          </span>
        </>
      )}
    </button>
  );
}

import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-box">
      <span className="error-icon">⚠</span>
      <p>{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
};

export default ErrorMessage;

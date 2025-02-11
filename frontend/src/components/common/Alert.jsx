import React from 'react';

const Alert = ({ type, message }) => {
  const renderIcon = () => {
    switch (type) {
      case 'error':
        return <span className="alert-icon">⚠️</span>;
      case 'success':
        return <span className="alert-icon">✅</span>;
      case 'loading':
        return <div className="loading-spinner" />;
      default:
        return null;
    }
  };

  const renderMessage = () => {
    if (type === 'loading') {
      return <span>{message}</span>;
    }
    return <p>{message}</p>;
  };

  return (
    <div className={`alert alert-${type}`}>
      {renderIcon()}
      {renderMessage()}
    </div>
  );
};

export default Alert;

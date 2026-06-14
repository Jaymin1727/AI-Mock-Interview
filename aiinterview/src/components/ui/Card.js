import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hover = true, padding = true }) => {
  return (
    <div className={`card glass ${hover ? 'glass-hover' : ''} ${padding ? 'card-padding' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

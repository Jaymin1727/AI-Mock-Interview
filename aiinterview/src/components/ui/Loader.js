import React from 'react';
import './Loader.css';

const Loader = ({ size = 'md', text = '' }) => {
  return (
    <div className="loader-container">
      <div className={`spinner spinner-${size}`} />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;

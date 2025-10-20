import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div
      className="progress-bar-container z-50"
      style={{ display: progress === 100 ? 'none' : 'block' }}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          transition: 'width 0.2s',
        }}
      />
    </div>
  );
};

export default ProgressBar;

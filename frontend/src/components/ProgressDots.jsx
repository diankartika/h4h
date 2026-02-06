// src/components/ProgressDots.jsx
import React from 'react';

export const ProgressDots = ({ total = 3, current = 0 }) => {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current
              ? 'w-8 bg-gradient-button'
              : 'w-2 bg-gray-300'
          }`}
          aria-label={`Step ${index + 1} of ${total}${index === current ? ' (current)' : ''}`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;

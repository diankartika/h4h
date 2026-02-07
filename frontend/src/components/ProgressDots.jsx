// components/ProgressDots.jsx
import React from 'react';

export const ProgressDots = ({ total, current }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${index === current 
              ? 'bg-purple-600 w-6' 
              : 'bg-gray-300'
            }
          `}
        />
      ))}
    </div>
  );
};
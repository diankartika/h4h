// components/GradientButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const GradientButton = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-full
        bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600
        text-white font-medium text-sm
        shadow-lg shadow-purple-500/30
        hover:shadow-xl hover:shadow-purple-500/40
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};
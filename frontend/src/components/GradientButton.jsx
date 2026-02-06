// src/components/GradientButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const GradientButton = ({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary', // primary, secondary
  className = '',
  ...props 
}) => {
  const baseClasses = "px-6 py-3 rounded-full font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-button hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;

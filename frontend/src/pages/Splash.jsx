import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import fullLogo from '../assets/full-logo.png';

const Splash = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    const navTimer = setTimeout(() => {
      navigate('/onboarding');
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-screen flex items-center justify-center bg-white fixed inset-0 z-50"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="relative flex items-center justify-center"
          >
            {/* Subtle glow effect behind logo */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-[305px] h-[305px] bg-gradient-to-br from-purple-400 via-cyan-400 to-green-400 rounded-full blur-3xl"
            />
            
            <img 
              src={fullLogo} 
              alt="h4h logo" 
              className="relative w-[305px] h-[305px] object-contain shrink-0"
              style={{ aspectRatio: '1/1' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splash;
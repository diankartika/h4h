import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProgressDots } from '../components/ProgressDots';
import logoShort from '../assets/logo-short.png';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-8 py-12 bg-white">
      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full">
        {/* Logo with gradient blur effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          {/* Gradient blur background */}
          <div className="absolute inset-0 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 rounded-full blur-3xl opacity-60" />
          </div>
          
          {/* Logo image */}
          <img 
            src={logoShort} 
            alt="h4h logo" 
            className="relative w-[160px] h-[160px] object-contain z-10"
          />
        </motion.div>

        {/* Title with gradient text */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base font-bold text-black mb-6 leading-normal"
        >
          Welcome to{' '}
          <span 
            className="font-bold"
            style={{
              background: 'linear-gradient(90deg, #000 0%, #715579 50%, #96C8F4 75%, #57EFBD 87.5%, #E2A9F1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            human4human
          </span>
          {' '}project
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm font-light leading-normal mb-8 max-w-xs"
          style={{ color: 'rgba(0, 0, 0, 0.65)' }}
        >
          We're building AI systems you can trust
        </motion.p>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ProgressDots total={3} current={0} />
        </motion.div>

        {/* Description text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-[11px] font-light leading-normal max-w-sm text-center"
          style={{ color: 'rgba(52, 52, 52, 0.65)' }}
        >
          <p>
            This project helps us understand how uncertainty markers affect your trust in AI answers.
          </p>
          <p className="mt-2">
            You can ask 5 questions (limited by research resources) to explore answers with uncertainty markers and see answers with special markers that show how confident the AI is.
          </p>
        </motion.div>
      </div>

      {/* Button - custom size and gradient */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full flex justify-center"
      >
        <button
          onClick={() => navigate('/onboarding/2')}
          className="flex items-center justify-center gap-1.5 rounded-lg text-white font-semibold text-sm"
          style={{
            width: '83px',
            height: '27px',
            background: 'linear-gradient(90deg, #57EFBD 25%, #77DBD9 37.5%, #96C8F4 50%, #BCB9F3 75%, #E2A9F1 100%)',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M0.530273 0.530327L5.53027 5.53033L0.530273 10.5303" stroke="white" strokeWidth="1.5"/>
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default Onboarding;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProgressDots } from '../components/ProgressDots';
import logoShort from '../assets/logo-short.png';
import imageSource from '../assets/image-source.png';
import h4hExampleOutput from '../assets/h2hexampleoutput.png';

const OnboardingDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-8 bg-gradient-to-b from-white via-purple-50/20 to-white">
      {/* Main content - scrollable */}
      <div className="flex-1 flex flex-col items-center justify-end w-full max-w-md pb-6">
        {/* Logo with gradient blur */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          {/* Gradient blur background */}
          <div className="absolute inset-0 w-[120px] h-[120px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 rounded-full blur-2xl opacity-50" />
          </div>
          
          <img 
            src={logoShort} 
            alt="h4h logo" 
            className="relative w-[77px] h-[77px] object-contain z-10"
            style={{ aspectRatio: '1/1' }}
          />
        </motion.div>

        {/* Title box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center mb-8"
          style={{
            width: '263px',
            height: '32px',
            borderRadius: '8px',
            background: '#FFF',
            boxShadow: '0 4px 20.7px 0 rgba(226, 169, 241, 0.45)'
          }}
        >
          <h2 
            className="font-semibold"
            style={{
              color: '#000',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 'normal'
            }}
          >
            What are uncertainty markers?
          </h2>
        </motion.div>

        {/* Conversation flow */}
        <div className="flex flex-col w-full max-w-[310px] gap-4 mb-6 relative">
          {/* Question box - without number */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-start"
          >
            <div
              className="flex items-center px-4 py-3"
              style={{
                width: '263px',
                minHeight: '72px',
                borderRadius: '8px',
                border: '1px solid rgba(226, 169, 241, 0.32)',
                background: '#FFF'
              }}
            >
              <p
                style={{
                  color: 'rgba(0, 0, 0, 0.65)',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 300,
                  lineHeight: '1.5'
                }}
              >
                Many people don't realize that AI is not transparent, yet. Actually sometimes AI isn't sure about its answers.
              </p>
            </div>
          </motion.div>

          {/* Answer with checkmark overlapping */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-end relative"
          >
            {/* Answer box */}
            <div
              className="flex items-center px-4 py-3 relative"
              style={{
                width: '230px',
                minHeight: '55px',
                borderRadius: '8px',
                border: '1px solid rgba(226, 169, 241, 0.32)',
                background: 'rgba(226, 169, 241, 0.45)'
              }}
            >
              <p
                style={{
                  width: '100%',
                  color: 'rgba(0, 0, 0, 0.65)',
                  textAlign: 'right',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 300,
                  lineHeight: '1.5',
                  paddingRight: '8px'
                }}
              >
                So, we add markers to show you how confident it is.
              </p>

              {/* Checkmark overlapping the box - better positioned */}
              <div 
                className="absolute" 
                style={{ 
                  width: '30px', 
                  height: '30px',
                  top: '-8px',
                  right: '-8px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#E2A9F1"/>
                  <circle cx="15" cy="15" r="14.5" stroke="#E2A9F1" strokeOpacity="0.45"/>
                  <path d="M9 15l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-6"
        >
          <ProgressDots total={3} current={1} />
        </motion.div>

        {/* Example section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col items-center gap-3 mb-4 w-full"
        >
          {/* Example with disclaimer - better spacing */}
          <div className="relative w-[324px] mb-1">
            {/* Example label and disclaimer in a flex container */}
            <div className="flex items-center gap-2 mb-1">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '68px',
                  height: '22px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 0, 4, 0.32)',
                  background: '#FFF'
                }}
              >
                <span
                  style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    textAlign: 'center',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontWeight: 300,
                    lineHeight: 'normal'
                  }}
                >
                  example
                </span>
              </div>

              {/* Disclaimer beside example with proper spacing */}
              <p
                style={{
                  color: 'rgba(0, 0, 0, 0.65)',
                  fontFamily: 'Inter',
                  fontSize: '8px',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 'normal',
                  marginLeft: '4px'
                }}
              >
                *This is a real answer that generated by Gemini 2.5 flash model
              </p>
            </div>

            {/* Example image box */}
            <div
              className="flex items-center justify-center p-2"
              style={{
                width: '324px',
                minHeight: '86px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 0, 4, 0.32)',
                background: '#FFF'
              }}
            >
              <img 
                src={imageSource} 
                alt="example source"
                className="max-w-full h-auto"
                style={{
                  maxWidth: '304px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>

          {/* VS text */}
          <p
            style={{
              color: 'rgba(0, 0, 0, 0.65)',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 300,
              lineHeight: 'normal',
              margin: '4px 0'
            }}
          >
            vs.
          </p>

          {/* h4h output - better positioned */}
          <div className="relative w-[324px]">
            {/* h4h output label aligned to the right */}
            <div className="flex justify-end mb-1">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '74px',
                  height: '22px',
                  borderRadius: '8px',
                  border: '1px solid #96C8F4',
                  background: '#FFF'
                }}
              >
                <span
                  style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    textAlign: 'center',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 300,
                    lineHeight: 'normal'
                  }}
                >
                  h4h output
                </span>
              </div>
            </div>

            {/* h4h output box */}
            <div
              className="flex items-center justify-center p-2"
              style={{
                width: '324px',
                minHeight: '104px',
                borderRadius: '8px',
                border: '1px solid #96C8F4',
                background: '#FFF'
              }}
            >
              <img 
                src={h4hExampleOutput} 
                alt="h4h output example"
                className="max-w-full h-auto"
                style={{
                  maxWidth: '300px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Next button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full flex justify-center pb-4"
      >
        <button
          onClick={() => navigate('/signin')}
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

export default OnboardingDetail;
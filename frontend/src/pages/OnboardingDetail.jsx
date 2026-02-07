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
    <div className="min-h-screen flex flex-col items-center justify-between px-8 py-12 bg-white">
      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-md">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <img 
            src={logoShort} 
            alt="h4h logo" 
            className="w-[77px] h-[77px] object-contain"
            style={{ aspectRatio: '1/1' }}
          />
        </motion.div>

        {/* Title box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center mb-6"
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
              width: '220px',
              height: '25px',
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
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Question with number 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-start gap-3"
          >
            {/* Number 1 circle */}
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="15" fill="white"/>
              <circle cx="15" cy="15" r="14.5" stroke="#E2A9F1" strokeOpacity="0.45"/>
              <text x="15" y="20" textAnchor="middle" fill="#000" fontSize="14" fontWeight="600" fontFamily="Inter">1</text>
            </svg>

            {/* Question box */}
            <div
              className="flex items-center justify-center px-3"
              style={{
                width: '263px',
                height: '72px',
                borderRadius: '8px',
                border: '1px solid rgba(226, 169, 241, 0.32)',
                background: '#FFF'
              }}
            >
              <p
                style={{
                  width: '242px',
                  color: 'rgba(0, 0, 0, 0.65)',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 300,
                  lineHeight: 'normal'
                }}
              >
                Many people don't realize that AI is not transparent, yet. Actually sometimes AI isn't sure about its answers.
              </p>
            </div>
          </motion.div>

          {/* Answer with checkmark */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-start gap-3 self-end"
          >
            {/* Answer box */}
            <div
              className="flex items-center justify-center px-3"
              style={{
                width: '222px',
                height: '55px',
                borderRadius: '8px',
                border: '1px solid rgba(226, 169, 241, 0.32)',
                background: 'rgba(226, 169, 241, 0.45)'
              }}
            >
              <p
                style={{
                  width: '201px',
                  color: 'rgba(0, 0, 0, 0.65)',
                  textAlign: 'right',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 300,
                  lineHeight: 'normal'
                }}
              >
                So, we add markers to show you how confident it is.
              </p>
            </div>

            {/* Checkmark circle */}
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="15" fill="#E2A9F1"/>
              <circle cx="15" cy="15" r="14.5" stroke="#E2A9F1" strokeOpacity="0.45"/>
              <path d="M9 15l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </motion.div>
        </div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-2"
        >
          <ProgressDots total={3} current={1} />
        </motion.div>

        {/* Example disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-6"
          style={{
            width: '283px',
            color: 'rgba(0, 0, 0, 0.65)',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '8px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 'normal'
          }}
        >
          *This is a real answer that generated by Gemini 2.5 flash model
        </motion.p>

        {/* Example section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col items-center gap-3 mb-6"
        >
          {/* Example label */}
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
                width: '58px',
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

          {/* Example image box */}
          <div
            className="flex items-center justify-center p-2"
            style={{
              width: '324px',
              height: '86px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 0, 4, 0.32)',
              background: '#FFF'
            }}
          >
            <img 
              src={imageSource} 
              alt="example source"
              style={{
                width: '304px',
                height: '72px',
                aspectRatio: '38/9',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* VS text */}
          <p
            style={{
              width: '58px',
              color: 'rgba(0, 0, 0, 0.65)',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 300,
              lineHeight: 'normal'
            }}
          >
            vs.
          </p>

          {/* h4h output label */}
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
                width: '70px',
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

          {/* h4h output box */}
          <div
            className="flex items-center justify-center p-2"
            style={{
              width: '324px',
              height: '104px',
              borderRadius: '8px',
              border: '1px solid #96C8F4',
              background: '#FFF'
            }}
          >
            <img 
              src={h4hExampleOutput} 
              alt="h4h output example"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Next button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full flex justify-center"
      >
        <button
          onClick={() => navigate('/onboarding/3')}
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
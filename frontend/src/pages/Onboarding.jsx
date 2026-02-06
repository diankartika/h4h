// src/pages/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientButton } from '../components/GradientButton';
import { ProgressDots } from '../components/ProgressDots';
import { MarkerBadge } from '../components/MarkerBadge';

const slides = [
  {
    title: 'Welcome to human4human project',
    subtitle: "We're building AI systems you can trust",
    content: (
      <div className="space-y-4 text-gray-700">
        <p>This project helps us understand how uncertainty markers affect your trust in AI answers.</p>
        <p>You'll get <strong>5 questions</strong> (limited by research resources) and see answers with special markers that show how confident the AI is.</p>
      </div>
    ),
  },
  {
    title: 'What are uncertainty markers?',
    subtitle: null,
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-gray-700">Many people don't realize that AI is not transparent, yet. Actually, sometimes AI isn't sure about its answers.</p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-pink-100 border border-pink-300 rounded-lg p-4 flex items-center gap-3"
          >
            <span className="text-2xl">✓</span>
            <p className="text-sm text-pink-900">
              So, we add markers to show you how confident it is.
            </p>
          </motion.div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <p className="text-xs text-gray-500">*Example from Gemini 2.5 Flash model</p>
          
          <div className="space-y-2 text-sm">
            <p>
              "Dian Kartika Putri is an Indonesian singer{' '}
              <MarkerBadge type="speculative" pScore={0.53} footnoteId={1} />
            </p>
            
            <div className="text-center text-gray-400 font-bold">vs.</div>
            
            <p>
              "Jakarta is the capital of Indonesia{' '}
              <MarkerBadge type="verified" pScore={0.95} footnoteId={2} />
            </p>
          </div>
          
          <p className="text-center text-xs font-semibold text-gray-600 mt-4">
            Colors = Confidence level!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'How this project works?',
    subtitle: null,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-button flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ask 5 Questions</h3>
              <p className="text-sm text-gray-600">Any topic you're curious about</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-button flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Read Marked Answers</h3>
              <p className="text-sm text-gray-600">See confidence levels</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-button flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Share Your Feedback</h3>
              <p className="text-sm text-gray-600">Help improve AI transparency</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          <p>⏱️ Takes ~10 minutes</p>
          <p className="mt-2 text-xs italic">
            This is actually a research project for Dian's undergraduate thesis. She's very curious about UX-HCI, especially for LLM trustworthiness and uncertainty outputs.
          </p>
        </div>
      </div>
    ),
  },
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/signin');
    }
  };
  
  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const handleSkip = () => {
    navigate('/signin');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="w-20" />
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Skip
        </button>
      </div>
      
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-h4h flex items-center justify-center">
          <span className="text-3xl font-bold text-white">h4h</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        <div className="w-full max-w-md flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {slides[currentSlide].title}
              </h2>
              
              {slides[currentSlide].subtitle && (
                <p className="text-gray-600 mb-6">
                  {slides[currentSlide].subtitle}
                </p>
              )}
              
              <div className="flex-1">
                {slides[currentSlide].content}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="mt-8 space-y-4">
            <ProgressDots total={3} current={currentSlide} />
            
            <div className="flex gap-3">
              {currentSlide > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  ← Back
                </button>
              )}
              
              <GradientButton
                onClick={handleNext}
                className="flex-1"
              >
                {currentSlide < slides.length - 1 ? 'Next →' : "Let's Go! →"}
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

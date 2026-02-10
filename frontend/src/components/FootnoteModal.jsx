// components/FootnoteModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FootnoteModal = ({ isOpen, onClose, footnotes }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative overflow-hidden"
          style={{
            width: '299px',
            height: '357px',
            borderRadius: '12px',
            border: '1px solid #96C8F4',
            background: '#F2F2F2'
          }}
        >
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <h2
              style={{
                width: '108px',
                height: '17px',
                color: '#000',
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: 700,
                lineHeight: 'normal'
              }}
            >
              Footnote Details
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M0.75 7.82L7.822 0.75M0.75 0.75L7.822 7.82" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div 
            className="overflow-y-auto h-full px-4 pt-14 pb-4"
            style={{ maxHeight: '357px' }}
          >
            <div
              style={{
                fontFamily: 'Inter',
                fontSize: '10px',
                lineHeight: '14px'
              }}
            >
              <p 
                className="mb-3"
                style={{
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                UNCERTAINTY ANNOTATIONS
              </p>

              {footnotes && footnotes.map((fn, index) => (
                <div key={index} className="mb-4">
                  <p 
                    className="mb-1"
                    style={{
                      color: '#000',
                      fontWeight: 600,
                      fontSize: '10px'
                    }}
                  >
                    ({fn.id}) {fn.explanation}
                  </p>
                  <div 
                    className="ml-4 space-y-1"
                    style={{
                      color: '#333',
                      fontSize: '9px',
                      fontWeight: 400
                    }}
                  >
                    <p>• Prediction: {fn.prediction || 'NOT ENOUGH INFO'}</p>
                    <p>• Confidence: {fn.confidence || '0.00'}</p>
                    <p>• Type: {fn.type || 'evidential'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FootnoteModal;
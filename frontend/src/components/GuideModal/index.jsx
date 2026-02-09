// components/GuideModal/index.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';

const TOTAL_PAGES = 6;

export const GuideModal = ({ isOpen, onClose, startPage = 0 }) => {
  const [currentPage, setCurrentPage] = useState(startPage);

  const nextPage = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isOpen) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 0: return <Page1 />;
      case 1: return <Page2 />;
      case 2: return <Page3 />;
      case 3: return <Page4 />;
      case 4: return <Page5 />;
      case 5: return <Page6 />;
      default: return <Page1 />;
    }
  };

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
            height: '400px',
            borderRadius: '12px',
            border: '1px solid #96C8F4',
            background: '#FEFAFF'
        }}
        >
          {/* Header with guidebook icon, title, and close */}
          <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M8.75 0H1.25C0.5625 0 0 0.54 0 1.2V10.8C0 11.46 0.5625 12 1.25 12H8.75C9.4375 12 10 11.46 10 10.8V1.2C10 0.54 9.4375 0 8.75 0ZM1.25 1.2H4.375V6L2.8125 5.1L1.25 6V1.2Z" fill="black"/>
              </svg>
              <span
                style={{
                  color: '#000',
                  fontFamily: 'Inter',
                  fontSize: '10px',
                  fontWeight: 400,
                  lineHeight: 'normal'
                }}
              >
                Quick Guide to h4h
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-lg font-bold text-gray-700 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto h-full px-6 pt-12 pb-16" style={{ maxHeight: '400px' }}>
            {renderPage()}
            </div>

        {/* Fixed Bottom Navigation */}
        <div className="absolute bottom-6 left-0 right-0 px-6">  {/* Changed from bottom-3 to bottom-6 */}
        <div className="flex justify-between items-center">
            <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="disabled:opacity-0"
            style={{ visibility: currentPage === 0 ? 'hidden' : 'visible' }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none" className="rotate-180">
                <path d="M-0.000161171 1.05997L1.06084 -2.86102e-05L6.83984 5.77697C6.93299 5.86954 7.00692 5.97961 7.05737 6.10086C7.10782 6.22212 7.13379 6.35214 7.13379 6.48347C7.13379 6.6148 7.10782 6.74483 7.05737 6.86608C7.00692 6.98733 6.93299 7.0974 6.83984 7.18997L1.06084 12.97L0.000838757 11.91L5.42484 6.48497L-0.000161171 1.05997Z" fill="black"/>
            </svg>
            </button>

            <span
            style={{
                color: '#878787',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '6px',
                fontWeight: 400,
                lineHeight: 'normal'
            }}
            >
            page {currentPage + 1} out of {TOTAL_PAGES}
            </span>

            <button onClick={nextPage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
                <path d="M-0.000161171 1.05997L1.06084 -2.86102e-05L6.83984 5.77697C6.93299 5.86954 7.00692 5.97961 7.05737 6.10086C7.10782 6.22212 7.13379 6.35214 7.13379 6.48347C7.13379 6.6148 7.10782 6.74483 7.05737 6.86608C7.00692 6.98733 6.93299 7.0974 6.83984 7.18997L1.06084 12.97L0.000838757 11.91L5.42484 6.48497L-0.000161171 1.05997Z" fill="black"/>
            </svg>
            </button>
         </div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuideModal;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FootnoteModal = ({ isOpen, onClose, footnotes }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-full max-w-sm max-h-[80vh] rounded-2xl border border-blue-200 bg-white shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-black">
                Footnote Details
              </h2>
              <button onClick={onClose}>
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-5 py-4 text-xs leading-relaxed text-gray-800">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Uncertainty Annotations
              </p>

              {footnotes?.map((fn, index) => (
                <div key={index} className="mb-5">
                  <p className="font-medium text-[12px] text-black mb-1">
                    ({fn.id}) {fn.explanation}
                  </p>

                  <div className="ml-3 space-y-1 text-[11px] text-gray-600">
                    <p>• Prediction: {fn.prediction || 'NOT ENOUGH INFO'}</p>
                    <p>• Confidence: {Number(fn.confidence).toFixed(2)}</p>
                    <p>• Type: {fn.type || 'evidential'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FootnoteModal;
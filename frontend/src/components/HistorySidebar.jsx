// components/HistorySidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../services/firebase';
import { getUserQuestions } from '../services/firebase';
import logoSmall from '../assets/logo-small.png';

const FEEDBACK_FORM_URL = "https://forms.google.com/your-form-url"; // Replace with your actual form URL

export const HistorySidebar = ({ isOpen, onClose, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      fetchConversations();
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const convs = await getUserQuestions(auth.currentUser.uid);
      setConversations(convs);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conv) => {
    if (onSelectConversation) {
      onSelectConversation(conv);
    }
    onClose();
  };

  const handleFeedback = () => {
    window.open(FEEDBACK_FORM_URL, '_blank');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onClose();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -157 }}
        animate={{ x: 0 }}
        exit={{ x: -157 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 z-40"
        style={{
          width: '157px',
          height: '100vh',
          border: '1px solid #B8B8B8',
          background: '#FFF'
        }}
      >
        {/* Header with logo and title */}
        <div 
          className="flex items-center gap-2 px-3 py-3 border-b"
          style={{ borderColor: '#B8B8B8' }}
        >
          <img src={logoSmall} alt="h4h" className="w-5 h-5" />
          <span
            style={{
              color: '#000',
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 'normal'
            }}
          >
            history
          </span>
        </div>

        {/* Conversations list */}
        <div 
          className="overflow-y-auto"
          style={{ 
            height: 'calc(100vh - 180px)' // Adjust for header + bottom buttons
          }}
        >
          {loading ? (
            <div className="p-4 text-center">
              <p style={{ fontSize: '10px', color: '#A0A0A0' }}>Loading...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p style={{ fontSize: '10px', color: '#A0A0A0' }}>No history yet</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv)}
                  className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                  style={{
                    border: '1px solid #E0E0E0'
                  }}
                >
                  <p
                    className="truncate"
                    style={{
                      color: '#000',
                      fontFamily: 'Inter',
                      fontSize: '10px',
                      fontWeight: 500,
                      lineHeight: 'normal'
                    }}
                  >
                    {conv.questionText}
                  </p>
                  <p
                    style={{
                      color: '#A0A0A0',
                      fontFamily: 'Inter',
                      fontSize: '8px',
                      fontWeight: 400,
                      lineHeight: 'normal',
                      marginTop: '4px'
                    }}
                  >
                    {conv.timestamp?.toDate ? conv.timestamp.toDate().toLocaleDateString() : 'Recently'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom buttons - Fixed at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{ width: '157px' }}
        >
          {/* Give us feedback button */}
          <button
            onClick={handleFeedback}
            className="w-full flex items-center justify-between px-3"
            style={{
              height: '44px',
              border: '1px solid #B8B8B8',
              background: '#CEEEE4'
            }}
          >
            <span
              style={{
                color: '#000',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 'normal'
              }}
            >
              Give us feedback!
            </span>
            <div className="relative" style={{ width: '19px', height: '19px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                <circle cx="9.5" cy="9.5" r="9.5" fill="black"/>
              </svg>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="9" 
                height="10" 
                viewBox="0 0 9 10" 
                fill="none"
                className="absolute top-1/2 left-1/2"
                style={{ 
                  transform: 'translate(-50%, -50%) rotate(35deg)'
                }}
              >
                <path d="M6.50978 0.750077L0.750062 8.9758M6.50978 0.750077L7.76882 5.40358M6.50978 0.750077L1.7063 1.15856" stroke="#FEFAFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3"
            style={{
              height: '57px',
              border: '1px solid #B8B8B8',
              background: '#FFF'
            }}
          >
            <span
              style={{
                color: '#000',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 'normal'
              }}
            >
              Logout
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="15" 
              height="10" 
              viewBox="0 0 15 10" 
              fill="none"
            >
              <path d="M14 5H1M14 5L10 9M14 5L10 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Overlay/backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 z-30"
        onClick={onClose}
      />
    </AnimatePresence>
  );
};

export default HistorySidebar;
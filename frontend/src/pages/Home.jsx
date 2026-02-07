// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuideModal } from '../components/GuideModal';
import logoShort from '../assets/logo-short.png';

export const Home = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen guide before
    const seenGuide = localStorage.getItem('h4h_seen_guide');
    if (!seenGuide) {
      setShowGuide(true);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    setHasSeenGuide(true);
    localStorage.setItem('h4h_seen_guide', 'true');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <img src={logoShort} alt="h4h" className="w-10 h-10" />
          <span className="font-bold text-lg">human4human</span>
        </div>

        {/* Guide button */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          style={{
            fontSize: '12px',
            fontFamily: 'Inter'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Guide
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">What's in your mind?</h1>
          <p className="text-gray-600 mb-8">
            Try to ask me anything!
          </p>

          {/* Input area */}
          <div className="relative">
            <input
              type="text"
              placeholder="Type your question here..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={handleCloseGuide}
      />
    </div>
  );
};

export default Home;
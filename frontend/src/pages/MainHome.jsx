// pages/MainHome.jsx
import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateAnswer } from '../services/gemini';
import { annotateText } from '../services/annotation';
import MarkerBadge from '../components/MarkerBadge';
import GuideModal from '../components/GuideModal';
import logoShort from '../assets/logo-short.png';
import logoSmall from '../assets/logo-small.png';

const MainHome = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const scrollRef = useRef(null);

  // Check if user has seen guide before
  useEffect(() => {
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

  const handleSend = async () => {
    if (!question.trim()) return;

    const userQuery = question;
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      const raw = await generateAnswer(userQuery);
      const annotatedData = await annotateText(raw);

      const newResponse = {
        role: 'assistant',
        text: annotatedData.annotated_text,
        footnotes: annotatedData.footnotes,
        task: annotatedData.task_detected
      };

      setChat(prev => [...prev, newResponse]);

      await addDoc(collection(db, 'questions'), {
        userId: auth.currentUser.uid,
        questionText: userQuery,
        annotatedAnswer: annotatedData.annotated_text,
        footnotes: annotatedData.footnotes,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error("Error in chat flow:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-start">
        {/* Left side - History and Logo */}
        <div className="flex flex-col gap-8">
          {/* History icon with text */}
          <div className="flex items-center gap-2">
            <button className="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
                <path d="M8.92279 1.97591C9.18529 1.18841 8.75873 0.339975 7.97591 0.077475C7.1931 -0.185025 6.33998 0.241538 6.07748 1.02435L0.0774751 19.0244C-0.185025 19.8119 0.241537 20.6603 1.02435 20.9228C1.80716 21.1853 2.66029 20.7587 2.92279 19.9759L8.92279 1.97591ZM12.2462 0.0212252C11.4306 -0.114712 10.6572 0.438412 10.5212 1.25404L7.52122 19.254C7.38529 20.0697 7.93841 20.8431 8.75404 20.979C9.56966 21.115 10.3431 20.5619 10.479 19.7462L13.479 1.74623C13.615 0.9306 13.0618 0.157163 12.2462 0.0212252ZM16.4978 0.00247509C15.6681 0.00247509 14.9978 0.672788 14.9978 1.50248V19.5025C14.9978 20.3322 15.6681 21.0025 16.4978 21.0025C17.3275 21.0025 17.9978 20.3322 17.9978 19.5025V1.50248C17.9978 0.672788 17.3275 0.00247509 16.4978 0.00247509Z" fill="black"/>
              </svg>
            </button>

            {/* human4human logo text */}
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: 'normal',
                background: 'linear-gradient(90deg, #000 0%, #715579 50%, #96C8F4 75%, #57EFBD 87.5%, #E2A9F1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              human4human
            </span>
          </div>
        </div>

        {/* Right side - Guide button */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex flex-col items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
            <path d="M11.375 0H1.625C0.73125 0 0 0.765 0 1.7V15.3C0 16.235 0.73125 17 1.625 17H11.375C12.2688 17 13 16.235 13 15.3V1.7C13 0.765 12.2688 0 11.375 0ZM1.625 1.7H5.6875V8.5L3.65625 7.225L1.625 8.5V1.7Z" fill="black"/>
          </svg>
          <span
            style={{
              width: '31px',
              height: '12px',
              color: '#000',
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: 400,
              lineHeight: 'normal'
            }}
          >
            Guide
          </span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {chat.length === 0 ? (
          <div className="flex flex-col items-center text-center">
            {/* Main heading with gradient */}
            <h1
              className="mb-8"
              style={{
                fontFamily: 'Inter',
                fontSize: '24px',
                fontWeight: 400,
                lineHeight: 'normal',
                background: 'linear-gradient(90deg, #000 0%, #715579 19.23%, #459DEA 50%, #5CC5A2 80.29%, #B652D1 94.71%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              What's in your mind?
            </h1>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-3xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-purple-50 text-gray-800 rounded-tl-none border border-purple-100'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="space-y-4">
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.footnotes && (
                        <div className="mt-4 pt-3 border-t border-purple-200">
                          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Footnotes</p>
                          {msg.footnotes.map(fn => (
                            <p key={fn.id} className="text-xs text-gray-500 mb-1">
                              <span className="font-bold">({fn.id})</span> {fn.explanation}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-purple-400 animate-pulse">Analyzing certainty...</div>}
            <div ref={scrollRef} />
          </div>
        )}
      </main>

      {/* Input area - fixed at bottom */}
      <div className="px-6 pb-6">
        <div
          className="relative flex items-center"
          style={{
            width: '344px',
            height: '44px',
            borderRadius: '22px',
            border: '1px solid #DFDFDF',
            background: '#FFF',
            padding: '0 12px'
          }}
        >
          {/* Logo small */}
          <img 
            src={logoSmall} 
            alt="h4h" 
            className="w-6 h-6 mr-2"
          />

          {/* Input */}
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none"
            placeholder="try to ask me anything!"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{
              color: 'rgba(0, 0, 0, 0.41)',
              fontFamily: 'Inter',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: 'normal'
            }}
          />

          {/* Send button */}
          <button 
            onClick={handleSend}
            className="flex-shrink-0 relative"
            style={{
              width: '25px',
              height: '25px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
              <circle cx="12.5" cy="12.5" r="12.5" fill="#DFDFDF"/>
            </svg>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="16" 
              viewBox="0 0 14 16" 
              fill="none"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <path d="M7 1L13 7M7 1L1 7M7 1V15" stroke="#F6F6F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={handleCloseGuide}
      />
    </div>
  );
};

export default MainHome;
// pages/MainHome.jsx
import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { generateAnswer } from '../services/gemini';
import { annotateText } from '../services/annotation';
import { askH4H } from '../controllers/QuestionController';
import { getQuestionsCount } from '../services/firebase';
import { AnnotatedText } from '../components/AnnotatedText';
import GuideModal from '../components/GuideModal';
import FootnoteModal from '../components/FootnoteModal';
import HistorySidebar from '../components/HistorySidebar';
import logoShort from '../assets/logo-short.png';
import logoSmall from '../assets/logo-small.png';

const QUESTION_LIMIT = 5;
const FEEDBACK_FORM_URL = "https://forms.google.com/your-form-url"; // Replace with your actual form URL

const MainHome = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedFootnotes, setSelectedFootnotes] = useState(null);
  const [showFootnoteModal, setShowFootnoteModal] = useState(false);
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

  // Get question count
  useEffect(() => {
    const getQuestionCount = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'questions'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        setQuestionCount(querySnapshot.size);
      }
    };
    getQuestionCount();
  }, [chat]);

  const handleCloseGuide = () => {
    setShowGuide(false);
    setHasSeenGuide(true);
    localStorage.setItem('h4h_seen_guide', 'true');
  };

  const handleFootnoteClick = (footnotes) => {
    setSelectedFootnotes(footnotes);
    setShowFootnoteModal(true);
  };

  const [showHistory, setShowHistory] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;
    if (questionCount >= QUESTION_LIMIT) return;

    const userQuery = question;
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      // Use the QuestionController
      const result = await askH4H(userQuery);

      const newResponse = {
        role: 'assistant',
        text: result.annotatedText,
        footnotes: result.footnotes,
        task: result.taskDetected
      };

      setChat(prev => [...prev, newResponse]);
      
      // Update question count
      const newCount = await getQuestionsCount(auth.currentUser.uid);
      setQuestionCount(newCount);

    } catch (error) {
      console.error("Error in chat flow:", error);
      // Show error message to user
      setChat(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, there was an error processing your question. Please try again.',
        footnotes: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = () => {
    window.open(FEEDBACK_FORM_URL, '_blank');
  };

  const handleSelectConversation = (conv) => {
  setChat([
    { role: 'user', text: conv.questionText },
    { 
      role: 'assistant', 
      text: conv.annotatedText,
      footnotes: conv.footnotes,
      task: conv.taskDetected
    }
  ]);
};

  // pages/MainHome.jsx - Make fully responsive
  return (
    <div className="flex flex-col h-screen bg-white w-full max-w-md mx-auto relative">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start">
        {/* Left side - History and Logo */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowHistory(true)}
              className="flex flex-col items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
                <path d="M8.92279 1.97591C9.18529 1.18841 8.75873 0.339975 7.97591 0.077475C7.1931 -0.185025 6.33998 0.241538 6.07748 1.02435L0.0774751 19.0244C-0.185025 19.8119 0.241537 20.6603 1.02435 20.9228C1.80716 21.1853 2.66029 20.7587 2.92279 19.9759L8.92279 1.97591ZM12.2462 0.0212252C11.4306 -0.114712 10.6572 0.438412 10.5212 1.25404L7.52122 19.254C7.38529 20.0697 7.93841 20.8431 8.75404 20.979C9.56966 21.115 10.3431 20.5619 10.479 19.7462L13.479 1.74623C13.615 0.9306 13.0618 0.157163 12.2462 0.0212252ZM16.4978 0.00247509C15.6681 0.00247509 14.9978 0.672788 14.9978 1.50248V19.5025C14.9978 20.3322 15.6681 21.0025 16.4978 21.0025C17.3275 21.0025 17.9978 20.3322 17.9978 19.5025V1.50248C17.9978 0.672788 17.3275 0.00247509 16.4978 0.00247509Z" fill="black"/>
              </svg>
            </button>
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
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-24 pt-6 sm:pt-8">
        {chat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <h1
              className="text-xl sm:text-2xl"
              style={{
                fontFamily: 'Inter',
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
          <div className="w-full space-y-3 sm:space-y-4">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  /* User message bubble */
                  <div
                    className="max-w-[80%] px-4 py-3"
                    style={{
                      borderRadius: '8px',
                      background: 'rgba(243, 198, 255, 0.45)',
                      color: '#000',
                      fontFamily: 'Inter',
                      fontSize: '12px',
                      fontWeight: 400,
                      lineHeight: '16px'
                    }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  /* AI response - NO BUBBLE, just text with colored markers */
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className="py-2"
                      style={{
                        color: '#000',
                        fontFamily: 'Inter',
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: '18px'
                      }}
                    >
                      <AnnotatedText text={msg.text} />
                    </div>

                    {/* Footnote details button */}
                    {msg.footnotes && msg.footnotes.length > 0 && (
                      <button
                        onClick={() => handleFootnoteClick(msg.footnotes)}
                        className="flex items-center gap-2"
                        style={{
                          width: '142px',
                          height: '26px',
                          borderRadius: '8px',
                          border: '1px solid #A0A0A0',
                          padding: '0 12px',
                          background: 'white'
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
                          footnote details
                        </span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="13" 
                          height="8" 
                          viewBox="0 0 13 8" 
                          fill="none"
                        >
                          <path d="M11.91 2.19345e-05L12.97 1.06102L7.193 6.84002C7.10043 6.93318 6.99036 7.0071 6.86911 7.05755C6.74786 7.108 6.61783 7.13397 6.4865 7.13397C6.35517 7.13397 6.22514 7.108 6.10389 7.05755C5.98264 7.0071 5.87257 6.93318 5.78 6.84002L0 1.06102L1.06 0.00102186L6.485 5.42502L11.91 2.19345e-05Z" fill="#A0A0A0"/>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div 
                className="text-left"
                style={{
                  color: '#A0A0A0',
                  fontFamily: 'Inter',
                  fontSize: '10px',
                  fontStyle: 'italic'
                }}
              >
                Analyzing certainty...
              </div>
            )}

            {questionCount >= QUESTION_LIMIT && (
              <div
                className="p-3 sm:p-4 w-full max-w-[339px]"
                style={{
                  borderRadius: '8px',
                  background: '#CEEEE4'
                }}
              >
                <p
                  className="mb-2"
                  style={{
                    color: '#000',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: 'normal'
                  }}
                >
                  You have reached your limit (5 questions), let's give the feedback to us!
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={handleFeedback}
                    style={{
                      width: '87px',
                      height: '20px',
                      borderRadius: '8px',
                      background: '#43A047',
                      color: '#FFF',
                      fontFamily: 'Inter',
                      fontSize: '10px',
                      fontWeight: 500,
                      lineHeight: 'normal',
                      textDecoration: 'underline'
                    }}
                  >
                    give feedback
                  </button>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        )}
      </main>

      {/* Input area - fixed at bottom */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white">
        <div
          className="relative flex items-center w-full"
          style={{
            maxWidth: '344px',
            height: '44px',
            borderRadius: '22px',
            border: '1px solid #DFDFDF',
            background: '#FFF',
            padding: '0 12px',
            margin: '0 auto'
          }}
        >
          <img src={logoSmall} alt="h4h" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none"
            placeholder="try to ask me anything!"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={questionCount >= QUESTION_LIMIT}
            style={{
              color: 'rgba(0, 0, 0, 0.41)',
              fontFamily: 'Inter',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: 'normal'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={questionCount >= QUESTION_LIMIT}
            className="flex-shrink-0 relative"
            style={{
              width: '25px',
              height: '25px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
              <circle cx="12.5" cy="12.5" r="12.5" fill={question.trim() && questionCount < QUESTION_LIMIT ? "#000" : "#DFDFDF"} />
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

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={handleCloseGuide}
      />

      {/* Footnote Modal */}
      <FootnoteModal 
        isOpen={showFootnoteModal}
        onClose={() => setShowFootnoteModal(false)}
        footnotes={selectedFootnotes}
      />

      <HistorySidebar 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
};

export default MainHome;